import { useEffect, useMemo, useState } from "react";
import { apiUrl, ApiResponse, Question, QuizItem, QuizzesDocument } from "../../../services/Types";

export const useQuiz = () => {
  const [quizzesDocument, setQuizzesDocument] = useState<QuizzesDocument | null | undefined>(undefined);
  const quizItems = useMemo(() => quizzesDocument?.quizItems ?? [], [quizzesDocument]);

  const [selectedQuizItem, setSelectedQuizItem] = useState("");
  const [quiz, setQuiz] = useState<Question[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [prevQuizItems, setPrevQuizItems] = useState(quizItems);
  if (quizItems !== prevQuizItems) {
    setPrevQuizItems(quizItems);
    if (!selectedQuizItem && quizItems.length > 0) {
      setSelectedQuizItem(quizItems[0].value);
    }
  }

  useEffect(() => {
    fetch(`${apiUrl}/quizzes`)
      .then((response) => response.json() as Promise<ApiResponse<QuizItem[]>>)
      .then((response) => setQuizzesDocument({ quizItems: response.data }));
  }, []);

  const updateQuizItems = async (quizItems: QuizItem[]) => {
    await fetch(`${apiUrl}/quizzes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(quizItems)
    });
    setQuizzesDocument({ quizItems });
  };

  useEffect(() => {
    if (selectedQuizItem && !quizItems.some((quizItem) => quizItem.value === selectedQuizItem)) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- clears stale quiz data when the selected item was externally removed from quizItems, not a prop mirror
      setQuiz([]);
    }
  }, [quizItems, selectedQuizItem]);

  useEffect(() => {
    if (!selectedQuizItem) {
      return;
    }
    // eslint-disable-next-line react-hooks/set-state-in-effect -- resetting before a fetch, same shape as React's own data-fetching docs example
    setQuiz([]);
    setIsLoading(true);

    const controller = new AbortController();
    fetch(`${apiUrl}/collections/${selectedQuizItem}`, { signal: controller.signal })
      .then((response) => response.json() as Promise<ApiResponse<Record<string, { questions?: Question[] }>>>)
      .then((response) => {
        setQuiz(Object.values(response.data).flatMap((item) => item.questions ?? []));
        setIsLoading(false);
      })
      .catch(() => {
        // Aborted because selectedQuizItem changed or the component unmounted.
      });

    return () => controller.abort();
  }, [selectedQuizItem]);

  return {
    quizItems,
    updateQuizItems,
    selectedQuizItem,
    setSelectedQuizItem,
    quiz,
    isLoading
  };
};
