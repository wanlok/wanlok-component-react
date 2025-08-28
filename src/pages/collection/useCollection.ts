import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { extractChartItems } from "../../common/extractor/ChartExtractor";
import { extractSteamInfos } from "../../common/extractor/SteamInfoExtractor";
import { extractYouTubeRegularAndShortInfos } from "../../common/extractor/YouTubeInfoExtractor";
import { CollectionDocument, CollectionCounts, isCollectionKey, viewUrls } from "../../common/WCollection";
import { isAllEmpty, toList } from "../../common/ListDictUtils";

const collectionName = "collections";

const getCounts = (collectionDocument: CollectionDocument): CollectionCounts => {
  return {
    charts: toList(collectionDocument?.charts).length,
    steam: toList(collectionDocument?.steam).length,
    youtube_regular: toList(collectionDocument?.youtube_regular).length,
    youtube_shorts: toList(collectionDocument?.youtube_shorts).length
  };
};

export const useCollection = (
  documentId?: string,
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
      const { charts } = extractChartItems(text);
      const { steam } = await extractSteamInfos(text);
      const { youtube_regular, youtube_shorts } = await extractYouTubeRegularAndShortInfos(text);
      const docRef = doc(db, collectionName, collectionId);
      let document;
      if (collectionDocument) {
        document = {
          ...collectionDocument,
          charts: { ...collectionDocument.charts, ...charts },
          steam: { ...collectionDocument.steam, ...steam },
          youtube_regular: { ...collectionDocument.youtube_regular, ...youtube_regular },
          youtube_shorts: { ...collectionDocument.youtube_shorts, ...youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = { charts, steam, youtube_regular, youtube_shorts };
        await setDoc(docRef, document);
      }
      setCollectionDocument(document);
      counts = getCounts(document);
    }
    return counts;
  };

  const updateCollection = async (type: string, id: string, direction: string) => {
    if (collectionDocument && isCollectionKey(type)) {
      const sequences = Object.entries(collectionDocument[type]).map(([key]) => key);
      const index = sequences.findIndex((item) => item === id);
      if (direction === "left" && index < sequences.length - 1) {
        const temp = sequences[index];
        sequences[index] = sequences[index + 1];
        sequences[index + 1] = temp;
      } else if (direction === "right" && index > 0) {
        const temp = sequences[index];
        sequences[index] = sequences[index - 1];
        sequences[index - 1] = temp;
      }
      updateFolderSequences?.(type, sequences);
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
        await updateDoc(docRef, { [`${type}.${id}`]: deleteField() });
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
          if (viewUrl.length > 0) {
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
    charts: toList(collectionDocument?.charts),
    steam: toList(collectionDocument?.steam),
    youTubeRegularVideos: toList(collectionDocument?.youtube_regular),
    youTubeShortVideos: toList(collectionDocument?.youtube_shorts),
    addCollections,
    updateCollection,
    deleteCollection,
    getCollectionUrls
  };
};
