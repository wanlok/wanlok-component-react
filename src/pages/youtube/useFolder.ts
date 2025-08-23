import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

const collectionName = "folders";
const documentId = "folders";

export interface Folder {
  id: string;
  name: string;
}

interface FolderDocument {
  folders: Folder[];
}

export const useFolder = () => {
  const [folderDocument, setFolderDocument] = useState<FolderDocument>();
  const [selectedFolder, setSelectedFolder] = useState<Folder>();

  useEffect(() => {
    const docRef = doc(db, collectionName, documentId);
    const unsubscribe = onSnapshot(docRef, (snapshot) => {
      const folderDocument = snapshot.data() as FolderDocument | undefined;
      if (folderDocument) {
        setFolderDocument(folderDocument);
        if (folderDocument.folders.length > 0) {
          setSelectedFolder(folderDocument.folders[0]);
        }
      }
    });
    return () => unsubscribe();
  }, []);

  const addFolder = async (name: string) => {
    if (name.length > 0) {
      const folder = { name };
      const docRef = doc(db, collectionName, documentId);
      if (folderDocument) {
        await updateDoc(docRef, {
          folders: [...folderDocument.folders, folder]
        });
      } else {
        await setDoc(docRef, {
          folders: [folder]
        });
      }
    }
  };

  return { addFolder, folders: folderDocument ? folderDocument?.folders : [], selectedFolder, setSelectedFolder };
};
