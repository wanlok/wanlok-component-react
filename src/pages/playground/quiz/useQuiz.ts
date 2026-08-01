import { useEffect, useState } from "react";
import { Quiz } from "../../../services/Types";

const folderItems = [
  { label: "AWS Examinations", value: "aws-examinations" },
  { label: "HKCEE Past Papers", value: "hkcee-past-papers" }
];

export const useQuiz = () => {
  const [collectionId, setCollectionId] = useState(folderItems[0].value);
  const [quiz, setQuiz] = useState<Quiz[]>([]);

  useEffect(() => {
    if (!collectionId) {
      return;
    }
    setQuiz([]);

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
    iframe.src = `${window.location.origin}${window.location.pathname}#/api/collections/${collectionId}`;

    return () => {
      iframe.removeEventListener("load", onLoad);
      observer?.disconnect();
      iframe.remove();
    };
  }, [collectionId]);

  return {
    folderItems,
    collectionId,
    setCollectionId,
    quiz
  };
};
