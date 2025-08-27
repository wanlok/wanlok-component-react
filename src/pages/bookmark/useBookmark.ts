import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { extractChartItems } from "../../common/extractor/ChartExtractor";
import { extractSteamInfos } from "../../common/extractor/SteamInfoExtractor";
import { extractYouTubeRegularAndShortInfos } from "../../common/extractor/YouTubeInfoExtractor";
import { BookmarkDocument, Counts, viewUrls } from "../../common/Bookmark";
import { isAllEmpty, toList } from "../../common/ListDictUtils";

const collectionName = "bookmarks";

const getCounts = (bookmarkDocument: BookmarkDocument): Counts => {
  return {
    steam: toList(bookmarkDocument?.steam).length,
    youtube_regular: toList(bookmarkDocument?.youtube_regular).length,
    youtube_shorts: toList(bookmarkDocument?.youtube_shorts).length
  };
};

export const useBookmark = (documentId?: string) => {
  const [bookmarkDocument, setBookmarkDocument] = useState<BookmarkDocument>();

  useEffect(() => {
    fetchBookmarkDocument(documentId);
  }, [documentId]);

  const fetchBookmarkDocument = async (id?: string) => {
    if (id) {
      const docRef = doc(db, collectionName, id);
      setBookmarkDocument((await getDoc(docRef)).data() as BookmarkDocument | undefined);
    }
  };

  const addBookmarks = async (bookmarkId: string, text: string) => {
    let counts: Counts | undefined = undefined;
    if (bookmarkId && text) {
      const { charts } = extractChartItems(text);
      const { steam } = await extractSteamInfos(text);
      const { youtube_regular, youtube_shorts } = await extractYouTubeRegularAndShortInfos(text);
      const docRef = doc(db, collectionName, bookmarkId);
      let document;
      if (bookmarkDocument) {
        document = {
          ...bookmarkDocument,
          charts: { ...bookmarkDocument.charts, ...charts },
          steam: { ...bookmarkDocument.steam, ...steam },
          youtube_regular: { ...bookmarkDocument.youtube_regular, ...youtube_regular },
          youtube_shorts: { ...bookmarkDocument.youtube_shorts, ...youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = { charts, steam, youtube_regular, youtube_shorts };
        await setDoc(docRef, document);
      }
      setBookmarkDocument(document);
      counts = getCounts(document);
    }
    return counts;
  };

  const deleteBookmark = async (type: string, id: string) => {
    let counts: Counts | undefined = undefined;
    if (bookmarkDocument && documentId) {
      const document: BookmarkDocument = { ...bookmarkDocument };
      if (type === "charts" || type === "steam" || type === "youtube_regular" || type === "youtube_shorts") {
        delete document[type][id];
      }
      const docRef = doc(db, collectionName, documentId);
      if (isAllEmpty(document)) {
        await deleteDoc(docRef);
        setBookmarkDocument(undefined);
      } else {
        await updateDoc(docRef, { [`${type}.${id}`]: deleteField() });
        setBookmarkDocument(document);
      }
      counts = getCounts(document);
    }
    return counts;
  };

  const getBookmarkUrls = async (id?: string) => {
    const urls: string[] = [];
    if (id) {
      const docRef = doc(db, collectionName, id);
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
    }
    return urls;
  };

  return {
    charts: toList(bookmarkDocument?.charts),
    steam: toList(bookmarkDocument?.steam),
    youTubeRegularVideos: toList(bookmarkDocument?.youtube_regular),
    youTubeShortVideos: toList(bookmarkDocument?.youtube_shorts),
    fetchBookmarkDocument,
    addBookmarks,
    deleteBookmark,
    getBookmarkUrls
  };
};
