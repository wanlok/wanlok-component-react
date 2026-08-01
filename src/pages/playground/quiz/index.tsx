import { useEffect, useRef, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { CheckboxInput } from "../../../components/CheckboxInput";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { StyledContainer } from "../../../components/StyledContainer";
import { useQuiz } from "./useQuiz";
import { QuizContent } from "../../../services/Types";
import { WButton } from "../../../components/WButton";
import { ResetModal } from "./ResetModal";
import { SubmitModal } from "./SubmitModal";

const QuestionContainer = ({ number, question }: { number: number; question: QuizContent[] }) => {
  return (
    <Stack sx={{ p: 2, gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Question {number + 1}
      </Typography>
      {question.map(({ value }, i) => (
        <Typography key={`question-${number}-${i + 1}`} variant="body1">
          {value}
        </Typography>
      ))}
    </Stack>
  );
};

const AnswerContainer = ({
  answers,
  selectedAnswerIndices,
  onChange
}: {
  answers: {
    content: QuizContent[];
    correct: boolean;
  }[];
  selectedAnswerIndices: number[];
  onChange: (selectedAnswerIndices: number[]) => void;
}) => {
  const items = answers.map(({ content }) => content.map(({ value }) => value).join(" "));
  return (
    <Stack sx={{ p: 1, backgroundColor: "background.default" }}>
      <CheckboxInput items={items} values={selectedAnswerIndices} onChange={onChange} />
    </Stack>
  );
};

export const Quiz = () => {
  const { quizItems, selectedQuizItem, setSelectedQuizItem, quiz } = useQuiz();
  const [selectedAnswerIndicesByQuestion, setSelectedAnswerIndicesByQuestion] = useState<number[][]>([]);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setSelectedAnswerIndicesByQuestion(quiz.map(() => []));
  }, [quiz]);

  const onNextQuestionButtonClick = () => {
    const nextQuestionIndex = selectedAnswerIndicesByQuestion.findIndex(
      (selectedAnswerIndices) => selectedAnswerIndices.length === 0
    );
    if (nextQuestionIndex === -1) {
      return;
    }
    scrollRef.current?.querySelector(`[data-question-index="${nextQuestionIndex}"]`)?.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  };

  const answeredCount = selectedAnswerIndicesByQuestion.filter(
    (selectedAnswerIndices) => selectedAnswerIndices.length > 0
  ).length;

  const onAnswerChange = (questionIndex: number, selectedAnswerIndices: number[]) => {
    setSelectedAnswerIndicesByQuestion((prev) =>
      prev.map((indices, i) => (i === questionIndex ? selectedAnswerIndices : indices))
    );
  };

  return (
    <Stack sx={{ flex: 1, minHeight: 0 }}>
      <LayoutHeader
        top={
          <Stack sx={topSx}>
            <StyledContainer sx={{ flex: 1, p: 1 }}>
              <SelectInput items={quizItems} value={selectedQuizItem} onChange={setSelectedQuizItem} />
            </StyledContainer>
            <Stack sx={{ flexDirection: "row" }}>
              <WButton>Past Results</WButton>
            </Stack>
          </Stack>
        }
        bottom={
          <Stack sx={[bottomSx]}>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <WButton disabled={answeredCount === quiz.length} onClick={onNextQuestionButtonClick}>
                Next Question
              </WButton>
            </Stack>
            <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
              <Typography>
                {answeredCount} / {quiz.length} questions answered
              </Typography>
            </Stack>
            <Stack sx={{ flexDirection: "row", gap: "1px" }}>
              <WButton onClick={() => setResetModalOpen(true)}>Reset</WButton>
              <WButton onClick={() => setSubmitModalOpen(true)}>Submit</WButton>
            </Stack>
          </Stack>
        }
      />
      {selectedQuizItem && (
        <Stack ref={scrollRef} sx={{ flex: 1, overflow: "auto", gap: "1px" }}>
          {quiz.map(({ question, answers }, i) => (
            <Stack key={`question-${i}`} data-question-index={i}>
              <QuestionContainer number={i} question={question} />
              <AnswerContainer
                answers={answers}
                selectedAnswerIndices={selectedAnswerIndicesByQuestion[i] ?? []}
                onChange={(selectedAnswerIndices) => onAnswerChange(i, selectedAnswerIndices)}
              />
            </Stack>
          ))}
        </Stack>
      )}
      <ResetModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => {
          setSelectedAnswerIndicesByQuestion(quiz.map(() => []));
          scrollRef.current?.querySelector('[data-question-index="0"]')?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}
      />
      <SubmitModal
        open={submitModalOpen}
        quiz={quiz}
        selectedAnswerIndicesByQuestion={selectedAnswerIndicesByQuestion}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={() => {}}
      />
    </Stack>
  );
};
