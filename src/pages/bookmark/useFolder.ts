import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";

const collectionName = "folders";
const documentId = "folders";

export interface Folder {
  name: string;
}

interface FolderDocument {
  folders: Folder[];
}

export const getDocumentId = (folder?: Folder) => {
  return folder ? folder.name.toLowerCase().replace(/\s+/g, "-") : undefined;
};

export const useFolder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folderDocument, setFolderDocument] = useState<FolderDocument>();
  const [selectedFolder, setSelectedFolder] = useState<Folder>();

  useEffect(() => {
    const fetchFolderDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      setFolderDocument((await getDoc(docRef)).data() as FolderDocument | undefined);
    };
    fetchFolderDocument();
  }, []);

  useEffect(() => {
    if (folderDocument) {
      const folders = folderDocument.folders;
      if (folders.length > 0) {
        let folder: Folder | undefined = undefined;
        if (id) {
          folder = folders.find((f) => getDocumentId(f) === id);
        }
        if (folder) {
          setSelectedFolder(folder);
        } else {
          openFolder(folders[0]);
        }
      }
    }
  }, [folderDocument, id]);

  const addFolder = async (name: string) => {
    if (name.length > 0) {
      let folders: Folder[];
      const folder = { name };
      const docRef = doc(db, collectionName, documentId);
      if (folderDocument) {
        const duplicated = folderDocument.folders.some((f) => f.name === folder.name);
        if (duplicated) {
          folders = folderDocument.folders;
        } else {
          folders = [...folderDocument.folders, folder].sort((a, b) => a.name.localeCompare(b.name));
          await updateDoc(docRef, { ...folderDocument, folders });
        }
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

  const openFolder = (folder: Folder) => {
    navigate(`/bookmarks/${getDocumentId(folder)}`);
  };

  return {
    folders: folderDocument ? folderDocument?.folders : [],
    selectedFolder,
    addFolder,
    deleteFolder,
    openFolder
  };
};
