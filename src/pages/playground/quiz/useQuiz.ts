import { useEffect, useState } from "react";
import { Quiz } from "../../../services/Types";

const quizItems = [
  { label: "AWS Examinations", value: "aws-examinations" },
  { label: "HKCEE Past Papers", value: "hkcee-past-papers" }
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

    const iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);

    let observer: MutationObserver | undefined;

    const captureContent = () => {
      const root = iframe.contentDocument?.getElementById("root");
      if (!root) {
        return;
      }
      try {
        const items = JSON.parse(root.textContent ?? "") as Record<string, { quiz?: Quiz[] }>;
        setQuiz(Object.values(items).flatMap((item) => item.quiz ?? []));
        setIsLoading(false);
        observer?.disconnect();
      } catch {
        // Firestore fetch inside the iframe hasn't resolved into JSON yet.
      }
    };

    const onLoad = () => {
      const root = iframe.contentDocument?.getElementById("root");
      if (!root) {
        return;
      }
      observer = new MutationObserver(captureContent);
      observer.observe(root, { childList: true, characterData: true, subtree: true });
    };

    iframe.addEventListener("load", onLoad);
    iframe.src = `${window.location.origin}${window.location.pathname}#/api/collections/${selectedQuizItem}`;

    return () => {
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
      iframe.remove();
    };
  }, [selectedQuizItem]);

  return {
    quizItems,
    selectedQuizItem,
    setSelectedQuizItem,
    quiz,
    isLoading
  };
};
