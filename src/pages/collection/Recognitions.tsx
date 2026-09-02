import { Avatar, ButtonBase, Skeleton, Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, SwapHoriz as SwapHorizIcon } from "@mui/icons-material";
import { SelectInput } from "../../components/SelectInput";
import { StyledContainer } from "../../components/StyledContainer";
import { CheckboxInput } from "../../components/CheckboxInput";
import { TextInput } from "../../components/TextInput";
import { iconButtonSx, WButton } from "../../components/WButton";
import { ControlGroup } from "../../components/ControlGroup";
import { getPointsBoundingBox, LANGUAGE_ITEMS, TRANSLATE_LANGUAGE_ITEMS } from "../../utils/ImageUtils";
import { splitAnswers } from "../../utils/splitAnswers";
import { Region } from "./ImageRegionOverlay";
import { EmptyPlaceholder } from "../../components/EmptyPlaceholder";

export const LAYOUT_ITEMS = [
  {
    label: "Text",
    value: "text",
    isTextRecognitionEnabled: true,
    isAutoRegionDetectionEnabled: false,
    isPolygonEnabled: false
  },
  {
    label: "Quiz",
    value: "quiz",
    isTextRecognitionEnabled: true,
    isAutoRegionDetectionEnabled: true,
    isPolygonEnabled: false
  },
  {
    label: "Regions",
    value: "regions",
    isTextRecognitionEnabled: false,
    isAutoRegionDetectionEnabled: false,
    isPolygonEnabled: true
  },
  {
    label: "Search",
    value: "search",
    isTextRecognitionEnabled: true,
    isAutoRegionDetectionEnabled: false,
    isPolygonEnabled: false
  },
  {
    label: "Translate",
    value: "translate",
    isTextRecognitionEnabled: true,
    isAutoRegionDetectionEnabled: false,
    isPolygonEnabled: false
  }
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

const TranslateContainer = ({
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
  onLeftButtonClick,
  onRightButtonClick,
  onTypeChange,
  onLanguageChange,
  onTextChange,
  onTextBlur,
  onTranslateLanguageChange,
  onDelimiterChange,
  onCorrectAnswerIndicesChange,
  isTranslating
}: {
  region: Region;
  index: number;
  selectedLayout: string;
  controlGroupState: number;
  isSelected: boolean;
  onAvatarClick: () => void;
  onDeleteClick: () => void;
  onLeftButtonClick?: () => void;
  onRightButtonClick?: () => void;
  onTypeChange: (type: string) => void;
  onLanguageChange: (language: string) => void;
  onTextChange: (text: string) => void;
  onTextBlur: () => void;
  onTranslateLanguageChange: (language: string) => void;
  onDelimiterChange: (delimiter: string) => void;
  onCorrectAnswerIndicesChange: (indices: number[]) => void;
  isTranslating: boolean;
}) => {
  const rect = getPointsBoundingBox(region.points);
  const isPolygonEnabled = LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isPolygonEnabled ?? false;
  return (
    <Stack data-region-index={index} sx={{ gap: "1px" }}>
      <ButtonBase
        sx={{
          flexDirection: "row",
          flex: 1,
          alignItems: "center",
          justifyContent: "flex-start",
          gap: 1,
          py: 1,
          pl: 1,
          pr: 1,
          ml: -1
        }}
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
          {isPolygonEnabled
            ? `x: ${Math.round(rect.x)}, y: ${Math.round(rect.y)}, points: ${region.points.length}`
            : `x: ${Math.round(rect.x)}, y: ${Math.round(rect.y)}, w: ${Math.round(rect.width)}, h: ${Math.round(rect.height)}`}
        </Typography>
      </ButtonBase>
      <StyledContainer sx={{ flexDirection: "row" }}>
        <Stack sx={{ flex: 1, p: 1, gap: 1 }}>
          {selectedLayout === "regions" ? (
            <>
              <TextInput
                label="Text"
                value={region.text ?? ""}
                onChange={onTextChange}
                onBlur={onTextBlur}
                inputSx={{ flex: 1 }}
              />
            </>
          ) : (
            <>
              <SelectInput
                label="Recognise Language"
                items={LANGUAGE_ITEMS}
                value={region.recogniseLanguage ?? "eng"}
                onChange={onLanguageChange}
              />
              <TextInput
                label="Text"
                value={region.text ?? ""}
                onChange={onTextChange}
                onBlur={onTextBlur}
                inputSx={{ flex: 1 }}
              />
            </>
          )}
          {selectedLayout === "quiz" && (
            <SelectInput
              label="Type"
              items={QUIZ_TYPE_ITEMS}
              value={region.type ?? "question"}
              onChange={onTypeChange}
            />
          )}
          {["translate", "quiz"].includes(selectedLayout) && (
            <>
              {selectedLayout === "translate" && (
                <TranslateContainer
                  translateLanguage={region.translateLanguage ?? ""}
                  translatedText={region.translatedText ?? ""}
                  isTranslating={isTranslating}
                  onTranslateLanguageChange={onTranslateLanguageChange}
                />
              )}
              {selectedLayout === "quiz" && region.type === "answers" && (
                <QuizAnswerContainer
                  text={region.text ?? ""}
                  delimiter={region.delimiter ?? "letterDot"}
                  correctAnswerIndices={region.correctAnswerIndices}
                  onDelimiterChange={onDelimiterChange}
                  onCorrectAnswerIndicesChange={onCorrectAnswerIndicesChange}
                />
              )}
            </>
          )}
        </Stack>
        {selectedLayout === "search" && controlGroupState === 0 && region.text && (
          <ControlGroup scrollHorizontally={false} searchQuery={region.text} />
        )}
        {controlGroupState === 1 && (
          <ControlGroup
            scrollHorizontally={false}
            onLeftButtonClick={onLeftButtonClick}
            onRightButtonClick={onRightButtonClick}
          />
        )}
        {controlGroupState === 2 && <ControlGroup scrollHorizontally={false} onDeleteButtonClick={onDeleteClick} />}
      </StyledContainer>
    </Stack>
  );
};

export const RecognitionsTop = ({
  selectedLayout,
  controlGroupState,
  onLayoutChange,
  onAddRegionClick,
  onRearrangeButtonClick,
  onDeleteButtonClick
}: {
  selectedLayout: string;
  controlGroupState: number;
  onLayoutChange: (value: string) => void;
  onAddRegionClick: () => void;
  onRearrangeButtonClick: () => void;
  onDeleteButtonClick: () => void;
}) => (
  <>
    <StyledContainer sx={{ flex: 1, p: 1 }}>
      <SelectInput items={LAYOUT_ITEMS} value={selectedLayout} onChange={onLayoutChange} />
    </StyledContainer>
    <WButton onClick={onAddRegionClick} sx={iconButtonSx}>
      <AddIcon sx={{ fontSize: 26 }} />
    </WButton>
    <WButton isActivated={controlGroupState === 1} onClick={onRearrangeButtonClick} sx={iconButtonSx}>
      <SwapHorizIcon sx={{ fontSize: 26 }} />
    </WButton>
    <WButton isActivated={controlGroupState === 2} onClick={onDeleteButtonClick} sx={iconButtonSx}>
      <CloseIcon sx={{ fontSize: 24 }} />
    </WButton>
  </>
);

export const Recognitions = ({
  regions,
  onRegionsChange,
  selectedLayout,
  controlGroupState,
  selectedRegionIndex,
  onRegionAvatarClick,
  onRegionTypeChange,
  onRegionLanguageChange,
  onRegionTextChange,
  onRegionTextBlur,
  onRegionTranslateLanguageChange,
  onRegionDelimiterChange,
  onRegionCorrectAnswerIndicesChange,
  translatingRegionIndices
}: {
  regions: Region[];
  onRegionsChange: (regions: Region[]) => void;
  selectedLayout: string;
  controlGroupState: number;
  selectedRegionIndex: number | null;
  onRegionAvatarClick: (index: number) => void;
  onRegionTypeChange: (index: number, type: string) => void;
  onRegionLanguageChange: (index: number, language: string) => void;
  onRegionTextChange: (index: number, text: string) => void;
  onRegionTextBlur: (index: number) => void;
  onRegionTranslateLanguageChange: (index: number, language: string) => void;
  onRegionDelimiterChange: (index: number, delimiter: string) => void;
  onRegionCorrectAnswerIndicesChange: (index: number, indices: number[]) => void;
  translatingRegionIndices: Set<number>;
}) => {
  const updateRegionSequences = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= regions.length) {
      return;
    }
    const next = [...regions];
    [next[fromIndex], next[toIndex]] = [next[toIndex], next[fromIndex]];
    onRegionsChange(next);
  };
  if (regions.length === 0) {
    return <EmptyPlaceholder />;
  }
  const isPolygonEnabled = LAYOUT_ITEMS.find((item) => item.value === selectedLayout)?.isPolygonEnabled ?? false;
  return (
    <Stack sx={{ px: 2, pt: isPolygonEnabled ? 2 : 1, pb: 2, gap: 1 }}>
      {regions.map((region, i) => (
        <RegionRow
          key={i}
          region={region}
          index={i}
          selectedLayout={selectedLayout}
          controlGroupState={controlGroupState}
          isSelected={i === selectedRegionIndex}
          isTranslating={translatingRegionIndices.has(i)}
          onAvatarClick={() => onRegionAvatarClick(i)}
          onDeleteClick={() => onRegionsChange(regions.filter((_, j) => j !== i))}
          onLeftButtonClick={i > 0 ? () => updateRegionSequences(i, i - 1) : undefined}
          onRightButtonClick={i < regions.length - 1 ? () => updateRegionSequences(i, i + 1) : undefined}
          onTypeChange={(type) => onRegionTypeChange(i, type)}
          onLanguageChange={(language) => onRegionLanguageChange(i, language)}
          onTextChange={(text) => onRegionTextChange(i, text)}
          onTextBlur={() => onRegionTextBlur(i)}
          onTranslateLanguageChange={(language) => onRegionTranslateLanguageChange(i, language)}
          onDelimiterChange={(delimiter) => onRegionDelimiterChange(i, delimiter)}
          onCorrectAnswerIndicesChange={(indices) => onRegionCorrectAnswerIndicesChange(i, indices)}
        />
      ))}
    </Stack>
  );
};
