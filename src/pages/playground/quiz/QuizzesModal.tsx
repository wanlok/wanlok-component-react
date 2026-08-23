import { Stack } from "@mui/material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { useState } from "react";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { Quiz } from "../../../services/ApiTypes";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";
import { Add as AddIcon, Assignment as AssignmentIcon, Close as CloseIcon } from "@mui/icons-material";

export const QuizzesModal = ({
  open,
  onClose,
  quizzes,
  updateQuizzes
}: {
  open: boolean;
  onClose: () => void;
  quizzes: Quiz[];
  updateQuizzes: (quizzes: Quiz[]) => Promise<void>;
}) => {
  const [items, setItems] = useState<Quiz[]>(quizzes.map((quiz) => ({ ...quiz })));
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <AssignmentIcon sx={{ fontSize: 24 }} />, label: `Quizzes (${items.length})` }]}
      top={
        <>
          <WButton onClick={() => setItems([...items, { label: "", value: "" }])} sx={iconButtonSx}>
            <AddIcon sx={{ fontSize: 26 }} />
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
            await updateQuizzes(items.filter((item) => item.label.trim() && item.value.trim()));
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
            <StyledContainer key={`quiz-${i}`} sx={{ flexDirection: "row", alignItems: "top" }}>
              <Stack sx={{ flex: 1, p: 1, gap: 1 }}>
                <TextInput
                  placeholder={`Quiz ${i + 1} Name`}
                  value={label}
                  onChange={(newLabel) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], label: newLabel };
                    setItems(newItems);
                  }}
                  inputSx={{ flex: 1 }}
                />
                <TextInput
                  placeholder={`Quiz ${i + 1} Path`}
                  value={value}
                  onChange={(newValue) => {
                    const newItems = [...items];
                    newItems[i] = { ...newItems[i], value: newValue };
                    setItems(newItems);
                  }}
                  inputSx={{ flex: 1 }}
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
