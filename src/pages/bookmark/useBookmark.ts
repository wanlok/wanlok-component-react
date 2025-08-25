import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getSteam } from "../../common/Steam";
import { getYouTubeRegularAndShorts } from "../../common/YouTube";
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
    const fetchBookmarkDocument = async () => {
      if (documentId) {
        const docRef = doc(db, collectionName, documentId);
        setBookmarkDocument((await getDoc(docRef)).data() as BookmarkDocument | undefined);
      }
    };
    fetchBookmarkDocument();
  }, [documentId]);

  const addBookmarks = async (text: string) => {
    let counts: Counts | undefined = undefined;
    if (documentId) {
      const steam = await getSteam(text);
      const { youtube_regular, youtube_shorts } = await getYouTubeRegularAndShorts(text);
      const docRef = doc(db, collectionName, documentId);
      let document;
      if (bookmarkDocument) {
        document = {
          ...bookmarkDocument,
          steam: { ...bookmarkDocument.steam, ...steam },
          youtube_regular: { ...bookmarkDocument.youtube_regular, ...youtube_regular },
          youtube_shorts: { ...bookmarkDocument.youtube_shorts, ...youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = { steam, youtube_regular, youtube_shorts };
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
      if (type === "steam" || type === "youtube_regular" || type === "youtube_shorts") {
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
    steam: toList(bookmarkDocument?.steam),
    youTubeRegularVideos: toList(bookmarkDocument?.youtube_regular),
    youTubeShortVideos: toList(bookmarkDocument?.youtube_shorts),
    addBookmarks,
    deleteBookmark,
    getBookmarkUrls
  };
};
