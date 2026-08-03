import { Stack } from "@mui/material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { useEffect, useState } from "react";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { QuizItem } from "../../../services/Types";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";
import { Add as AddIcon, Assignment as AssignmentIcon, Close as CloseIcon } from "@mui/icons-material";

export const QuizItemsModal = ({
  open,
  onClose,
  quizItems,
  updateQuizItems
}: {
  open: boolean;
  onClose: () => void;
  quizItems: QuizItem[];
  updateQuizItems: (quizItems: QuizItem[]) => Promise<void>;
}) => {
  const [items, setItems] = useState<QuizItem[]>([]);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    if (open) {
      setItems([...quizItems.map((quizItem) => ({ ...quizItem }))]);
      setIsDeleting(false);
    }
  }, [open, quizItems]);

  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ icon: <AssignmentIcon sx={{ fontSize: 24 }} />, label: `Quizzes (${items.length})` }]}
      top={
        <>
          <WButton onClick={() => setItems([...items, { label: "", value: "" }])} sx={iconButtonSx}>
            <AddIcon sx={{ fontSize: 24 }} />
          </WButton>
          <WButton isActivated={isDeleting} onClick={() => setIsDeleting(!isDeleting)} sx={iconButtonSx}>
            <CloseIcon sx={{ fontSize: 24 }} />
          </WButton>
        </>
      }
      bottom={
        <YesNoButtons
          yesLabel="Save"
          onYesClick={async () => {
            await updateQuizItems(items.filter((item) => item.label.trim() && item.value.trim()));
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: 1, p: 2 }}>
        <Stack sx={{ gap: "1px" }}>
          {items.map(({ label, value }, i) => (
            <StyledContainer key={`quiz-item-${i}`} sx={{ flexDirection: "row", alignItems: "top" }}>
              <Stack sx={{ flex: 1, p: 1, gap: 1 }}>
                <TextInput
                  placeholder={`Quiz ${i + 1} Name`}
                  value={label}
                  onChange={(newLabel) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], label: newLabel };
                    setItems(newItems);
                  }}
                  inputPropsSx={{ flex: 1 }}
                />
                <TextInput
                  placeholder={`Quiz ${i + 1} Path`}
                  value={value}
                  onChange={(newValue) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], value: newValue };
                    setItems(newItems);
                  }}
                  inputPropsSx={{ flex: 1 }}
                />
              </Stack>
              {isDeleting && (
                <WButton onClick={() => setItems(items.filter((_, j) => j !== i))} sx={iconButtonSx}>
                  <CloseIcon sx={{ fontSize: 24 }} />
                </WButton>
              )}
            </StyledContainer>
          ))}
        </Stack>
      </Stack>
    </WModal>
  );
};
