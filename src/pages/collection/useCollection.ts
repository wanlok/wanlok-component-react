import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, FieldPath, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  CollectionDocument,
  CollectionCounts,
  isCollectionKey,
  viewUrls,
  CollectionSequences,
  Direction,
  getCounts
} from "../../services/Types";
import { isAllEmpty, toList } from "../../common/ListDictUtils";
import { getFiles } from "../../common/FileUtils";
import { getChartItems } from "../../services/ChartService";
import { getSteamInfos } from "../../services/SteamService";
import { getYouTubeRegularAndShortInfos } from "../../services/YouTubeService";
import { uploadAndGetFileInfos } from "../../services/ImageService";
import { getHyperlinks } from "../../services/HyperlinkService";

const collectionName = "collections";

export const useCollection = (
  documentId?: string,
  collectionSequences?: CollectionSequences,
  updateFolderSequences?: (type: string, sequences: string[]) => void
) => {
  const [collectionDocument, setCollectionDocument] = useState<CollectionDocument>();

  useEffect(() => {
    const fetchCollectionDocument = async (id?: string) => {
      if (id) {
        const docRef = doc(db, collectionName, id);
        setCollectionDocument((await getDoc(docRef)).data() as CollectionDocument | undefined);
      }
    };
    fetchCollectionDocument(documentId);
  }, [documentId]);

  const addCollections = async (collectionId: string, text: string) => {
    let counts: CollectionCounts | undefined = undefined;
    if (collectionId && text) {
      const { charts } = getChartItems(text);
      const { steam } = await getSteamInfos(text);
      const { youtube_regular, youtube_shorts } = await getYouTubeRegularAndShortInfos(text);
      const { hyperlinks } = await getHyperlinks(text, [charts, steam, youtube_regular, youtube_shorts]);

      const docRef = doc(db, collectionName, collectionId);
      let document;
      if (collectionDocument) {
        document = {
          ...collectionDocument,
          charts: { ...collectionDocument.charts, ...charts },
          files: { ...collectionDocument.files },
          hyperlinks: { ...collectionDocument.hyperlinks, ...hyperlinks },
          steam: { ...collectionDocument.steam, ...steam },
          youtube_regular: { ...collectionDocument.youtube_regular, ...youtube_regular },
          youtube_shorts: { ...collectionDocument.youtube_shorts, ...youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = { charts, files: {}, hyperlinks, steam, youtube_regular, youtube_shorts };
        await setDoc(docRef, document);
      }
      setCollectionDocument(document);
      counts = getCounts(document);
    }
    return counts;
  };

  const addCollectionFiles = (collectionId: string) => {
    let counts: CollectionCounts | undefined = undefined;
    getFiles(async (files) => {
      const fileInfos = await uploadAndGetFileInfos(files);
      const docRef = doc(db, collectionName, collectionId);
      let document;
      if (collectionDocument) {
        document = {
          ...collectionDocument,
          files: { ...collectionDocument.files, ...fileInfos }
        };
        await updateDoc(docRef, document);
      } else {
        document = { charts: {}, files: fileInfos, hyperlinks: {}, steam: {}, youtube_regular: {}, youtube_shorts: {} };
        await setDoc(docRef, document);
      }
      setCollectionDocument(document);
      counts = getCounts(document);
    });
    return counts;
  };

  const updateCollection = async (type: string, id: string, direction: Direction) => {
    if (collectionDocument && isCollectionKey(type)) {
      const keys = Object.keys(collectionDocument[type]);
      const typeSequences = collectionSequences?.[type];
      const sequences =
        typeSequences && typeSequences.length > 0
          ? [...typeSequences, ...keys.filter((key) => !typeSequences.includes(key))]
          : keys;
      const index = sequences.findIndex((item) => item === id);
      if (direction === Direction.left && index > 0) {
        const temp = sequences[index];
        sequences[index] = sequences[index - 1];
        sequences[index - 1] = temp;
        updateFolderSequences?.(type, sequences);
      } else if (direction === Direction.right && index < sequences.length - 1) {
        const temp = sequences[index];
        sequences[index] = sequences[index + 1];
        sequences[index + 1] = temp;
        updateFolderSequences?.(type, sequences);
      }
    }
  };

  const deleteCollection = async (type: string, id: string) => {
    let counts: CollectionCounts | undefined = undefined;
    if (collectionDocument && documentId) {
      const document: CollectionDocument = { ...collectionDocument };
      if (isCollectionKey(type)) {
        delete document[type][id];
      }
      const docRef = doc(db, collectionName, documentId);
      if (isAllEmpty(document)) {
        await deleteDoc(docRef);
        setCollectionDocument(undefined);
      } else {
        await updateDoc(docRef, new FieldPath(type, id), deleteField());
        setCollectionDocument(document);
      }
      counts = getCounts(document);
    }
    return counts;
  };

  const getCollectionUrls = async (id?: string) => {
    const urls: string[] = [];
    if (id) {
      const docRef = doc(db, collectionName, id);
      const collectionDocument = (await getDoc(docRef)).data() as CollectionDocument | undefined;
      if (collectionDocument) {
        for (const [key, dict] of Object.entries(collectionDocument)) {
          const viewUrl = viewUrls[key as keyof typeof viewUrls] ?? "";
          if (viewUrl === true) {
            for (const id of Object.keys(dict)) {
              urls.push(id);
            }
          } else if (viewUrl === false) {
            // Do nothing
          } else if (viewUrl.length > 0) {
            for (const id of Object.keys(dict)) {
              urls.push(`${viewUrl}${id}`);
            }
          }
        }
      }
    }
    return urls;
  };

  return {
    charts: toList(collectionDocument?.charts, collectionSequences?.charts),
    files: toList(collectionDocument?.files, collectionSequences?.files),
    hyperlinks: toList(collectionDocument?.hyperlinks, collectionSequences?.hyperlinks),
    steam: toList(collectionDocument?.steam, collectionSequences?.steam),
    youTubeRegularVideos: toList(collectionDocument?.youtube_regular, collectionSequences?.youtube_regular),
    youTubeShortVideos: toList(collectionDocument?.youtube_shorts, collectionSequences?.youtube_shorts),
    addCollections,
    addCollectionFiles,
    updateCollection,
    deleteCollection,
    getCollectionUrls
  };
};
