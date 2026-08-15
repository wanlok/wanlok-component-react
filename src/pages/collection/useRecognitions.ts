import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  getImageBase64String,
  getIsoLanguage,
  recognizeText,
  translateText
} from "../../common/ImageUtils";
import { regex, Rect } from "../../services/Types";
import { detectDelimiter } from "../../utils/detectDelimiter";
import { detectNextTextRegion } from "../../utils/detectNextTextRegion";
import { TextRegion } from "./ImageRegionOverlay";
import { LAYOUT_ITEMS } from "./Recognitions";

export const useRecognitions = ({
  open,
  src,
  layout,
  textRegions,
  imageScrollRef,
  rightScrollRef,
  onRegionSelected
}: {
  open: boolean;
  src: string;
  layout: string;
  textRegions: TextRegion[];
  imageScrollRef: RefObject<HTMLDivElement | null>;
  rightScrollRef: RefObject<HTMLDivElement | null>;
  onRegionSelected?: () => void;
}) => {
  const [regions, setRegions] = useState<TextRegion[]>(textRegions);
  const [selectedLayout, setSelectedLayout] = useState(layout);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [translatingRegionIds, setTranslatingRegionIds] = useState<Set<string>>(new Set());
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const scrollImageToRegion = (region: TextRegion) => {
    const container = imageScrollRef.current;
    if (!container) {
      return;
    }
    container.scrollTo({
      left: region.x - container.clientWidth / 2 + region.width / 2,
      top: region.y - container.clientHeight / 2 + region.height / 2,
      behavior: "smooth"
    });
  };

  const ensureImageCanvas = async () => {
    if (!imageCanvasRef.current) {
      const img = new Image();
      img.crossOrigin = "anonymous";
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve();
        img.onerror = () => reject();
        img.src = src;
      });
      const canvas = document.createElement("canvas");
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      imageCanvasRef.current = canvas;
    }
    return imageCanvasRef.current;
  };

  const performTranslation = async (regionId: string, text: string, sourceLanguage: string, targetLanguage: string) => {
    setTranslatingRegionIds((prev) => new Set(prev).add(regionId));
    if (sourceLanguage === targetLanguage) {
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translatedText: text } : r)));
    } else {
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translatedText } : r)));
    }
    setTranslatingRegionIds((prev) => {
      const next = new Set(prev);
      next.delete(regionId);
      return next;
    });
  };

  const recognizeRegionText = async (region: TextRegion, language: string) => {
    const canvas = await ensureImageCanvas();
    const base64 = getImageBase64String(canvas, {
      x: Math.round(region.x),
      y: Math.round(region.y),
      width: Math.round(region.width),
      height: Math.round(region.height)
    });
    if (!base64) {
      return;
    }
    const recognisedText = await recognizeText(base64, language);
    const text =
      selectedLayout === "quiz" && (region.type ?? "question") === "question"
        ? recognisedText.replace(regex.QUESTION_NUMBER, "")
        : recognisedText;
    const delimiter = region.type === "answers" && !region.delimiter ? detectDelimiter(text) : undefined;
    setRegions((prev) =>
      prev.map((r) => (r.id === region.id ? { ...r, recognisedText: text, ...(delimiter && { delimiter }) } : r))
    );
    if (controlGroupState === 3 && text && region.translateLanguage) {
      await performTranslation(region.id, text, getIsoLanguage(language), region.translateLanguage);
    }
  };

  const onAddRegionClick = async () => {
    const container = imageScrollRef.current;
    const defaultX = (container?.scrollLeft ?? 0) + 80;
    const defaultY = (container?.scrollTop ?? 0) + 40;
    const defaultWidth = 240;
    const defaultHeight = 135;
    const isAutoRegionDetectionEnabled =
      LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isAutoRegionDetectionEnabled ?? false;
    let region: Rect;
    if (isAutoRegionDetectionEnabled) {
      const lastRegion = regions.length > 0 ? regions[regions.length - 1] : null;
      const y = lastRegion ? lastRegion.y + lastRegion.height : defaultY;
      const canvas = await ensureImageCanvas();
      const nextRegion = canvas ? detectNextTextRegion(canvas, y) : null;
      region = nextRegion ?? { x: defaultX, y, width: defaultWidth, height: defaultHeight };
    } else {
      region = { x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight };
    }
    const newRegion: TextRegion = { id: String(Date.now()), ...region };
    setRegions((prev) => [...prev, newRegion]);
    setControlGroupState(0);
    scrollImageToRegion(newRegion);
    requestAnimationFrame(() => {
      rightScrollRef.current?.scrollTo({ top: rightScrollRef.current.scrollHeight, behavior: "smooth" });
    });
    await recognizeRegionText(newRegion, newRegion.recogniseLanguage ?? "eng");
  };

  const onDeleteSelectedRegionClick = useCallback(() => {
    if (!selectedRegionId) {
      return;
    }
    setRegions((prev) => prev.filter((r) => r.id !== selectedRegionId));
    setSelectedRegionId(null);
  }, [selectedRegionId]);

  useEffect(() => {
    if (!open || !selectedRegionId) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "Backspace" && e.key !== "Delete") {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) {
        return;
      }
      onDeleteSelectedRegionClick();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, selectedRegionId, onDeleteSelectedRegionClick]);

  const onRegionMouseUp = async (regionId: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
    await recognizeRegionText(region, region.recogniseLanguage ?? "eng");
  };

  const onRegionLanguageChange = async (regionId: string, language: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region) {
      return;
    }
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, recogniseLanguage: language } : r)));
    await recognizeRegionText(region, language);
  };

  const onRegionTextChange = (regionId: string, text: string) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, recognisedText: text } : r)));
  };

  const onRegionTextBlur = async (regionId: string) => {
    if (controlGroupState !== 3) {
      return;
    }
    const region = regions.find((r) => r.id === regionId);
    if (!region || !region.recognisedText || !region.translateLanguage) {
      return;
    }
    await performTranslation(
      regionId,
      region.recognisedText,
      getIsoLanguage(region.recogniseLanguage ?? "eng"),
      region.translateLanguage
    );
  };

  const onLayoutIndexChange = async (value: string) => {
    setSelectedLayout(value);
    setControlGroupState(0);
    if (value !== "translate") {
      return;
    }
    regions.forEach(async (region) => {
      if (!region.recognisedText || region.translatedText) {
        return;
      }
      const targetLanguage = region.translateLanguage ?? "";
      if (!targetLanguage) {
        return;
      }
      await performTranslation(
        region.id,
        region.recognisedText,
        getIsoLanguage(region.recogniseLanguage ?? "eng"),
        targetLanguage
      );
    });
  };

  const onRegionTypeChange = (regionId: string, type: string) => {
    setRegions((prev) =>
      prev.map((r) => {
        if (r.id !== regionId) {
          return r;
        }
        const delimiter =
          type === "answers" && !r.delimiter && r.recognisedText ? detectDelimiter(r.recognisedText) : r.delimiter;
        return { ...r, type: type as TextRegion["type"], delimiter };
      })
    );
  };

  const onRegionDelimiterChange = (regionId: string, delimiter: string) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, delimiter } : r)));
  };

  const onRegionCorrectAnswerIndicesChange = (regionId: string, correctAnswerIndices: number[]) => {
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, correctAnswerIndices } : r)));
  };

  const onRegionTranslateLanguageChange = async (regionId: string, translateLanguage: string) => {
    const region = regions.find((r) => r.id === regionId);
    if (!region || !region.recognisedText) {
      setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translateLanguage } : r)));
      return;
    }
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, translateLanguage } : r)));
    await performTranslation(
      regionId,
      region.recognisedText,
      getIsoLanguage(region.recogniseLanguage ?? "eng"),
      translateLanguage
    );
  };

  const onRegionSelect = (regionId: string | null) => {
    setSelectedRegionId(regionId);
    onRegionSelected?.();
    if (!regionId) {
      return;
    }
    const row = rightScrollRef.current?.querySelector<HTMLElement>(`[data-region-id="${regionId}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onRegionAvatarClick = (regionId: string) => {
    onRegionSelect(regionId);
    const region = regions.find((r) => r.id === regionId);
    if (region) {
      scrollImageToRegion(region);
    }
  };

  const effectiveControlGroupState = regions.length === 0 ? 0 : controlGroupState;

  return {
    regions,
    setRegions,
    selectedLayout,
    controlGroupState: effectiveControlGroupState,
    setControlGroupState,
    selectedRegionId,
    translatingRegionIds,
    onAddRegionClick,
    onRegionMouseUp,
    onRegionLanguageChange,
    onRegionTextChange,
    onRegionTextBlur,
    onLayoutIndexChange,
    onRegionTypeChange,
    onRegionDelimiterChange,
    onRegionCorrectAnswerIndicesChange,
    onRegionTranslateLanguageChange,
    onRegionSelect,
    onRegionAvatarClick,
    onDeleteSelectedRegionClick
  };
};
