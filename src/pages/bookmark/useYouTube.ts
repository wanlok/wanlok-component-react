import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const collectionName = "bookmarks";

export interface YouTubeOEmbed {
  title: string;
  author_name: string;
  author_url: string;
  thumbnail_url: string;
  thumbnail_width: number;
  thumbnail_height: number;
  html: string;
  width: number;
  height: number;
}

export interface YouTubeDocument {
  youtube_regular: { [key: string]: YouTubeOEmbed };
  youtube_shorts: { [key: string]: YouTubeOEmbed };
}

export const youTubeUrl = "https://www.youtube.com/watch?v=";

const fetchYouTubeOEmbed = async (urlString: string) => {
  let youTubeOEmbed: YouTubeOEmbed | undefined = undefined;
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlString)}&format=json`);
    if (response.ok) {
      youTubeOEmbed = (await response.json()) as YouTubeOEmbed;
    }
  } catch (e) {}
  return youTubeOEmbed;
};

function extractYouTubeInfo(text: string): { urlString: string; id: string; type: string }[] {
  const regex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:(?:watch\?v=([\w-]{11}))|(?:embed\/([\w-]{11}))|(?:shorts\/([\w-]{11})))|youtu\.be\/([\w-]{11}))/g;

  const matches: { urlString: string; id: string; type: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [urlString, watchId, embedId, shortsId, shareId] = match;

    let id: string | undefined;
    let type: string;

    if (shortsId) {
      id = shortsId;
      type = "youtube_shorts";
    } else {
      id = watchId ?? embedId ?? shareId;
      type = "youtube_regular";
    }

    if (id) {
      matches.push({ urlString, id, type });
    }
  }

  return matches;
}

const getYouTubeDocument = async (text: string) => {
  const list = extractYouTubeInfo(text);

  const results = (
    await Promise.all(
      list.map(async ({ urlString, id, type }) => {
        const value = await fetchYouTubeOEmbed(urlString);
        return value ? { id, type, value } : null;
      })
    )
  ).filter(Boolean) as { id: string; type: string; value: YouTubeOEmbed }[];

  const youTubeDocument: YouTubeDocument = {
    youtube_regular: {},
    youtube_shorts: {}
  };

  for (const { id, type, value } of results) {
    if (type === "youtube_regular" || type === "youtube_shorts") {
      youTubeDocument[type][id] = value;
    }
  }

  return youTubeDocument;
};

export const useYouTube = (documentId?: string) => {
  const [youTubeDocument, setYouTubeDocument] = useState<YouTubeDocument>();

  useEffect(() => {
    const fetchYouTubeDocument = async () => {
      if (documentId) {
        const docRef = doc(db, collectionName, documentId);
        setYouTubeDocument((await getDoc(docRef)).data() as YouTubeDocument | undefined);
      }
    };
    fetchYouTubeDocument();
  }, [documentId]);

  const add = async (text: string) => {
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

  const deleteVideo = async (type: string, id: string) => {
    if (youTubeDocument && documentId) {
      const newYouTubeDocument: YouTubeDocument = { ...youTubeDocument };
      if (type === "youtube_regular" || type === "youtube_shorts") {
        delete newYouTubeDocument[type][id];
      }
      const isAllEmpty = Object.values(newYouTubeDocument).every(
        (value) => typeof value === "object" && value !== null && Object.keys(value).length === 0
      );
      const docRef = doc(db, collectionName, documentId);
      if (isAllEmpty) {
        await deleteDoc(docRef);
        setYouTubeDocument(undefined);
      } else {
        await updateDoc(docRef, { [`${type}.${id}`]: deleteField() });
        setYouTubeDocument(newYouTubeDocument);
      }
    }
  };

  const exportUrls = () => {
    const urls = [];
    if (youTubeDocument) {
      for (const [v] of Object.entries(youTubeDocument)) {
        urls.push(`${youTubeUrl}${v}`);
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

  return { document: youTubeDocument?.youtube_regular, add, deleteVideo, exportUrls };
};
