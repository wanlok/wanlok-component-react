import { useState } from "react";
import { Divider, Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { WModal } from "../../../components/WModal";
import { WButton } from "../../../components/WButton";
import { YesNoButtons } from "../../../components/YesNoButtons";
import { AnswerSummaryGrid, isAnswerCorrect } from "./AnswerSummaryGrid";
import { Quiz } from "../../../services/Types";

export const SubmitModal = ({
  open,
  quiz,
  selectedAnswerIndicesByQuestion,
  onClose,
  onConfirm
}: {
  open: boolean;
  quiz: Quiz[];
  selectedAnswerIndicesByQuestion: number[][];
  onClose: () => void;
  onConfirm: () => void;
}) => {
  const [showCorrectAnswers, setShowCorrectAnswers] = useState(false);

  const correctCount = quiz.filter(({ answers }, i) =>
    isAnswerCorrect(selectedAnswerIndicesByQuestion[i] ?? [], answers)
  ).length;
  const scorePercentage = quiz.length > 0 ? Math.round((correctCount / quiz.length) * 100) : 0;

  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ label: showCorrectAnswers ? "Quiz Results" : "Quiz Submission" }]}
      bottom={
        showCorrectAnswers ? (
          <WButton onClick={onClose} rightIcon={<CloseIcon sx={{ fontSize: 24, mt: "-2px" }} />} sx={{ flex: 1 }}>
            Close
          </WButton>
        ) : (
          <YesNoButtons
            onYesClick={() => {
              onConfirm();
              setShowCorrectAnswers(true);
            }}
            onNoClick={onClose}
          />
        )
      }
    >
      <Stack sx={{ p: 2, gap: 2 }}>
        {showCorrectAnswers && (
          <>
            <Stack sx={{ alignItems: "center" }}>
              <Typography variant="h1">{scorePercentage}%</Typography>
              <Typography>
                {correctCount} out of {quiz.length} questions answered correctly
              </Typography>
            </Stack>
            <Divider />
          </>
        )}
        {!showCorrectAnswers && (
          <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
            The following is a summary of your answers. Confirm submission?
          </Typography>
        )}
        <AnswerSummaryGrid
          quiz={quiz}
          selectedAnswerIndicesByQuestion={selectedAnswerIndicesByQuestion}
          showCorrectAnswers={showCorrectAnswers}
        />
      </Stack>
    </WModal>
  );
};
