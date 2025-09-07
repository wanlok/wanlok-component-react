import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { YakijujuDocument } from "../../services/Types";

const collectionName = "configs";
const documentId = "yakijuju";

export const useGame = () => {
  const [yakijujuDocument, setYakijujuDocument] = useState<YakijujuDocument>();

  const [name, setName] = useState<string>();
  const [filePath, setFilePath] = useState<string>("");

  useEffect(() => {
    const fetchDocument = async (id?: string) => {
      if (id) {
        const docRef = doc(db, collectionName, id);
        setYakijujuDocument((await getDoc(docRef)).data() as YakijujuDocument | undefined);
      }
    };
    fetchDocument(documentId);
  }, []);

  const startGame = (name: string) => {
    setName(name);
    setFilePath("yakijuju.swf");
  };

  const addScore = async (score: number) => {
    if (name) {
      let scores: { [key: string]: number };
      const docRef = doc(db, collectionName, documentId);
      if (yakijujuDocument) {
        const previousScores = yakijujuDocument.scores;
        const previousScore = previousScores[name];
        if (previousScore && score > previousScore) {
          scores = { ...yakijujuDocument.scores, [name]: score };
          await updateDoc(docRef, { scores });
        } else {
          scores = previousScores;
        }
      } else {
        scores = { [name]: score };
        await setDoc(docRef, { scores });
      }
      setYakijujuDocument({ scores });
    }
  };

  return { name, filePath, scores: yakijujuDocument?.scores ?? {}, startGame, addScore };
};
