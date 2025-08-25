import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { Counts } from "../../common/Bookmark";
import { useBookmark } from "./useBookmark";
import { getDateTimeString } from "../../common/DateUtils";

const collectionName = "folders";
const documentId = "folders";

export interface Folder {
  name: string;
  counts: Counts;
}

interface FolderDocument {
  folders: Folder[];
}

export const getDocumentId = (folder?: Folder) => {
  return folder
    ? folder.name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, "")
    : undefined;
};

const download = (content?: string, fileName?: string) => {
  if (content && fileName) {
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${fileName}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }
};

export const useFolder = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folderDocument, setFolderDocument] = useState<FolderDocument>();
  const [selectedFolder, setSelectedFolder] = useState<Folder>();
  const { getBookmarkUrls } = useBookmark();

  useEffect(() => {
    const fetchFolderDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      setFolderDocument((await getDoc(docRef)).data() as FolderDocument | undefined);
    };
    fetchFolderDocument();
  }, []);

  const openFolder = useCallback(
    (folder: Folder) => {
      navigate(`/bookmarks/${getDocumentId(folder)}`);
    },
    [navigate]
  );

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
  }, [folderDocument, id, openFolder]);

  const addFolder = async (name: string) => {
    if (name.length > 0) {
      let folders: Folder[];
      const folder = { name, counts: { steam: 0, youtube_regular: 0, youtube_shorts: 0 } };
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

  const updateFolderCounts = async (counts: Counts) => {
    if (folderDocument && selectedFolder) {
      let folders = folderDocument.folders.filter((f) => f.name !== selectedFolder.name);
      const folder: Folder = { name: selectedFolder.name, counts };
      folders = [...folders, folder].sort((a, b) => a.name.localeCompare(b.name));
      const newFolderDocument = { ...folderDocument, folders };
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, newFolderDocument);
      setFolderDocument(newFolderDocument);
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

  const exportFolder = async (folder: Folder) => {
    const id = getDocumentId(folder);
    const urls = await getBookmarkUrls(id);
    download(urls.join("\n"), id);
  };

  const exportFolders = async () => {
    const folders = folderDocument?.folders;
    if (folders) {
      let map: { [name: string]: string[] } = await Promise.all(
        folderDocument?.folders.map(async (folder) => {
          const id = getDocumentId(folder);
          const urls = await getBookmarkUrls(id);
          return [folder.name, urls];
        })
      ).then((entries) => Object.fromEntries(entries));
      download(JSON.stringify(map), getDateTimeString(new Date()));
    }
  };

  return {
    folders: folderDocument ? folderDocument?.folders : [],
    selectedFolder,
    addFolder,
    updateFolderCounts,
    deleteFolder,
    openFolder,
    exportFolder,
    exportFolders
  };
};
