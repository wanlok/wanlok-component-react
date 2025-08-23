import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

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
    const fetchFolderDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      const document = (await getDoc(docRef)).data() as FolderDocument | undefined;
      if (document) {
        document.folders.sort((a, b) => a.name.localeCompare(b.name));
        setFolderDocument(document);
        if (document.folders.length > 0) {
          setSelectedFolder(document.folders[0]);
        }
      }
    };
    fetchFolderDocument();
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
