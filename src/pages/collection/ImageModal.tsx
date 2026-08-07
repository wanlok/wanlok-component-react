import { useEffect, useRef, useState } from "react";
import { alpha, Avatar, Box, ButtonBase, Skeleton, Stack, Typography } from "@mui/material";
import {
  Add as AddIcon,
  Close as CloseIcon,
  CropFree as CropFreeIcon,
  SwapHoriz as SwapHorizIcon,
  ZoomIn as ZoomInIcon,
  ZoomOut as ZoomOutIcon,
  Image as ImageIcon,
  ViewList as ViewListIcon
} from "@mui/icons-material";
import { useMediaQuery, useTheme } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { WModal } from "../../components/WModal";
import { iconButtonSx, WButton } from "../../components/WButton";
import { YesNoButtons } from "../../components/YesNoButtons";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
import { StyledContainer } from "../../components/StyledContainer";
import { CheckboxInput } from "../../components/CheckboxInput";
import {
  getImageBase64String,
  getIsoLanguage,
  LANGUAGE_ITEMS,
  recognizeText,
  TRANSLATE_LANGUAGE_ITEMS,
  translateText
} from "../../common/ImageUtils";
import { ImageRegionOverlay, TextRegion } from "./ImageRegionOverlay";
import { ControlGroup } from "../../components/ControlGroup";
import { regex, Rect } from "../../services/Types";
import { splitAnswers } from "../../utils/splitAnswers";
import { detectDelimiter } from "../../utils/detectDelimiter";
import { detectNextTextRegion } from "../../utils/detectNextTextRegion";

const LAYOUT_ITEMS = [
  { label: "Default", value: "default", isAutoRegionDetectionEnabled: false },
  { label: "Default + Search", value: "default+search", isAutoRegionDetectionEnabled: false },
  { label: "Default + Translate", value: "default+translate", isAutoRegionDetectionEnabled: false },
  { label: "Quiz", value: "quiz", isAutoRegionDetectionEnabled: true }
];

const QUIZ_TYPE_ITEMS = [
  { label: "Question", value: "question" },
  { label: "Answers", value: "answers" }
];

const ANSWER_DELIMITER_ITEMS = [
  { label: "A. ..., B. ..., C. ..., D. ..., ...", value: "letterDot" },
  { label: "A) ..., B) ..., C) ..., D) ..., ...", value: "letterParen" },
  { label: "1. ..., 2. ..., 3. ..., 4. ..., ...", value: "numberDot" },
  { label: "1) ..., 2) ..., 3) ..., 4) ..., ...", value: "numberParen" },
  { label: "i. ..., ii. ..., iii. ..., iv. ..., ...", value: "romanDot" },
  { label: "i) ..., ii) ..., iii) ..., iv) ..., ...", value: "romanParen" },
  { label: "- ..., - ..., - ..., - ..., ...", value: "dash" }
];

const DefaultTranslateContainer = ({
  translateLanguage,
  translatedText,
  isTranslating,
  onTranslateLanguageChange
}: {
  translateLanguage: string;
  translatedText: string;
  isTranslating: boolean;
  onTranslateLanguageChange: (language: string) => void;
}) => (
  <>
    <SelectInput
      label="Translate Language"
      items={TRANSLATE_LANGUAGE_ITEMS}
      value={translateLanguage}
      onChange={onTranslateLanguageChange}
    />
    {isTranslating && <Skeleton variant="rectangular" height={24} />}
    {!isTranslating && translatedText && (
      <Typography variant="body1" sx={{ lineHeight: "24px" }}>
        {translatedText}
      </Typography>
    )}
  </>
);

const QuizAnswerContainer = ({
  text,
  delimiter,
  correctAnswerIndices,
  onDelimiterChange,
  onCorrectAnswerIndicesChange
}: {
  text: string;
  delimiter: string;
  correctAnswerIndices?: number[];
  onDelimiterChange: (delimiter: string) => void;
  onCorrectAnswerIndicesChange: (indices: number[]) => void;
}) => {
  const answers = splitAnswers(text, delimiter);
  return (
    <>
      <SelectInput label="Delimiter" items={ANSWER_DELIMITER_ITEMS} value={delimiter} onChange={onDelimiterChange} />
      <CheckboxInput
        label="Correct Answers"
        items={answers}
        values={correctAnswerIndices ?? []}
        onChange={onCorrectAnswerIndicesChange}
      />
    </>
  );
};

const RegionRow = ({
  region,
  index,
  selectedLayout,
  controlGroupState,
  isSelected,
  onAvatarClick,
  onDeleteClick,
  onMoveUpClick,
  onMoveDownClick,
  onTypeChange,
  onLanguageChange,
  onTextChange,
  onTextBlur,
  onTranslateLanguageChange,
  onDelimiterChange,
  onCorrectAnswerIndicesChange,
  isTranslating
}: {
  region: TextRegion;
  index: number;
  selectedLayout: string;
  controlGroupState: number;
  isSelected: boolean;
  onAvatarClick: () => void;
  onDeleteClick: () => void;
  onMoveUpClick: () => void;
  onMoveDownClick: () => void;
  onTypeChange: (type: string) => void;
  onLanguageChange: (language: string) => void;
  onTextChange: (text: string) => void;
  onTextBlur: () => void;
  onTranslateLanguageChange: (language: string) => void;
  onDelimiterChange: (delimiter: string) => void;
  onCorrectAnswerIndicesChange: (indices: number[]) => void;
  isTranslating: boolean;
}) => (
  <Stack data-region-id={region.id}>
    <ButtonBase
      sx={{ flexDirection: "row", alignItems: "center", justifyContent: "flex-start", gap: 1, py: 1, pl: 1, ml: -1 }}
      onClick={onAvatarClick}
    >
      <Avatar
        sx={{
          width: 32,
          height: 32,
          fontSize: 12,
          backgroundColor: isSelected ? "common.black" : "background.default",
          color: isSelected ? "common.white" : "common.black"
        }}
      >
        {index + 1}
      </Avatar>
      <Typography variant="body2">
        x: {Math.round(region.x)} y: {Math.round(region.y)} w: {Math.round(region.width)} h: {Math.round(region.height)}
      </Typography>
    </ButtonBase>
    <StyledContainer sx={{ flexDirection: "row" }}>
      <Stack sx={{ flex: 1, p: 1, gap: 1 }}>
        <SelectInput
          label="Recognise Language"
          items={LANGUAGE_ITEMS}
          value={region.recogniseLanguage ?? "eng"}
          onChange={onLanguageChange}
        />
        <TextInput
          label="Text"
          value={region.recognisedText ?? ""}
          onChange={onTextChange}
          onBlur={onTextBlur}
          inputSx={{ flex: 1 }}
        />
        {selectedLayout === "quiz" && (
          <SelectInput label="Type" items={QUIZ_TYPE_ITEMS} value={region.type ?? "question"} onChange={onTypeChange} />
        )}
        {["default+translate", "quiz"].includes(selectedLayout) && (
          <>
            {selectedLayout === "default+translate" && (
              <DefaultTranslateContainer
                translateLanguage={region.translateLanguage ?? ""}
                translatedText={region.translatedText ?? ""}
                isTranslating={isTranslating}
                onTranslateLanguageChange={onTranslateLanguageChange}
              />
            )}
            {selectedLayout === "quiz" && region.type === "answers" && (
              <QuizAnswerContainer
                text={region.recognisedText ?? ""}
                delimiter={region.delimiter ?? "letterDot"}
                correctAnswerIndices={region.correctAnswerIndices}
                onDelimiterChange={onDelimiterChange}
                onCorrectAnswerIndicesChange={onCorrectAnswerIndicesChange}
              />
            )}
          </>
        )}
      </Stack>
      {selectedLayout === "default+search" && controlGroupState === 0 && region.recognisedText && (
        <ControlGroup scrollHorizontally={false} searchQuery={region.recognisedText} />
      )}
      {controlGroupState === 1 && (
        <ControlGroup
          scrollHorizontally={false}
          onLeftButtonClick={onMoveUpClick}
          onRightButtonClick={onMoveDownClick}
        />
      )}
      {controlGroupState === 2 && <ControlGroup scrollHorizontally={false} onDeleteButtonClick={onDeleteClick} />}
    </StyledContainer>
  </Stack>
);

const Details = ({
  editedName,
  onEditedNameChange,
  editedAttributes,
  onEditedAttributesChange,
  folderAttributes
}: {
  editedName: string;
  onEditedNameChange: (name: string) => void;
  editedAttributes: { [key: string]: string };
  onEditedAttributesChange: (attributes: { [key: string]: string }) => void;
  folderAttributes: { name: string }[];
}) => (
  <Stack sx={{ p: 2, gap: 2 }}>
    <Stack sx={{ gap: "1px" }}>
      <StyledContainer sx={{ p: 1 }}>
        <TextInput label="Name" value={editedName} onChange={onEditedNameChange} inputSx={{ flex: 1 }} />
      </StyledContainer>
      {folderAttributes.map(({ name: attributeName }, i) => (
        <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
          <TextInput
            label={attributeName}
            value={editedAttributes[attributeName] ?? ""}
            onChange={(value) => onEditedAttributesChange({ ...editedAttributes, [attributeName]: value })}
            inputSx={{ flex: 1 }}
          />
        </StyledContainer>
      ))}
    </Stack>
  </Stack>
);

const Recognitions = ({
  regions,
  onRegionsChange,
  selectedLayout,
  controlGroupState,
  selectedRegionId,
  onRegionAvatarClick,
  onRegionTypeChange,
  onRegionLanguageChange,
  onRegionTextChange,
  onRegionTextBlur,
  onRegionTranslateLanguageChange,
  onRegionDelimiterChange,
  onRegionCorrectAnswerIndicesChange,
  translatingRegionIds
}: {
  regions: TextRegion[];
  onRegionsChange: (regions: TextRegion[]) => void;
  selectedLayout: string;
  controlGroupState: number;
  selectedRegionId: string | null;
  onRegionAvatarClick: (regionId: string) => void;
  onRegionTypeChange: (regionId: string, type: string) => void;
  onRegionLanguageChange: (regionId: string, language: string) => void;
  onRegionTextChange: (regionId: string, text: string) => void;
  onRegionTextBlur: (regionId: string) => void;
  onRegionTranslateLanguageChange: (regionId: string, language: string) => void;
  onRegionDelimiterChange: (regionId: string, delimiter: string) => void;
  onRegionCorrectAnswerIndicesChange: (regionId: string, indices: number[]) => void;
  translatingRegionIds: Set<string>;
}) => {
  const moveRegion = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= regions.length) {
      return;
    }
    const next = [...regions];
    [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
    onRegionsChange(next);
  };
  return (
    <Stack sx={{ px: 2, pt: 1, pb: 2, gap: 1 }}>
      {regions.map((region, i) => (
        <RegionRow
          key={region.id}
          region={region}
          index={i}
          selectedLayout={selectedLayout}
          controlGroupState={controlGroupState}
          isSelected={region.id === selectedRegionId}
          isTranslating={translatingRegionIds.has(region.id)}
          onAvatarClick={() => onRegionAvatarClick(region.id)}
          onDeleteClick={() => onRegionsChange(regions.filter((r) => r.id !== region.id))}
          onMoveUpClick={() => moveRegion(i, i - 1)}
          onMoveDownClick={() => moveRegion(i, i + 1)}
          onTypeChange={(type) => onRegionTypeChange(region.id, type)}
          onLanguageChange={(language) => onRegionLanguageChange(region.id, language)}
          onTextChange={(text) => onRegionTextChange(region.id, text)}
          onTextBlur={() => onRegionTextBlur(region.id)}
          onTranslateLanguageChange={(language) => onRegionTranslateLanguageChange(region.id, language)}
          onDelimiterChange={(delimiter) => onRegionDelimiterChange(region.id, delimiter)}
          onCorrectAnswerIndicesChange={(indices) => onRegionCorrectAnswerIndicesChange(region.id, indices)}
        />
      ))}
    </Stack>
  );
};

export const ImageModal = ({
  open,
  src,
  name,
  attributes,
  layout,
  textRegions,
  folderAttributes,
  onSaveButtonClick,
  onClose
}: {
  open: boolean;
  src: string;
  name: string;
  attributes: { [key: string]: string };
  layout: string;
  textRegions: TextRegion[];
  folderAttributes: { name: string }[];
  onSaveButtonClick: (
    name: string,
    attributes: { [key: string]: string },
    layout: string,
    textRegions: TextRegion[]
  ) => void;
  onClose: () => void;
}) => {
  const { breakpoints, palette } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const navigate = useNavigate();
  const { id: folderId, itemId, tab } = useParams();
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [regions, setRegions] = useState<TextRegion[]>(textRegions);
  const [selectedLayout, setSelectedLayout] = useState(layout);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [desktopSelectedTab, setDesktopSelectedTab] = useState(tab === "recognitions" ? 1 : 0);
  const [mobileSelectedTab, setMobileSelectedTab] = useState(tab === "recognitions" ? 2 : 0);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [translatingRegionIds, setTranslatingRegionIds] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState("fit");
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

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
    // eslint-disable-next-line react-hooks/purity -- onAddRegionClick only runs from a click handler, never during render
    const newRegion: TextRegion = { id: String(Date.now()), ...region };
    setRegions((prev) => [...prev, newRegion]);
    setControlGroupState(0);
    scrollImageToRegion(newRegion);
    requestAnimationFrame(() => {
      rightScrollRef.current?.scrollTo({ top: rightScrollRef.current.scrollHeight, behavior: "smooth" });
    });
    await recognizeRegionText(newRegion, newRegion.recogniseLanguage ?? "eng");
  };

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
      setRegions((prev) => prev.filter((r) => r.id !== selectedRegionId));
      setSelectedRegionId(null);
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, selectedRegionId]);

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

  const onLayoutIndexChange = async (value: string) => {
    setSelectedLayout(value);
    setControlGroupState(0);
    if (value !== "default+translate") {
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
    if (mobile) {
      setMobileSelectedTab(0);
    }
    if (!regionId) {
      return;
    }
    const row = rightScrollRef.current?.querySelector<HTMLElement>(`[data-region-id="${regionId}"]`);
    row?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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

  const onRegionAvatarClick = (regionId: string) => {
    onRegionSelect(regionId);
    const region = regions.find((r) => r.id === regionId);
    if (region) {
      scrollImageToRegion(region);
    }
  };

  return (
    <WModal
      open={open}
      onClose={onClose}
      width="80vw"
      height="80dvh"
      tabs={[{ icon: <ImageIcon sx={{ fontSize: 24 }} />, label: "Image" }]}
      hideLeftLabel
      top={
        mobile ? (
          <>
            <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
              <AddIcon sx={{ fontSize: 24 }} />
            </WButton>
            <WButton onClick={() => setZoom("original")} sx={iconButtonSx}>
              <ZoomInIcon sx={{ fontSize: 24 }} />
            </WButton>
            <WButton onClick={() => setZoom("fit")} sx={iconButtonSx}>
              <ZoomOutIcon sx={{ fontSize: 24 }} />
            </WButton>
          </>
        ) : undefined
      }
      rightTabs={[
        { icon: <ViewListIcon sx={{ fontSize: 24 }} />, label: "Details" },
        { icon: <CropFreeIcon sx={{ fontSize: 24 }} />, label: "Recognitions" }
      ]}
      rightSelectedTab={desktopSelectedTab}
      onRightTabChange={(newTab) => {
        setDesktopSelectedTab(newTab);
        setControlGroupState(0);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newTab === 1 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      mobileSelectedTab={mobileSelectedTab}
      onMobileSelectedTabChange={(newTab) => {
        setMobileSelectedTab(newTab);
        if (folderId && itemId) {
          navigate(`/collections/${folderId}/${itemId}/${newTab === 2 ? "recognitions" : "details"}`, {
            replace: true
          });
        }
      }}
      rightTop={
        desktopSelectedTab === 1 ? (
          <>
            <StyledContainer sx={{ flex: 1, p: 1 }}>
              <SelectInput items={LAYOUT_ITEMS} value={selectedLayout} onChange={onLayoutIndexChange} />
            </StyledContainer>
            <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
              <AddIcon sx={{ fontSize: 24 }} />
            </WButton>
            <WButton
              isActivated={controlGroupState === 1}
              onClick={() => setControlGroupState(controlGroupState === 1 ? 0 : 1)}
              sx={iconButtonSx}
            >
              <SwapHorizIcon sx={{ fontSize: 26 }} />
            </WButton>
            <WButton
              isActivated={controlGroupState === 2}
              onClick={() => setControlGroupState(controlGroupState === 2 ? 0 : 2)}
              sx={iconButtonSx}
            >
              <CloseIcon sx={{ fontSize: 24 }} />
            </WButton>
          </>
        ) : undefined
      }
      rightScrollRef={rightScrollRef}
      rightBottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={() => {
            onSaveButtonClick(editedName, editedAttributes, selectedLayout, regions);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
      rightChildren={
        desktopSelectedTab === 0 ? (
          <Details
            editedName={editedName}
            onEditedNameChange={setEditedName}
            editedAttributes={editedAttributes}
            onEditedAttributesChange={setEditedAttributes}
            folderAttributes={folderAttributes}
          />
        ) : (
          <Recognitions
            regions={regions}
            onRegionsChange={setRegions}
            selectedLayout={selectedLayout}
            controlGroupState={controlGroupState}
            selectedRegionId={selectedRegionId}
            onRegionAvatarClick={onRegionAvatarClick}
            onRegionTypeChange={onRegionTypeChange}
            onRegionLanguageChange={onRegionLanguageChange}
            onRegionTextChange={onRegionTextChange}
            onRegionTextBlur={onRegionTextBlur}
            onRegionTranslateLanguageChange={onRegionTranslateLanguageChange}
            onRegionDelimiterChange={onRegionDelimiterChange}
            onRegionCorrectAnswerIndicesChange={onRegionCorrectAnswerIndicesChange}
            translatingRegionIds={translatingRegionIds}
          />
        )
      }
    >
      <Box sx={{ position: "relative", height: "100%" }}>
        <ImageRegionOverlay
          src={src}
          alt={name}
          regions={mobile || desktopSelectedTab === 1 ? regions : []}
          onRegionsChange={setRegions}
          onRegionMouseUp={onRegionMouseUp}
          scrollRef={imageScrollRef}
          fitScreen={zoom === "fit"}
          selectedId={selectedRegionId}
          onSelectedIdChange={onRegionSelect}
        />
        {!mobile && (
          <Stack sx={{ position: "absolute", flexDirection: "row", top: 8, left: 8, gap: "1px" }}>
            <WButton
              onClick={() => setZoom("original")}
              sx={{
                ...iconButtonSx,
                backgroundColor: alpha(palette.primary.main, 0.9),
                "&:hover": { backgroundColor: palette.primary.main }
              }}
            >
              <ZoomInIcon sx={{ fontSize: 28 }} />
            </WButton>
            <WButton
              onClick={() => setZoom("fit")}
              sx={{
                ...iconButtonSx,
                backgroundColor: alpha(palette.primary.main, 0.9),
                "&:hover": { backgroundColor: palette.primary.main }
              }}
            >
              <ZoomOutIcon sx={{ fontSize: 28 }} />
            </WButton>
          </Stack>
        )}
      </Box>
    </WModal>
  );
};
