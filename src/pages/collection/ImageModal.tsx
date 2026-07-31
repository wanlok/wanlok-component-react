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
import { splitAnswers } from "../../utils/splitAnswers";

const QUIZ_TYPE_ITEMS = [
  { label: "Question", value: "question" },
  { label: "Answers", value: "answers" }
];

const ANSWER_DELIMITER_ITEMS = [
  { label: "A. ..., B. ..., C. ..., D. ..., ...", value: "letter_dot" },
  { label: "A) ..., B) ..., C) ..., D) ..., ...", value: "letter_paren" },
  { label: "1. ..., 2. ..., 3. ..., 4. ..., ...", value: "number_dot" },
  { label: "1) ..., 2) ..., 3) ..., 4) ..., ...", value: "number_paren" },
  { label: "i. ..., ii. ..., iii. ..., iv. ..., ...", value: "roman_dot" },
  { label: "i) ..., ii) ..., iii) ..., iv) ..., ...", value: "roman_paren" },
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
          inputPropsSx={{ flex: 1 }}
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
                delimiter={region.delimiter ?? "letter_dot"}
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
        <TextInput label="Name" value={editedName} onChange={onEditedNameChange} inputPropsSx={{ flex: 1 }} />
      </StyledContainer>
      {folderAttributes.map(({ name: attributeName }, i) => (
        <StyledContainer key={`attribute-${i}`} sx={{ p: 1 }}>
          <TextInput
            label={attributeName}
            value={editedAttributes[attributeName] ?? ""}
            onChange={(value) => onEditedAttributesChange({ ...editedAttributes, [attributeName]: value })}
            inputPropsSx={{ flex: 1 }}
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
  const [editedName, setEditedName] = useState(name);
  const [editedAttributes, setEditedAttributes] = useState<{ [key: string]: string }>(attributes);
  const [regions, setRegions] = useState<TextRegion[]>(textRegions);
  const [selectedLayout, setSelectedLayout] = useState(layout);
  const [controlGroupState, setControlGroupState] = useState(0);
  const [desktopSelectedTab, setDesktopSelectedTab] = useState(0);
  const [mobileSelectedTab, setMobileSelectedTab] = useState(0);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [translatingRegionIds, setTranslatingRegionIds] = useState<Set<string>>(new Set());
  const [zoom, setZoom] = useState("fit");
  const imageCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const imageScrollRef = useRef<HTMLDivElement>(null);
  const rightScrollRef = useRef<HTMLDivElement>(null);

  const onAddRegionClick = () => {
    const container = imageScrollRef.current;
    const x = (container?.scrollLeft ?? 0) + 80;
    const y = (container?.scrollTop ?? 0) + 40;
    setRegions((prev) => [...prev, { id: String(Date.now()), x, y, width: 240, height: 135 }]);
    setControlGroupState(0);
    requestAnimationFrame(() => {
      rightScrollRef.current?.scrollTo({ top: rightScrollRef.current.scrollHeight, behavior: "smooth" });
    });
  };

  useEffect(() => {
    if (open) {
      setEditedName(name);
      setEditedAttributes(attributes);
      setRegions(textRegions);
      setSelectedLayout(layout);
      setControlGroupState(0);
      setDesktopSelectedTab(0);
      setMobileSelectedTab(0);
      setSelectedRegionId(null);
      setTranslatingRegionIds(new Set());
      setZoom("fit");
      imageCanvasRef.current = null;
    }
  }, [open, name, attributes, layout]);

  const recognizeRegionText = async (region: TextRegion, language: string) => {
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
    const base64 = getImageBase64String(imageCanvasRef.current, {
      x: Math.round(region.x),
      y: Math.round(region.y),
      width: Math.round(region.width),
      height: Math.round(region.height)
    });
    if (!base64) {
      return;
    }
    const text = await recognizeText(base64, language);
    setRegions((prev) => prev.map((r) => (r.id === region.id ? { ...r, recognisedText: text } : r)));
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
    setRegions((prev) => prev.map((r) => (r.id === regionId ? { ...r, type: type as TextRegion["type"] } : r)));
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

  const onRegionAvatarClick = (regionId: string) => {
    onRegionSelect(regionId);
    const region = regions.find((r) => r.id === regionId);
    const container = imageScrollRef.current;
    if (region && container) {
      container.scrollTo({
        left: region.x - container.clientWidth / 2 + region.width / 2,
        top: region.y - container.clientHeight / 2 + region.height / 2,
        behavior: "smooth"
      });
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
      onRightTabChange={(tab) => {
        setDesktopSelectedTab(tab);
        setControlGroupState(0);
      }}
      mobileSelectedTab={mobileSelectedTab}
      onMobileSelectedTabChange={setMobileSelectedTab}
      rightTop={
        desktopSelectedTab === 1 ? (
          <>
            <StyledContainer sx={{ flex: 1, p: 1 }}>
              <SelectInput
                items={[
                  { label: "Default", value: "default" },
                  { label: "Default + Search", value: "default+search" },
                  { label: "Default + Translate", value: "default+translate" },
                  { label: "Quiz", value: "quiz" }
                ]}
                value={selectedLayout}
                onChange={onLayoutIndexChange}
              />
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
