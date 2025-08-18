import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const collectionName = "dummy";
const documentId = "image";

export interface FileInfo {
  name?: string;
  mime_type: string;
  reject_reason?: string;
  path?: string;
}

interface ImageDocument {
  fileInfoList: FileInfo[];
}

export const useImage = () => {
  const [imageDocument, setImageDocument] = useState<ImageDocument>();

  useEffect(() => {
    const docRef = doc(db, collectionName, documentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      setImageDocument(snapshot.data() as ImageDocument);
    });
    return () => unsubscribe();
  }, []);

  const addFileInfoList = async (fileInfoList: FileInfo[]) => {
    const docRef = doc(db, collectionName, documentId);
    if (imageDocument) {
      await updateDoc(docRef, {
        ...imageDocument,
        fileInfoList: [...imageDocument.fileInfoList, ...fileInfoList]
      });
    } else {
      await setDoc(docRef, { fileInfoList });
    }
  };

  return { imageDocument, addFileInfoList };
};
