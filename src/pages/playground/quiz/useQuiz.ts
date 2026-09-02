import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ApiResponse, apiUrl, Collection, CollectionItem, Question } from "../../../services/ApiTypes";
import { toSlug } from "../../../utils/StringUtils";

const emptyItems: Record<string, CollectionItem> = {};
const emptyQuestions: Question[] = [];

export const useQuiz = () => {
  // List collection names that have quiz questions
  const { data: quizNames = [] } = useQuery({
    queryKey: ["collections", "quiz"],
    queryFn: () =>
      fetch(`${apiUrl}/collections`)
        .then((response) => response.json() as Promise<ApiResponse<Collection[]>>)
        .then((response) =>
          response.data.filter((collection) => collection.counts.quiz > 0).map((collection) => collection.name)
        )
  });

  // No default selection -- the user picks a quiz explicitly, and the placeholder shows until then.
  const [selectedQuiz, setSelectedQuiz] = useState("");
  if (selectedQuiz && !quizNames.includes(selectedQuiz)) {
    setSelectedQuiz("");
  }

  // List items with questions in the selected collection -- one collection can hold several separate
  // quiz items (often sharing the same display name, e.g. PDF pages), so selection is keyed by id.
  const { data: items = emptyItems } = useQuery({
    queryKey: ["collection", selectedQuiz],
    queryFn: ({ signal }) =>
      fetch(`${apiUrl}/collections/${toSlug(selectedQuiz)}`, { signal })
        .then((response) => response.json() as Promise<ApiResponse<Record<string, CollectionItem>>>)
        .then((response) => response.data),
    enabled: !!selectedQuiz
  });
  const quizItems = Object.entries(items).filter(([, item]) => (item.questions?.length ?? 0) > 0);

  // No default selection either, but reset it if it stops being valid (e.g. after switching quizzes).
  const [selectedQuizItemId, setSelectedQuizItemId] = useState("");
  if (selectedQuizItemId && !quizItems.some(([id]) => id === selectedQuizItemId)) {
    setSelectedQuizItemId("");
  }

  // index.tsx resets its local answer state via reference-equality on questions, so this needs to
  // stay stable while nothing has changed -- items and selectedQuizItemId are already stable.
  const questions = useMemo(() => items[selectedQuizItemId]?.questions ?? emptyQuestions, [items, selectedQuizItemId]);

  return {
    quizNames,
    selectedQuiz,
    setSelectedQuiz,
    quizItems,
    selectedQuizItemId,
    setSelectedQuizItemId,
    questions
  };
};
