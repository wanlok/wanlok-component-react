import { useEffect, useMemo, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { apiUrl, ApiResponse, Quiz, QuizItem, QuizzesDocument } from "../../../services/Types";

const collectionName = "configs";
const documentId = "quizzes";

export const useQuiz = () => {
  const [quizzesDocument, setQuizzesDocument] = useState<QuizzesDocument | null | undefined>(undefined);
  const quizItems = useMemo(() => quizzesDocument?.quizItems ?? [], [quizzesDocument]);

  useEffect(() => {
    const fetchQuizzesDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      setQuizzesDocument(((await getDoc(docRef)).data() as QuizzesDocument) ?? null);
    };
    fetchQuizzesDocument();
  }, []);

  const updateQuizItems = async (quizItems: QuizItem[]) => {
    const docRef = doc(db, collectionName, documentId);
    if (quizzesDocument) {
      await updateDoc(docRef, { quizItems });
    } else {
      await setDoc(docRef, { quizItems });
    }
    setQuizzesDocument({ quizItems });
  };

  const [selectedQuizItem, setSelectedQuizItem] = useState("");
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Adjust state during render (https://react.dev/learn/you-might-not-need-an-effect#adjusting-some-state-when-a-prop-changes):
  // default selectedQuizItem to the first quiz item once quizItems loads, without an effect.
  const [prevQuizItems, setPrevQuizItems] = useState(quizItems);
  if (quizItems !== prevQuizItems) {
    setPrevQuizItems(quizItems);
    if (!selectedQuizItem && quizItems.length > 0) {
      setSelectedQuizItem(quizItems[0].value);
    }
  }

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
      .then((response) => response.json() as Promise<ApiResponse<Record<string, { quiz?: Quiz[] }>>>)
      .then((response) => {
        setQuiz(Object.values(response.data).flatMap((item) => item.quiz ?? []));
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
