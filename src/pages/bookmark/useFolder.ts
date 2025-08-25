import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import { BookmarkDocument, Counts, viewUrls } from "../../common/Bookmark";

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
    const bookmarkId = getDocumentId(folder);
    if (bookmarkId) {
      const urls = [];
      const docRef = doc(db, "bookmarks", bookmarkId);
      const bookmarkDocument = (await getDoc(docRef)).data() as BookmarkDocument | undefined;
      if (bookmarkDocument) {
        for (const [key, dict] of Object.entries(bookmarkDocument)) {
          const viewUrl = viewUrls[key as keyof typeof viewUrls] ?? "";
          if (viewUrl.length > 0) {
            for (const id of Object.keys(dict)) {
              urls.push(`${viewUrl}${id}`);
            }
          }
        }
      }
      const blob = new Blob([urls.join("\n")], { type: "text/plain" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${bookmarkId}.txt`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return {
    folders: folderDocument ? folderDocument?.folders : [],
    selectedFolder,
    addFolder,
    updateFolderCounts,
    deleteFolder,
    openFolder,
    exportFolder
  };
};
