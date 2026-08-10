import { Avatar, ButtonBase, Skeleton, Stack, Typography } from "@mui/material";
import { Add as AddIcon, Close as CloseIcon, SwapHoriz as SwapHorizIcon } from "@mui/icons-material";
import { SelectInput } from "../../components/SelectInput";
import { StyledContainer } from "../../components/StyledContainer";
import { CheckboxInput } from "../../components/CheckboxInput";
import { TextInput } from "../../components/TextInput";
import { iconButtonSx, WButton } from "../../components/WButton";
import { ControlGroup } from "../../components/ControlGroup";
import { LANGUAGE_ITEMS, TRANSLATE_LANGUAGE_ITEMS } from "../../common/ImageUtils";
import { splitAnswers } from "../../utils/splitAnswers";
import { TextRegion } from "./ImageRegionOverlay";

export const LAYOUT_ITEMS = [
  { label: "Default", value: "default", isAutoRegionDetectionEnabled: false },
  { label: "Search", value: "search", isAutoRegionDetectionEnabled: false },
  { label: "Translate", value: "translate", isAutoRegionDetectionEnabled: false },
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
      {selectedLayout === "search" && controlGroupState === 0 && region.recognisedText && (
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
