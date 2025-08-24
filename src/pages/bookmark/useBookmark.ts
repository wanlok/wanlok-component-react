import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { getYouTubeDocument, regularUrl } from "../../common/YouTube";
import { BookmarkDocument } from "../../common/Bookmark";
import { isAllEmpty, toList } from "../../common/ListDictUtils";

const collectionName = "bookmarks";

export const useBookmark = (documentId?: string) => {
  const [youTubeDocument, setYouTubeDocument] = useState<BookmarkDocument>();

  useEffect(() => {
    const fetchBookmarkDocument = async () => {
      if (documentId) {
        const docRef = doc(db, collectionName, documentId);
        setYouTubeDocument((await getDoc(docRef)).data() as BookmarkDocument | undefined);
      }
    };
    fetchBookmarkDocument();
  }, [documentId]);

  const addBookmarks = async (text: string) => {
    if (documentId) {
      const newYouTubeDocument = await getYouTubeDocument(text);
      const docRef = doc(db, collectionName, documentId);
      let document;
      if (youTubeDocument) {
        document = {
          ...youTubeDocument,
          youtube_regular: { ...youTubeDocument.youtube_regular, ...newYouTubeDocument.youtube_regular },
          youtube_shorts: { ...youTubeDocument.youtube_shorts, ...newYouTubeDocument.youtube_shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = newYouTubeDocument;
        await setDoc(docRef, document);
      }
      setYouTubeDocument(document);
    }
  };

  const deleteBookmark = async (type: string, id: string) => {
    if (youTubeDocument && documentId) {
      const document: BookmarkDocument = { ...youTubeDocument };
      if (type === "youtube_regular" || type === "youtube_shorts") {
        delete document[type][id];
      }
      const docRef = doc(db, collectionName, documentId);
      if (isAllEmpty(document)) {
        await deleteDoc(docRef);
        setYouTubeDocument(undefined);
      } else {
        await updateDoc(docRef, { [`${type}.${id}`]: deleteField() });
        setYouTubeDocument(document);
      }
    }
  };

  const exportUrls = () => {
    const urls = [];
    if (youTubeDocument) {
      for (const [v] of Object.entries(youTubeDocument)) {
        urls.push(`${regularUrl}${v}`);
      }
    }
    const blob = new Blob([urls.join("\n")], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${documentId}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return {
    youTubeRegularVideos: toList(youTubeDocument?.youtube_regular),
    youTubeShortVideos: toList(youTubeDocument?.youtube_shorts),
    addBookmarks,
    deleteBookmark,
    exportUrls
  };
};
