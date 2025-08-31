import { useCallback, useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  CollectionCounts,
  emptyCollectionCounts,
  emptyCollectionSequences,
  Folder,
  FolderDocument,
  isCollectionKey
} from "../../services/Types";
import { useCollection } from "./useCollection";
import { getDateTimeString } from "../../common/DateUtils";
import { getServerHealth } from "../../services/ServerHealthService";

const collectionName = "configs";
const documentId = "folders";

export const getDocumentId = (folderName?: string) => {
  return folderName
    ? folderName
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
  const [serverHealth, setServerHealth] = useState<boolean>();
  const [folderDocument, setFolderDocument] = useState<FolderDocument>();
  const [selectedFolder, setSelectedFolder] = useState<Folder>();
  const { addCollections, getCollectionUrls } = useCollection();

  useEffect(() => {
    const fetchServerHealth = async () => {
      setServerHealth((await getServerHealth()) !== undefined);
    };
    const fetchFolderDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      setFolderDocument((await getDoc(docRef)).data() as FolderDocument | undefined);
    };
    fetchServerHealth();
    fetchFolderDocument();
  }, []);

  const openFolder = useCallback(
    (folder: Folder) => {
      navigate(`/collections/${getDocumentId(folder.name)}`);
    },
    [navigate]
  );

  useEffect(() => {
    if (folderDocument) {
      const folders = folderDocument.folders;
      if (folders.length > 0) {
        let folder: Folder | undefined = undefined;
        if (id) {
          folder = folders.find((f) => getDocumentId(f.name) === id);
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
    if (name.length > 0 && /^[a-zA-Z0-9 ]+$/.test(name)) {
      let folders: Folder[];
      const folder = { name, counts: emptyCollectionCounts, sequences: emptyCollectionSequences };
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

  const updateFolderDocument = async (folder: Folder) => {
    if (folderDocument && selectedFolder) {
      let folders = folderDocument.folders.filter((f) => f.name !== selectedFolder.name);
      folders = [...folders, folder].sort((a, b) => a.name.localeCompare(b.name));
      const newFolderDocument = { ...folderDocument, folders };
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, newFolderDocument);
      setFolderDocument(newFolderDocument);
    }
  };

  const updateFolderCounts = async (counts: CollectionCounts) => {
    if (selectedFolder) {
      await updateFolderDocument({ name: selectedFolder.name, counts, sequences: selectedFolder.sequences });
    }
  };

  const updateFolderSequences = async (type: string, sequences: string[]) => {
    if (selectedFolder) {
      const newSequences = { ...selectedFolder.sequences };
      if (isCollectionKey(type)) {
        newSequences[type] = sequences;
      }
      await updateFolderDocument({ name: selectedFolder.name, counts: selectedFolder.counts, sequences: newSequences });
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

  const upload = async (json: { [folderName: string]: string[] }) => {
    let newFolderDocument;
    if (folderDocument) {
      const newFolders = [];
      const names = folderDocument.folders.map((folder) => folder.name);
      for (const [name] of Object.entries(json)) {
        if (!names?.includes(name)) {
          const folder = { name, counts: emptyCollectionCounts, sequences: emptyCollectionSequences };
          newFolders.push(folder);
        }
      }
      const folders = [...folderDocument.folders, ...newFolders].sort((a, b) => a.name.localeCompare(b.name));
      newFolderDocument = { ...folderDocument, folders };
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, newFolderDocument);
    } else {
      newFolderDocument = {
        folders: Object.entries(json).map((f) => {
          return { name: f[0], counts: emptyCollectionCounts, sequences: emptyCollectionSequences };
        })
      };
      const docRef = doc(db, collectionName, documentId);
      await setDoc(docRef, newFolderDocument);
    }
    setFolderDocument(newFolderDocument);
    for (const [name, list] of Object.entries(json)) {
      const collectionId = getDocumentId(name);
      if (collectionId) {
        addCollections(collectionId, list.join("\n"));
      }
    }
  };

  const uploadFolders = async () => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = () => {
      const files = input.files;
      if (files) {
        for (let i = 0; i < files.length; i++) {
          const fileReader = new FileReader();
          fileReader.onload = () => {
            let jsonObject;
            try {
              jsonObject = JSON.parse(fileReader.result as string);
            } catch (e) {}
            if (
              jsonObject !== null &&
              typeof jsonObject === "object" &&
              Object.values(jsonObject).every((i) => Array.isArray(i) && i.every((j) => typeof j === "string"))
            ) {
              upload(jsonObject as { [folderName: string]: string[] });
            } else {
            }
          };
          fileReader.onerror = () => {};
          fileReader.readAsText(files[i]);
        }
      }
    };
    input.click();
  };

  const downloadFolder = async (folder: Folder) => {
    const id = getDocumentId(folder.name);
    const urls = await getCollectionUrls(id);
    download(urls.join("\n"), id);
  };

  const downloadFolders = async () => {
    const folders = folderDocument?.folders;
    if (folders) {
      let map: { [name: string]: string[] } = await Promise.all(
        folderDocument?.folders.map(async (folder) => {
          const id = getDocumentId(folder.name);
          const urls = await getCollectionUrls(id);
          return [folder.name, urls];
        })
      ).then((entries) => Object.fromEntries(entries));
      download(JSON.stringify(map), getDateTimeString(new Date()));
    }
  };

  return {
    serverHealth,
    folders: folderDocument ? folderDocument?.folders : [],
    selectedFolder,
    addFolder,
    updateFolderCounts,
    updateFolderSequences,
    deleteFolder,
    openFolder,
    uploadFolders,
    downloadFolder,
    downloadFolders
  };
};
