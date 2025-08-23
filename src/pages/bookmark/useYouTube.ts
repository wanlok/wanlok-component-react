import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { deleteDoc, deleteField, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";

const collectionName = "youtube";

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
  regular: { [key: string]: YouTubeOEmbed };
  shorts: { [key: string]: YouTubeOEmbed };
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
      type = "shorts";
    } else {
      id = watchId ?? embedId ?? shareId;
      type = "regular";
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
    regular: {},
    shorts: {}
  };

  for (const { id, type, value } of results) {
    if (type === "regular" || type === "shorts") {
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
      console.log(collectionName, documentId);
      const docRef = doc(db, collectionName, documentId);
      let document;
      if (youTubeDocument) {
        document = {
          ...youTubeDocument,
          regular: { ...youTubeDocument.regular, ...newYouTubeDocument.regular },
          shorts: { ...youTubeDocument.shorts, ...newYouTubeDocument.shorts }
        };
        await updateDoc(docRef, document);
      } else {
        document = newYouTubeDocument;
        await setDoc(docRef, document);
      }
      setYouTubeDocument(document);
    }
  };

  const deleteVideo = async (v: string) => {
    if (youTubeDocument && documentId) {
      const document = { ...youTubeDocument.regular };
      delete document[v];
      const docRef = doc(db, collectionName, documentId);
      if (Object.keys(document).length === 0) {
        await deleteDoc(docRef);
      } else {
        await updateDoc(docRef, { [`regular.${v}`]: deleteField() });
      }
      setYouTubeDocument({
        regular: document,
        shorts: youTubeDocument.shorts
      });
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

  return { document: youTubeDocument?.regular, add, deleteVideo, exportUrls };
};
