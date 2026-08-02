import { useEffect, useState } from "react";
import { Quiz } from "../../../services/Types";
import { fetchCollection } from "../../../services/fetchCollection";

const quizItems = [
  { label: "AWS Examinations", value: "aws-examinations" },
  { label: "HKCEE CIT 2007 Paper 1", value: "hkcee-past-papers?subject=CIT 2007 Paper 1" },
  { label: "HKCEE CIT 2008 Paper 2", value: "hkcee-past-papers?subject=CIT 2008 Paper 1" }
];

export const useQuiz = () => {
  const [selectedQuizItem, setSelectedQuizItem] = useState(quizItems[0].value);
  const [quiz, setQuiz] = useState<Quiz[]>([]);
  const [isLoading, setIsLoading] = useState(false);

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
    selectedQuizItem,
    setSelectedQuizItem,
    quiz,
    isLoading
  };
};
