import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { CheckboxInput } from "../../../components/CheckboxInput";
import { useQuiz } from "./useQuiz";
import { QuizContent } from "../../../services/Types";

const QuestionContainer = ({ number, question }: { number: number; question: QuizContent[] }) => {
  return (
    <Stack sx={{ p: 2, gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Question {number + 1}
      </Typography>
      {question.map(({ value }, i) => (
        <Typography key={`question-part-${i}`} variant="body1">
          {value}
        </Typography>
      ))}
    </Stack>
  );
};

const AnswerContainer = ({
  answers
}: {
  answers: {
    content: QuizContent[];
    correct: boolean;
  }[];
}) => {
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const items = answers.map(({ content }) => content.map(({ value }) => value).join(" "));
  return (
    <Stack sx={{ p: 2, backgroundColor: "background.default" }}>
      <CheckboxInput items={items} values={selectedIndices} onChange={setSelectedIndices} />
    </Stack>
  );
};

export const Quiz = () => {
  const { quizItems, selectedQuizItem, setSelectedQuizItem, quiz } = useQuiz();

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <SelectInput items={quizItems} value={selectedQuizItem} onChange={setSelectedQuizItem} />
      {selectedQuizItem && (
        <Stack sx={{ flex: 1, overflow: "auto", gap: "1px" }}>
          {quiz.map(({ question, answers }, i) => (
            <Stack key={`question-${i}`}>
              <QuestionContainer number={i} question={question} />
              <AnswerContainer answers={answers} />
            </Stack>
          ))}
        </Stack>
      )}
    </Stack>
  );
};
