import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import {
  getImageBase64String,
  getIsoLanguage,
  getPointsBoundingBox,
  getRectPoints,
  recogniseText,
  translateText
} from "../../common/ImageUtils";
import { regex, Rect } from "../../services/Types";
import { detectDelimiter } from "../../utils/detectDelimiter";
import { detectNextTextRegion } from "../../utils/detectNextTextRegion";
import { floodFillRegion } from "../../utils/floodFillRegion";
import { getBaseSize, ZoomPanImageHandle } from "../../components/ZoomPanImage";
import { AVATAR_RADIUS, Region } from "./ImageRegionOverlay";
import { LAYOUT_ITEMS } from "./Recognitions";

// Natural-pixel point currently at the top-left corner of the ZoomPanImage viewport, plus the
// natural-pixel size of one screen pixel at the current zoom (so a caller can add a fixed
// screen-space offset instead of one that balloons in natural-pixel terms as zoom increases).
const getVisibleTopLeft = (handle: ZoomPanImageHandle) => {
  const { element, naturalSize, mobile, scale, position } = handle;
  if (!element || !naturalSize) {
    return null;
  }
  const { baseWidth } = getBaseSize(element.clientWidth, element.clientHeight, naturalSize);
  const baseScale = baseWidth / naturalSize.width;
  const naturalPerScreenPixel = 1 / (baseScale * scale);
  if (mobile) {
    return {
      x: naturalSize.width / 2 + (-element.clientWidth / 2 - position.x) / scale / baseScale,
      y: naturalSize.height / 2 + (-element.clientHeight / 2 - position.y) / scale / baseScale,
      naturalPerScreenPixel
    };
  }
  return {
    x: element.scrollLeft / (baseScale * scale),
    y: element.scrollTop / (baseScale * scale),
    naturalPerScreenPixel
  };
};

export const useRecognitions = ({
  open,
  src,
  layout,
  regions: initialRegions,
  zoomPanRef,
  rightScrollRef,
  mobile,
  onRegionSelected
}: {
  open: boolean;
  src: string;
  layout: string;
  regions: Region[];
  zoomPanRef: RefObject<ZoomPanImageHandle | null>;
  rightScrollRef: RefObject<HTMLDivElement | null>;
  mobile: boolean;
  onRegionSelected?: () => void;
}) => {
  const [regions, setRegions] = useState<Region[]>(initialRegions);
  const [selectedLayout, setSelectedLayout] = useState(layout);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [selectedRegionIndex, setSelectedRegionIndex] = useState<number | null>(null);
  const [translatingRegionIndices, setTranslatingRegionIndices] = useState<Set<number>>(new Set());
  const [autoExpandingRegionIndices, setAutoExpandingRegionIndices] = useState<Set<number>>(new Set());
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const focusRegion = (region: Region) => {
    const handle = zoomPanRef.current;
    if (!handle || !handle.element || !handle.naturalSize) {
      return;
    }
    const { element, naturalSize, scale } = handle;
    const rect = getPointsBoundingBox(region.points);
    const { baseWidth } = getBaseSize(element.clientWidth, element.clientHeight, naturalSize);
    const baseScale = baseWidth / naturalSize.width;

    if (handle.mobile) {
      const centerOffset = {
        x: (rect.x + rect.width / 2 - naturalSize.width / 2) * baseScale,
        y: (rect.y + rect.height / 2 - naturalSize.height / 2) * baseScale
      };
      handle.setPosition({ x: -scale * centerOffset.x, y: -scale * centerOffset.y }, scale);
    } else {
      requestAnimationFrame(() => {
        const scrolledElement = handle.element;
        if (!scrolledElement) {
          return;
        }
        const scrollBaseScale = baseScale * scale;
        scrolledElement.scrollTo({
          left: (rect.x + rect.width / 2) * scrollBaseScale - scrolledElement.clientWidth / 2,
          top: (rect.y + rect.height / 2) * scrollBaseScale - scrolledElement.clientHeight / 2,
          behavior: "smooth"
        });
      });
    }
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

  const performTranslation = async (index: number, text: string, sourceLanguage: string, targetLanguage: string) => {
    setTranslatingRegionIndices((prev) => new Set(prev).add(index));
    if (sourceLanguage === targetLanguage) {
      setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, translatedText: text } : r)));
    } else {
      const translatedText = await translateText(text, sourceLanguage, targetLanguage);
      setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, translatedText } : r)));
    }
    setTranslatingRegionIndices((prev) => {
      const next = new Set(prev);
      next.delete(index);
      return next;
    });
  };

  const recognizeRegionText = async (index: number, region: Region, language: string) => {
    const isTextRecognitionEnabled =
      LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isTextRecognitionEnabled ?? true;
    if (!isTextRecognitionEnabled) {
      return;
    }
    const canvas = await ensureImageCanvas();
    const rect = getPointsBoundingBox(region.points);
    const base64 = getImageBase64String(canvas, {
      x: Math.round(rect.x),
      y: Math.round(rect.y),
      width: Math.round(rect.width),
      height: Math.round(rect.height)
    });
    if (!base64) {
      return;
    }
    const recognisedText = await recogniseText(base64, language);
    const text =
      selectedLayout === "quiz" && (region.type ?? "question") === "question"
        ? recognisedText.replace(regex.QUESTION_NUMBER, "")
        : recognisedText;
    const delimiter = region.type === "answers" && !region.delimiter ? detectDelimiter(text) : undefined;
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, text, ...(delimiter && { delimiter }) } : r)));
    if (controlGroupState === 3 && text && region.translateLanguage) {
      await performTranslation(index, text, getIsoLanguage(language), region.translateLanguage);
    }
  };

  const onAddRegionClick = async () => {
    const isPolygonEnabled = LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isPolygonEnabled ?? false;
    const defaultSize = AVATAR_RADIUS * 2 + 8;
    const defaultWidth = isPolygonEnabled ? defaultSize : 240;
    const defaultHeight = isPolygonEnabled ? defaultSize : 135;

    const handle = zoomPanRef.current;
    const visibleTopLeft = handle ? getVisibleTopLeft(handle) : null;
    const naturalPerScreenPixel = visibleTopLeft?.naturalPerScreenPixel ?? 1;
    const naturalSize = handle?.naturalSize;
    const maxX = naturalSize ? Math.max(0, naturalSize.width - defaultWidth) : Infinity;
    const maxY = naturalSize ? Math.max(0, naturalSize.height - defaultHeight) : Infinity;
    // If the viewport's visible corner is outside the image (panned/scrolled past its edge), anchor
    // the same top/left space to the image's own edge instead, rather than flush against it with no gap.
    const anchorX = Math.min(Math.max(visibleTopLeft?.x ?? 0, 0), naturalSize?.width ?? Infinity);
    const anchorY = Math.min(Math.max(visibleTopLeft?.y ?? 0, 0), naturalSize?.height ?? Infinity);
    const defaultX = Math.min(Math.max(anchorX + 80 * naturalPerScreenPixel, 0), maxX);
    const defaultY = Math.min(Math.max(anchorY + (mobile ? 40 : 120) * naturalPerScreenPixel, 0), maxY);
    const isAutoRegionDetectionEnabled =
      LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isAutoRegionDetectionEnabled ?? false;
    let rect: Rect;
    if (isAutoRegionDetectionEnabled) {
      const lastRegion = regions.length > 0 ? regions[regions.length - 1] : null;
      const lastRegionRect = lastRegion ? getPointsBoundingBox(lastRegion.points) : null;
      const y = lastRegionRect ? lastRegionRect.y + lastRegionRect.height : defaultY;
      const canvas = await ensureImageCanvas();
      const nextRegion = canvas ? detectNextTextRegion(canvas, y) : null;
      rect = nextRegion ?? { x: defaultX, y, width: defaultWidth, height: defaultHeight };
    } else {
      rect = { x: defaultX, y: defaultY, width: defaultWidth, height: defaultHeight };
    }
    const newRegion: Region = { points: getRectPoints(rect) };
    const newIndex = regions.length;
    setRegions((prev) => [...prev, newRegion]);
    setSelectedRegionIndex(newIndex);
    setControlGroupState(0);
    requestAnimationFrame(() => {
      rightScrollRef.current?.scrollTo({ top: rightScrollRef.current.scrollHeight, behavior: "smooth" });
    });
    await recognizeRegionText(newIndex, newRegion, newRegion.recogniseLanguage ?? "eng");
  };

  const onDeleteSelectedRegionClick = useCallback(() => {
    if (selectedRegionIndex === null) {
      return;
    }
    setRegions((prev) => prev.filter((_, i) => i !== selectedRegionIndex));
    setSelectedRegionIndex(null);
  }, [selectedRegionIndex]);

  useEffect(() => {
    if (!open || selectedRegionIndex === null) {
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
  }, [open, selectedRegionIndex, onDeleteSelectedRegionClick]);

  const onRegionMouseUp = async (index: number) => {
    const region = regions[index];
    if (!region) {
      return;
    }
    await recognizeRegionText(index, region, region.recogniseLanguage ?? "eng");
  };

  const onRegionLanguageChange = async (index: number, language: string) => {
    const region = regions[index];
    if (!region) {
      return;
    }
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, recogniseLanguage: language } : r)));
    await recognizeRegionText(index, region, language);
  };

  const onRegionTextChange = (index: number, text: string) => {
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, text } : r)));
  };

  const onRegionTextBlur = async (index: number) => {
    if (controlGroupState !== 3) {
      return;
    }
    const region = regions[index];
    if (!region || !region.text || !region.translateLanguage) {
      return;
    }
    await performTranslation(
      index,
      region.text,
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
    regions.forEach(async (region, index) => {
      if (!region.text || region.translatedText) {
        return;
      }
      const targetLanguage = region.translateLanguage ?? "";
      if (!targetLanguage) {
        return;
      }
      await performTranslation(index, region.text, getIsoLanguage(region.recogniseLanguage ?? "eng"), targetLanguage);
    });
  };

  const onRegionTypeChange = (index: number, type: string) => {
    setRegions((prev) =>
      prev.map((r, i) => {
        if (i !== index) {
          return r;
        }
        const delimiter = type === "answers" && !r.delimiter && r.text ? detectDelimiter(r.text) : r.delimiter;
        return { ...r, type: type as Region["type"], delimiter };
      })
    );
  };

  const onRegionDelimiterChange = (index: number, delimiter: string) => {
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, delimiter } : r)));
  };

  const onRegionCorrectAnswerIndicesChange = (index: number, correctAnswerIndices: number[]) => {
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, correctAnswerIndices } : r)));
  };

  const onRegionTranslateLanguageChange = async (index: number, translateLanguage: string) => {
    const region = regions[index];
    if (!region || !region.text) {
      setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, translateLanguage } : r)));
      return;
    }
    setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, translateLanguage } : r)));
    await performTranslation(index, region.text, getIsoLanguage(region.recogniseLanguage ?? "eng"), translateLanguage);
  };

  const onRegionSelect = (index: number | null) => {
    setSelectedRegionIndex(index);
    onRegionSelected?.();
    if (index === null) {
      return;
    }
    const row = rightScrollRef.current?.querySelector<HTMLElement>(`[data-region-index="${index}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const onRegionAvatarClick = (index: number) => {
    onRegionSelect(index);
    const region = regions[index];
    if (region) {
      focusRegion(region);
    }
  };

  const onAutoExpandRegionClick = async (index: number) => {
    const region = regions[index];
    if (!region) {
      return;
    }
    setAutoExpandingRegionIndices((prev) => new Set(prev).add(index));
    try {
      const canvas = await ensureImageCanvas();
      if (!canvas) {
        return;
      }
      const rect = getPointsBoundingBox(region.points);
      const filledPoints = await floodFillRegion(canvas, rect.x + rect.width / 2, rect.y + rect.height / 2);
      if (filledPoints) {
        setRegions((prev) => prev.map((r, i) => (i === index ? { ...r, points: filledPoints } : r)));
      }
    } finally {
      setAutoExpandingRegionIndices((prev) => {
        const next = new Set(prev);
        next.delete(index);
        return next;
      });
    }
  };

  const effectiveControlGroupState = regions.length === 0 ? 0 : controlGroupState;

  return {
    regions,
    setRegions,
    selectedLayout,
    controlGroupState: effectiveControlGroupState,
    setControlGroupState,
    selectedRegionIndex,
    translatingRegionIndices,
    autoExpandingRegionIndices,
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
    onDeleteSelectedRegionClick,
    onAutoExpandRegionClick
  };
};
