import { useCallback, useEffect, useMemo, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { useNavigate, useParams } from "react-router-dom";
import {
  CollectionAttributes,
  CollectionCounts,
  CollectionSequences,
  emptyCollectionAttributes,
  emptyCollectionCounts,
  emptyCollectionSequences,
  Folder,
  FolderDocument,
  isCollectionKey
} from "../../services/Types";
import { useCollection } from "./useCollection";
import { getDateTimeString } from "../../common/DateUtils";
import { getFiles } from "../../common/FileUtils";
import { getCountsByUrlStrings } from "../../common/CountUtils";
import { toSlug } from "../../common/StringUtils";

const collectionName = "configs";
const documentId = "folders";

export const getDocumentId = (folderName?: string) => (folderName ? toSlug(folderName) : undefined);

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
  const [folderDocument, setFolderDocument] = useState<FolderDocument | null | undefined>(undefined);
  const { addCollectionItems, deleteCollection, getCollectionUrls } = useCollection();

  useEffect(() => {
    const fetchFolderDocument = async () => {
      const docRef = doc(db, collectionName, documentId);
      setFolderDocument(((await getDoc(docRef)).data() as FolderDocument) ?? null);
    };
    fetchFolderDocument();
  }, []);

  const openFolder = useCallback(
    (folder: Folder) => {
      navigate(`/collections/${getDocumentId(folder.name)}`);
    },
    [navigate]
  );

  const folders = useMemo(() => folderDocument?.folders ?? [], [folderDocument]);
  const selectedFolder = id ? folders.find((f) => getDocumentId(f.name) === id) : undefined;

  useEffect(() => {
    if (folders.length > 0 && !selectedFolder) {
      openFolder(folders[0]);
    }
  }, [folders, selectedFolder, openFolder]);

  const addFolder = async (name: string) => {
    if (name.length > 0 && /^[a-zA-Z0-9 ]+$/.test(name)) {
      let folders: Folder[];
      const folder = { name, attributes: [], counts: emptyCollectionCounts, sequences: emptyCollectionSequences };
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

  const updateFolder = async ({
    name,
    counts,
    sequences,
    attributes
  }: {
    name?: string;
    counts?: CollectionCounts;
    sequences?: Partial<CollectionSequences>;
    attributes?: CollectionAttributes;
  } = {}) => {
    if (selectedFolder) {
      const newName = name ?? selectedFolder.name;
      await updateFolderDocument({
        name: newName,
        counts: counts ?? selectedFolder.counts,
        sequences: sequences ? { ...selectedFolder.sequences, ...sequences } : selectedFolder.sequences,
        attributes: attributes ?? selectedFolder.attributes
      });
      if (name && name !== selectedFolder.name) {
        openFolder({ ...selectedFolder, name });
      }
    }
  };

  const isFolderSorted = () => {
    let folderSorted = false;
    if (selectedFolder) {
      folderSorted = Object.keys(selectedFolder.sequences).some(
        (key) => isCollectionKey(key) && selectedFolder.sequences[key].length > 0
      );
    }
    return folderSorted;
  };

  const resetFolderSequences = async () => {
    if (selectedFolder) {
      await updateFolderDocument({
        name: selectedFolder.name,
        attributes: selectedFolder.attributes,
        counts: selectedFolder.counts,
        sequences: emptyCollectionSequences
      });
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
    await Promise.all(
      Object.entries(json).map(async ([name]) => {
        const collectionId = getDocumentId(name);
        if (collectionId) {
          await deleteCollection(collectionId);
        }
      })
    );
    const docRef = doc(db, collectionName, documentId);
    await deleteDoc(docRef);
    const newFolderDocument = {
      folders: Object.entries(json).map(([name, urlStrings]) => {
        return {
          name,
          attributes: emptyCollectionAttributes,
          counts: getCountsByUrlStrings(urlStrings),
          sequences: emptyCollectionSequences
        };
      })
    };
    await setDoc(docRef, newFolderDocument);
    await Promise.all(
      Object.entries(json).map(async ([name, urlStrings]) => {
        const collectionId = getDocumentId(name);
        if (collectionId) {
          await addCollectionItems(collectionId, urlStrings.join("\n"));
        }
      })
    );
    setFolderDocument(newFolderDocument);
  };

  const uploadFolders = async () => {
    const files = await getFiles();
    if (files.length > 0) {
      const fileReader = new FileReader();
      fileReader.onload = () => {
        let jsonObject;
        try {
          jsonObject = JSON.parse(fileReader.result as string);
        } catch {
          // leave jsonObject undefined on parse failure
        }
        if (
          jsonObject !== null &&
          typeof jsonObject === "object" &&
          Object.values(jsonObject).every((i) => Array.isArray(i) && i.every((j) => typeof j === "string"))
        ) {
          upload(jsonObject as { [folderName: string]: string[] });
        }
      };
      fileReader.onerror = () => {};
      fileReader.readAsText(files[0]);
    }
  };

  const downloadFolder = async (folder: Folder) => {
    const id = getDocumentId(folder.name);
    const urls = await getCollectionUrls(id);
    download(urls.join("\n"), id);
  };

  const downloadFolders = async () => {
    const folders = folderDocument?.folders;
    if (folders) {
      const map: { [name: string]: string[] } = await Promise.all(
        folderDocument?.folders.map(async (folder) => {
          const id = getDocumentId(folder.name);
          const urls = await getCollectionUrls(id);
          return [folder.name, urls];
        })
      ).then((entries) => Object.fromEntries(entries));
      download(JSON.stringify(map, null, 2), getDateTimeString(new Date()));
    }
  };

  return {
    isLoading: folderDocument === undefined,
    folders: folderDocument?.folders ?? [],
    selectedFolder,
    addFolder,
    updateFolder,

    isFolderSorted,
    resetFolderSequences,
    deleteFolder,
    openFolder,
    uploadFolders,
    downloadFolder,
    downloadFolders
  };
};
