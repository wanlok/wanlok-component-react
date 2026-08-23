import { useEffect, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { apiUrl, ApiResponse, Question, Quiz } from "../../../services/ApiTypes";

const emptyQuizzes: Quiz[] = [];
const emptyQuestions: Question[] = [];

export const useQuiz = () => {
  const queryClient = useQueryClient();

  // List quizzes
  const { data: quizzes = emptyQuizzes } = useQuery({
    queryKey: ["quizzes"],
    queryFn: () =>
      fetch(`${apiUrl}/quizzes`)
        .then((response) => response.json() as Promise<ApiResponse<Quiz[]>>)
        .then((response) => response.data)
  });

  // Select first quiz
  const [selectedQuiz, setSelectedQuiz] = useState("");

  const [prevQuizzes, setPrevQuizzes] = useState(quizzes);
  if (quizzes !== prevQuizzes) {
    setPrevQuizzes(quizzes);
    if (!selectedQuiz && quizzes.length > 0) {
      setSelectedQuiz(quizzes[0].value);
    }
  }

  // Add or edit quizzes
  const { mutateAsync: updateQuizzes } = useMutation({
    mutationFn: async (quizzes: Quiz[]) => {
      await fetch(`${apiUrl}/quizzes`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(quizzes)
      });
    },
    onSuccess: (_, quizzes) => queryClient.setQueryData(["quizzes"], quizzes)
  });

  // Get questions
  const { data: questions = emptyQuestions, isLoading } = useQuery({
    queryKey: ["collection", selectedQuiz],
    queryFn: ({ signal }) =>
      fetch(`${apiUrl}/collections/${selectedQuiz}`, { signal })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, { questions?: Question[] }>>>)
        .then((response) => Object.values(response.data).flatMap((item) => item.questions ?? [])),
    enabled: !!selectedQuiz
  });

  // Clear questions
  useEffect(() => {
    if (selectedQuiz && !quizzes.some((quiz) => quiz.value === selectedQuiz)) {
      queryClient.setQueryData(["collection", selectedQuiz], []);
    }
  }, [quizzes, selectedQuiz, queryClient]);

  return {
    quizzes,
    updateQuizzes,
    selectedQuiz,
    setSelectedQuiz,
    questions,
    isLoading
  };
};
