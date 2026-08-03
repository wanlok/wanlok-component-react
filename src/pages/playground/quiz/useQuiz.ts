import { useEffect, useState } from "react";
import { db } from "../../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { Quiz, QuizItem, QuizzesDocument } from "../../../services/Types";
import { fetchCollection } from "../../../services/fetchCollection";

const collectionName = "configs";
const documentId = "quizzes";

export const useQuiz = () => {
  const [quizzesDocument, setQuizzesDocument] = useState<QuizzesDocument | null | undefined>(undefined);
  const quizItems = quizzesDocument?.quizItems ?? [];

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

  useEffect(() => {
    if (!selectedQuizItem && quizItems.length > 0) {
      setSelectedQuizItem(quizItems[0].value);
    }
  }, [quizItems, selectedQuizItem]);

  useEffect(() => {
    if (selectedQuizItem && !quizItems.some((quizItem) => quizItem.value === selectedQuizItem)) {
      setQuiz([]);
    }
  }, [quizItems, selectedQuizItem]);

  useEffect(() => {
    if (!selectedQuizItem) {
      return;
    }
    setQuiz([]);
    setIsLoading(true);

    const controller = new AbortController();
    fetchCollection<Record<string, { quiz?: Quiz[] }>>(selectedQuizItem, controller.signal)
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
