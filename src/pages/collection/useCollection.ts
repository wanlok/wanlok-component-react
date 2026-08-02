import { useEffect, useRef, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, FieldPath, getDoc, setDoc, updateDoc } from "firebase/firestore";
import {
  CollectionDocument,
  CollectionAttributes,
  CollectionCounts,
  isCollectionKey,
  viewUrls,
  CollectionSequences,
  Direction,
  TextRegion
} from "../../services/Types";
import { appendSequences, isAllEmpty, toList } from "../../common/ListDictUtils";
import { getFiles } from "../../common/FileUtils";
import { getChartItems } from "../../services/ChartService";
import { getSteamInfos } from "../../services/SteamService";
import { getYouTubeRegularAndShortInfos } from "../../services/YouTubeService";
import { uploadAndGetFileInfos, uploadImageBlobs } from "../../services/FileService";
import { convertPdfToImageBlobs } from "../../utils/convertPdfToImageBlobs";
import { getHyperlinks } from "../../services/HyperlinkService";
import { getCounts } from "../../common/CountUtils";

const collectionName = "collections";

export const useCollection = (
  documentId?: string,
  collectionSequences?: CollectionSequences,
  updateFolder?: (params: {
    counts?: CollectionCounts;
    sequences?: Partial<CollectionSequences>;
    attributes?: CollectionAttributes;
  }) => void
) => {
  const [collectionDocument, setCollectionDocument] = useState<CollectionDocument | null | undefined>(undefined);
  const collectionDocumentRef = useRef<CollectionDocument | null | undefined>(undefined);
  const [loadingCount, setLoadingCount] = useState(0);
  const syncedDocumentIdRef = useRef<string | undefined>(undefined);
  const uploadQueueRef = useRef<Promise<void>>(Promise.resolve());

  const setCollectionDocumentAndRef = (document: CollectionDocument | null | undefined) => {
    collectionDocumentRef.current = document;
    setCollectionDocument(document);
  };

  useEffect(() => {
    syncedDocumentIdRef.current = documentId;
    if (documentId) {
      setCollectionDocumentAndRef(null);
      const fetchCollectionDocument = async () => {
        const docRef = doc(db, collectionName, documentId);
        setCollectionDocumentAndRef((await getDoc(docRef)).data() as CollectionDocument | undefined);
      };
      fetchCollectionDocument();
    } else {
      setCollectionDocumentAndRef(undefined);
    }
  }, [documentId]);

  const addCollectionItems = async (collectionId: string, text: string) => {
    let counts: CollectionCounts | undefined = undefined;
    if (collectionId && text) {
      const { charts } = getChartItems(text);
      const { steam } = await getSteamInfos(text);
      const { youtube_regular, youtube_shorts } = await getYouTubeRegularAndShortInfos(text);
      const { hyperlinks } = await getHyperlinks(text);
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
      setCollectionDocumentAndRef(document);
      counts = getCounts(document);
    }
    return counts;
  };

  const addCollectionFiles = async (collectionId: string) => {
    const files = await getFiles();
    if (files.length === 0) {
      return undefined;
    }
    const file = files[0];
    let pdfPages: { name: string; blob: Blob }[] | undefined;
    if (file.type === "application/pdf") {
      pdfPages = await convertPdfToImageBlobs(file);
      if (pdfPages.length === 0) {
        return undefined;
      }
    }
    const pendingCount = pdfPages ? pdfPages.length : 1;
    setLoadingCount((prev) => prev + pendingCount);
    return new Promise<{ counts: CollectionCounts; sequences?: string[]; attributes?: CollectionAttributes }>(
      (resolve) => {
        uploadQueueRef.current = uploadQueueRef.current.then(async () => {
          const rawFileInfos = pdfPages ? await uploadImageBlobs(pdfPages) : await uploadAndGetFileInfos(files);
          const fileInfos = pdfPages
            ? Object.fromEntries(
                Object.entries(rawFileInfos).map(([id, info], i) => [
                  id,
                  { ...info, name: `Page ${i + 1}`, attributes: { File: file.name } }
                ])
              )
            : rawFileInfos;
          setLoadingCount((prev) => prev - pendingCount);
          const docRef = doc(db, collectionName, collectionId);
          let document;
          const current = collectionDocumentRef.current;
          if (current) {
            document = {
              ...current,
              files: { ...current.files, ...fileInfos }
            };
            await updateDoc(docRef, document);
          } else {
            document = {
              charts: {},
              files: fileInfos,
              hyperlinks: {},
              steam: {},
              youtube_regular: {},
              youtube_shorts: {}
            };
            await setDoc(docRef, document);
          }
          setCollectionDocumentAndRef(document);
          const counts = getCounts(document);
          const sequences = pdfPages
            ? appendSequences(
                collectionSequences?.files ?? [],
                Object.keys(current?.files ?? {}),
                Object.keys(fileInfos)
              )
            : undefined;
          resolve({ counts, sequences, attributes: pdfPages ? [{ name: "File", type: "text" }] : undefined });
        });
      }
    );
  };

  const renameCollectionAttributeKey = async (oldKey: string, newKey: string) => {
    if (!collectionDocument || !documentId) {
      return;
    }
    const renameItemKey = <T extends { attributes?: { [key: string]: string } }>(item: T): T => {
      if (!item.attributes?.[oldKey]) {
        return item;
      }
      const { [oldKey]: value, ...rest } = item.attributes;
      return { ...item, attributes: { ...rest, [newKey]: value } };
    };
    const newCollectionDocument = {
      ...collectionDocument,
      files: Object.fromEntries(
        Object.entries(collectionDocument.files).map(([id, item]) => [id, renameItemKey(item)])
      ),
      youtube_regular: Object.fromEntries(
        Object.entries(collectionDocument.youtube_regular).map(([id, item]) => [id, renameItemKey(item)])
      ),
      youtube_shorts: Object.fromEntries(
        Object.entries(collectionDocument.youtube_shorts).map(([id, item]) => [id, renameItemKey(item)])
      )
    };
    const docRef = doc(db, collectionName, documentId);
    await updateDoc(docRef, newCollectionDocument);
    setCollectionDocumentAndRef(newCollectionDocument);
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
        updateFolder?.({ sequences: { [type]: sequences } });
      } else if (direction === Direction.right && index < sequences.length - 1) {
        const temp = sequences[index];
        sequences[index] = sequences[index + 1];
        sequences[index + 1] = temp;
        updateFolder?.({ sequences: { [type]: sequences } });
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
        setCollectionDocumentAndRef(undefined);
      } else {
        await updateDoc(docRef, new FieldPath(type, id), deleteField());
        setCollectionDocumentAndRef(document);
      }
      counts = getCounts(document);
    }
    return counts;
  };

  const updateCollectionFile = async (
    id: string,
    name: string,
    attributes: { [key: string]: string },
    layout: string,
    textRegions: TextRegion[]
  ) => {
    if (collectionDocument && documentId) {
      const newCollectionDocument = {
        ...collectionDocument,
        files: {
          ...collectionDocument.files,
          [id]: { ...collectionDocument.files[id], name, attributes, layout, textRegions }
        }
      };
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, newCollectionDocument);
      setCollectionDocumentAndRef(newCollectionDocument);
    }
  };

  const updateCollectionVideo = async (
    type: "youtube_regular" | "youtube_shorts",
    id: string,
    name: string,
    attributes: { [key: string]: string }
  ) => {
    if (collectionDocument && documentId) {
      const newCollectionDocument = {
        ...collectionDocument,
        [type]: { ...collectionDocument[type], [id]: { ...collectionDocument[type][id], name, attributes } }
      };
      const docRef = doc(db, collectionName, documentId);
      await updateDoc(docRef, newCollectionDocument);
      setCollectionDocumentAndRef(newCollectionDocument);
    }
  };

  const addCollectionBlob = async (collectionId: string, blob: Blob, name: string) => {
    setLoadingCount((prev) => prev + 1);
    return new Promise<CollectionCounts>((resolve) => {
      uploadQueueRef.current = uploadQueueRef.current.then(async () => {
        const fileInfos = await uploadImageBlobs([{ name, blob }]);
        setLoadingCount((prev) => prev - 1);
        const docRef = doc(db, collectionName, collectionId);
        let document;
        const current = collectionDocumentRef.current;
        if (current) {
          document = { ...current, files: { ...current.files, ...fileInfos } };
          await updateDoc(docRef, document);
        } else {
          document = {
            charts: {},
            files: fileInfos,
            hyperlinks: {},
            steam: {},
            youtube_regular: {},
            youtube_shorts: {}
          };
          await setDoc(docRef, document);
        }
        setCollectionDocumentAndRef(document);
        resolve(getCounts(document));
      });
    });
  };

  const deleteCollection = async (collectionId: string) => {
    const docRef = doc(db, collectionName, collectionId);
    deleteDoc(docRef);
  };

  const renameCollection = async (newId: string) => {
    if (collectionDocumentRef.current && documentId) {
      await setDoc(doc(db, collectionName, newId), collectionDocumentRef.current);
      await deleteDoc(doc(db, collectionName, documentId));
    }
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
    isLoading: syncedDocumentIdRef.current !== documentId || collectionDocument === null,
    loadingCount,
    charts: toList(collectionDocument?.charts, collectionSequences?.charts),
    files: toList(collectionDocument?.files, collectionSequences?.files),
    hyperlinks: toList(collectionDocument?.hyperlinks, collectionSequences?.hyperlinks),
    steam: toList(collectionDocument?.steam, collectionSequences?.steam),
    youTubeRegularVideos: toList(collectionDocument?.youtube_regular, collectionSequences?.youtube_regular),
    youTubeShortVideos: toList(collectionDocument?.youtube_shorts, collectionSequences?.youtube_shorts),
    addCollectionItems,
    addCollectionFiles,
    renameCollectionAttributeKey,
    updateCollectionSequences,
    updateCollectionFile,
    updateCollectionVideo,
    addCollectionBlob,
    deleteCollection,
    renameCollection,
    deleteCollectionItem,
    getCollectionUrls
  };
};
