import { Stack, Typography } from "@mui/material";
import { Done as DoneIcon, Close as CloseIcon } from "@mui/icons-material";
import { Question } from "../../../services/Types";

export const isAnswerCorrect = (selectedAnswerIndices: number[], answers: Question["answers"]) => {
  const correctIndices = answers.reduce<number[]>(
    (indices, { correct }, i) => (correct ? [...indices, i] : indices),
    []
  );
  return (
    selectedAnswerIndices.length === correctIndices.length &&
    correctIndices.every((index) => selectedAnswerIndices.includes(index))
  );
};

export const AnswerSummaryGrid = ({
  questions,
  selectedAnswerIndicesByQuestion,
  showCorrectAnswers
}: {
  questions: Question[];
  selectedAnswerIndicesByQuestion: number[][];
  showCorrectAnswers: boolean;
}) => {
  return (
    <Stack
      sx={{
        display: "grid",
        gridTemplateColumns: "repeat(2, 1fr)",
        gridTemplateRows: `repeat(${Math.ceil(selectedAnswerIndicesByQuestion.length / 2)}, auto)`,
        gridAutoFlow: "column",
        gap: 1
      }}
    >
      {questions.map(({ answers }, i) => {
        const selectedAnswerIndices = selectedAnswerIndicesByQuestion[i] ?? [];
        return (
          <Stack key={`question-${i}`} sx={{ gap: 0.5 }}>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              Question {i + 1}
            </Typography>
            <Stack sx={{ flexDirection: "row", alignItems: "center", gap: 1 }}>
              {showCorrectAnswers &&
                (isAnswerCorrect(selectedAnswerIndices, answers) ? (
                  <DoneIcon sx={{ fontSize: 24, mt: "-2px", color: "success.main" }} />
                ) : (
                  <CloseIcon sx={{ fontSize: 24, ml: -0.5, mt: "-2px", color: "error.main" }} />
                ))}
              {(selectedAnswerIndices.length > 0 || !showCorrectAnswers) && (
                <Typography
                  variant="body1"
                  sx={{ color: selectedAnswerIndices.length > 0 ? undefined : "text.disabled" }}
                >
                  {selectedAnswerIndices.length > 0
                    ? [...selectedAnswerIndices]
                        .sort((a, b) => a - b)
                        .map((index) => String.fromCharCode(65 + index))
                        .join(", ")
                    : "-"}
                </Typography>
              )}
            </Stack>
          </Stack>
        );
      })}
    </Stack>
  );
};
