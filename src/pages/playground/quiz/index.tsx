import { Fragment, useRef, useState } from "react";
import { Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { SelectInput } from "../../../components/SelectInput";
import { CheckboxInput } from "../../../components/CheckboxInput";
import { bottomSx, LayoutHeader, topSx } from "../../../components/LayoutHeader";
import { StyledContainer } from "../../../components/StyledContainer";
import { useQuiz } from "./useQuiz";
import { QuizContent } from "../../../services/ApiTypes";
import { iconButtonSx, WButton } from "../../../components/WButton";
import { Assignment as AssignmentIcon, Send as SendIcon, Undo as UndoIcon } from "@mui/icons-material";
import { ResetModal } from "./ResetModal";
import { SubmitModal } from "./SubmitModal";
import { QuizzesModal } from "./QuizzesModal";

const QuestionContainer = ({ number, content }: { number: number; content: QuizContent[] }) => {
  return (
    <Stack sx={{ p: 2, gap: 1 }}>
      <Typography variant="body2" sx={{ color: "text.secondary" }}>
        Question {number + 1}
      </Typography>
      {content.map(({ value }, i) => (
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
  quizzes,
  selectedQuiz,
  setSelectedQuiz,
  onViewListButtonClick,
  onResetButtonClick,
  onSubmitButtonClick
}: {
  quizzes: { label: string; value: string }[];
  selectedQuiz: string;
  setSelectedQuiz: (value: string) => void;
  onViewListButtonClick: () => void;
  onResetButtonClick: () => void;
  onSubmitButtonClick: () => void;
}) => {
  return (
    <>
      <StyledContainer sx={{ flex: 1, p: 1 }}>
        <SelectInput items={quizzes} value={selectedQuiz} onChange={setSelectedQuiz} />
      </StyledContainer>
      <Stack sx={{ flexDirection: "row", gap: "1px" }}>
        <WButton onClick={onViewListButtonClick} sx={iconButtonSx}>
          <AssignmentIcon sx={{ fontSize: 24 }} />
        </WButton>
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

export const Index = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const { quizzes, updateQuizzes, selectedQuiz, setSelectedQuiz, questions } = useQuiz();
  const [selectedAnswerIndicesByQuestion, setSelectedAnswerIndicesByQuestion] = useState<number[][]>([]);
  const [quizzesModalOpen, setQuizzesModalOpen] = useState(false);
  const [resetModalOpen, setResetModalOpen] = useState(false);
  const [submitModalOpen, setSubmitModalOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Adjust state during render (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes):
  // reset the answer selections whenever a new quiz loads, without resetting sibling modal-open state.
  const [prevQuestions, setPrevQuestions] = useState(questions);
  if (questions !== prevQuestions) {
    setPrevQuestions(questions);
    setSelectedAnswerIndicesByQuestion(questions.map(() => []));
  }

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
              quizzes={quizzes}
              selectedQuiz={selectedQuiz}
              setSelectedQuiz={setSelectedQuiz}
              onViewListButtonClick={() => setQuizzesModalOpen(true)}
              onResetButtonClick={() => setResetModalOpen(true)}
              onSubmitButtonClick={() => setSubmitModalOpen(true)}
            />
          </Stack>
        }
      />
      {mobile && (
        <Stack sx={{ flexDirection: "row" }}>
          <ControlBar
            quizzes={quizzes}
            selectedQuiz={selectedQuiz}
            setSelectedQuiz={setSelectedQuiz}
            onViewListButtonClick={() => setQuizzesModalOpen(true)}
            onResetButtonClick={() => setResetModalOpen(true)}
            onSubmitButtonClick={() => setSubmitModalOpen(true)}
          />
        </Stack>
      )}
      <Stack ref={scrollRef} sx={{ flex: 1, overflow: "auto", gap: "1px" }}>
        {questions.map(({ content, answers }, i) => (
          <Fragment key={`question-${i}`}>
            {i > 0 && <Divider />}
            <Stack data-question-index={i}>
              <QuestionContainer number={i} content={content} />
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
            {answeredCount} / {questions.length} questions answered
          </Typography>
        </Stack>
        <Stack sx={{ flexDirection: "row", gap: "1px" }}>
          <WButton disabled={answeredCount === questions.length} onClick={onNextQuestionButtonClick}>
            Next Question
          </WButton>
        </Stack>
      </Stack>
      <QuizzesModal
        key={`quizzes-modal-${quizzesModalOpen ? "open" : "closed"}`}
        open={quizzesModalOpen}
        onClose={() => setQuizzesModalOpen(false)}
        quizzes={quizzes}
        updateQuizzes={updateQuizzes}
      />
      <ResetModal
        open={resetModalOpen}
        onClose={() => setResetModalOpen(false)}
        onConfirm={() => {
          setSelectedAnswerIndicesByQuestion(questions.map(() => []));
          scrollRef.current?.querySelector('[data-question-index="0"]')?.scrollIntoView({
            behavior: "smooth",
            block: "start"
          });
        }}
      />
      <SubmitModal
        key={`submit-modal-${submitModalOpen ? "open" : "closed"}`}
        open={submitModalOpen}
        questions={questions}
        selectedAnswerIndicesByQuestion={selectedAnswerIndicesByQuestion}
        onClose={() => setSubmitModalOpen(false)}
        onConfirm={() => {}}
      />
    </Stack>
  );
};
