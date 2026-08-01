import { Stack, Typography } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { useQuiz } from "./useQuiz";

export const Quiz = () => {
  const { quizItems, selectedQuizItem, setSelectedQuizItem, quiz } = useQuiz();

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <SelectInput items={quizItems} value={selectedQuizItem} onChange={setSelectedQuizItem} />
      {selectedQuizItem && (
        <Stack sx={{ flex: 1, overflow: "auto" }}>
          <Typography component="pre" variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
            {JSON.stringify(quiz, null, 2)}
          </Typography>
        </Stack>
      )}
    </Stack>
  );
};
