import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const collectionName = "folders";
const documentId = "folders";

export interface Folder {
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
      let folders: Folder[];
      const folder = { name };
      const docRef = doc(db, collectionName, documentId);
      if (folderDocument) {
        folders = [...folderDocument.folders, folder].sort((a, b) => a.name.localeCompare(b.name));
        await updateDoc(docRef, { ...folderDocument, folders });
      } else {
        folders = [folder];
        await setDoc(docRef, { folders: [folder] });
      }
      setFolderDocument((previous) => (previous ? { ...previous, folders } : undefined));
    }
  };

  const deleteFolder = async (folder: Folder) => {
    if (folderDocument) {
      const folders = folderDocument.folders.filter((f) => f.name !== folder.name);
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, { ...folderDocument, folders });
      setFolderDocument((previous) => (previous ? { ...previous, folders } : undefined));
    }
  };

  return {
    folders: folderDocument ? folderDocument?.folders : [],
    selectedFolder,
    setSelectedFolder,
    addFolder,
    deleteFolder
  };
};
