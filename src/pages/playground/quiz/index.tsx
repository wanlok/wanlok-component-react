import { Fragment, useEffect, useRef, useState } from "react";
import { Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { CheckboxInput } from "../../../components/CheckboxInput";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { StyledContainer } from "../../../components/StyledContainer";
import { useQuiz } from "./useQuiz";
import { QuizContent } from "../../../services/Types";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { Assignment as AssignmentIcon, Send as SendIcon, Undo as UndoIcon } from "@mui/icons-material";
import { ResetModal } from "./ResetModal";
import { SubmitModal } from "./SubmitModal";
import { QuizItemsModal } from "./QuizItemsModal";

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
    <Stack sx={{ pb: 2, px: 2 }}>
      <CheckboxInput
        label="Answers"
        labelSx={{ color: "text.secondary" }}
        items={items}
        values={selectedAnswerIndices}
        onChange={onChange}
      />
    </Stack>
  );
};

const ControlBar = ({
  quizItems,
  selectedQuizItem,
  setSelectedQuizItem,
  onViewListButtonClick,
  onResetButtonClick,
  onSubmitButtonClick
}: {
  quizItems: { label: string; value: string }[];
  selectedQuizItem: string;
  setSelectedQuizItem: (value: string) => void;
  onViewListButtonClick: () => void;
  onResetButtonClick: () => void;
  onSubmitButtonClick: () => void;
}) => {
  return (
    <>
      <Stack sx={{ flex: 1, flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onViewListButtonClick} sx={iconButtonSx}>
          <AssignmentIcon sx={{ fontSize: 24 }} />
        </WButton>
        <StyledContainer sx={{ flex: 1, p: 1 }}>
          <SelectInput items={quizItems} value={selectedQuizItem} onChange={setSelectedQuizItem} />
        </StyledContainer>
      </Stack>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onResetButtonClick} sx={iconButtonSx}>
          <UndoIcon sx={{ fontSize: 20 }} />
        </WButton>
        <WButton onClick={onSubmitButtonClick} sx={iconButtonSx}>
          <SendIcon sx={{ fontSize: 20 }} />
        </WButton>
      </Stack>
    </>
  );
};

export const Quiz = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const { quizItems, updateQuizItems, selectedQuizItem, setSelectedQuizItem, quiz } = useQuiz();
  const [selectedAnswerIndicesByQuestion, setSelectedAnswerIndicesByQuestion] = useState<number[][]>([]);
  const [quizItemsModalOpen, setQuizItemsModalOpen] = useState(false);
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
          <Stack sx={[topSx, { flex: 1, px: 2, alignItems: "center" }]}>
            <Typography variant="body1">Quiz</Typography>
          </Stack>
        }
        bottom={
          <Stack sx={[bottomSx]}>
            <ControlBar
              quizItems={quizItems}
              selectedQuizItem={selectedQuizItem}
              setSelectedQuizItem={setSelectedQuizItem}
              onViewListButtonClick={() => setQuizItemsModalOpen(true)}
              onResetButtonClick={() => setResetModalOpen(true)}
              onSubmitButtonClick={() => setSubmitModalOpen(true)}
            />
          </Stack>
        }
      />
      {mobile && (
        <Stack sx={{ flexDirection: "row" }}>
          <ControlBar
            quizItems={quizItems}
            selectedQuizItem={selectedQuizItem}
            setSelectedQuizItem={setSelectedQuizItem}
            onViewListButtonClick={() => setQuizItemsModalOpen(true)}
            onResetButtonClick={() => setResetModalOpen(true)}
            onSubmitButtonClick={() => setSubmitModalOpen(true)}
          />
        </Stack>
      )}
      <Stack ref={scrollRef} sx={{ flex: 1, overflow: "auto", gap: "1px" }}>
        {quiz.map(({ question, answers }, i) => (
          <Fragment key={`question-${i}`}>
            {i > 0 && <Divider />}
            <Stack data-question-index={i}>
              <QuestionContainer number={i} question={question} />
              <AnswerContainer
                answers={answers}
                selectedAnswerIndices={selectedAnswerIndicesByQuestion[i] ?? []}
                onChange={(selectedAnswerIndices) => onAnswerChange(i, selectedAnswerIndices)}
              />
            </Stack>
          </Fragment>
        ))}
      </Stack>
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1, p: 2, justifyContent: "center" }}>
          <Typography variant="body1">
            {answeredCount} / {quiz.length} questions answered
          </Typography>
        </Stack>
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton disabled={answeredCount === quiz.length} onClick={onNextQuestionButtonClick}>
            Next Question
          </WButton>
        </Stack>
      </Stack>
      <QuizItemsModal
        open={quizItemsModalOpen}
        onClose={() => setQuizItemsModalOpen(false)}
        quizItems={quizItems}
        updateQuizItems={updateQuizItems}
      />
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
