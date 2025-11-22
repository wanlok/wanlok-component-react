import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, FieldPath, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  CollectionDocument,
  CollectionCounts,
  isCollectionKey,
  viewUrls,
  CollectionSequences,
  Direction
} from "../../services/Types";
import { isAllEmpty, toList } from "../../common/ListDictUtils";
import { getFiles } from "../../common/FileUtils";
import { getChartItems } from "../../services/ChartService";
import { getSteamInfos } from "../../services/SteamService";
import { getYouTubeRegularAndShortInfos } from "../../services/YouTubeService";
import { uploadAndGetFileInfos } from "../../services/ImageService";
import { getHyperlinks } from "../../services/HyperlinkService";
import { getTexts } from "../../services/TextService";
import { getCounts } from "../../common/CountUtils";

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

  const addCollectionItems = async (collectionId: string, text: string) => {
    let counts: CollectionCounts | undefined = undefined;
    if (collectionId && text) {
      const { charts } = getChartItems(text);
      const { steam } = await getSteamInfos(text);
      const { youtube_regular, youtube_shorts } = await getYouTubeRegularAndShortInfos(text);
      const { hyperlinks } = await getHyperlinks(text);
      const { texts } = await getTexts(text);
      const docRef = doc(db, collectionName, collectionId);
      let document;
      if (collectionDocument) {
        document = {
          ...collectionDocument,
          charts: { ...collectionDocument.charts, ...charts },
          files: { ...collectionDocument.files },
          hyperlinks: { ...collectionDocument.hyperlinks, ...hyperlinks },
          steam: { ...collectionDocument.steam, ...steam },
          texts: { ...collectionDocument.texts, ...texts },
          youtube_regular: { ...collectionDocument.youtube_regular, ...youtube_regular },
          youtube_shorts: { ...collectionDocument.youtube_shorts, ...youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = { charts, files: {}, hyperlinks, steam, texts, youtube_regular, youtube_shorts };
        await setDoc(docRef, document);
      }
      setCollectionDocument(document);
      counts = getCounts(document);
    }
    return counts;
  };

  const addCollectionFiles = async (collectionId: string) => {
    let counts: CollectionCounts | undefined = undefined;
    let files = await getFiles();
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
      document = {
        charts: {},
        files: fileInfos,
        hyperlinks: {},
        steam: {},
        texts: {},
        youtube_regular: {},
        youtube_shorts: {}
      };
      await setDoc(docRef, document);
    }
    setCollectionDocument(document);
    counts = getCounts(document);
    return counts;
  };

  const updateCollectionAttributes = async (
    type: string,
    id: string,
    attributes: {
      [key: string]: string;
    }
  ) => {
    if (collectionDocument && isCollectionKey(type)) {
      if (type === "files") {
        let newCollectionDocument = { ...collectionDocument };
        newCollectionDocument.files[id] = {
          ...collectionDocument.files[id],
          attributes
        };
        const docRef = doc(db, collectionName, documentId!);
        await updateDoc(docRef, newCollectionDocument);
        setCollectionDocument(newCollectionDocument);
      }
    }
  };

  const updateCollectionSequences = async (type: string, id: string, direction: Direction) => {
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

  const deleteCollectionItem = async (type: string, id: string) => {
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

  const deleteCollection = async (collectionId: string) => {
    const docRef = doc(db, collectionName, collectionId);
    deleteDoc(docRef);
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
    texts: toList(collectionDocument?.texts, collectionSequences?.texts),
    youTubeRegularVideos: toList(collectionDocument?.youtube_regular, collectionSequences?.youtube_regular),
    youTubeShortVideos: toList(collectionDocument?.youtube_shorts, collectionSequences?.youtube_shorts),
    addCollectionItems,
    addCollectionFiles,
    updateCollectionAttributes,
    updateCollectionSequences,
    deleteCollection,
    deleteCollectionItem,
    getCollectionUrls
  };
};
