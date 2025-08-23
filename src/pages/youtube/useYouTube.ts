import { useEffect, useState } from "react";
import { db } from "../../firebase";
import { doc, onSnapshot, setDoc, updateDoc } from "firebase/firestore";

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
  [key: string]: YouTubeOEmbed;
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

function extractYouTubeUrlStrings(text: string): string[] {
  const matches = text.match(
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:watch\?v=[\w-]{11}|embed\/[\w-]{11})|youtu\.be\/[\w-]{11})(?:[^\s]*)?/g
  );
  return matches ?? [];
}

function extractYouTubeUrlStringV(urlString: string): string | null {
  const match = urlString.match(/(?:v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

export const useYouTube = (folderName?: string) => {
  const [youTubeDocument, setYouTubeDocument] = useState<YouTubeDocument>();

  const documentId = folderName?.toLowerCase().replace(/\s+/g, "-");

  useEffect(() => {
    if (documentId) {
      const docRef = doc(db, collectionName, documentId);
      const unsubscribe = onSnapshot(docRef, (snapshot) => {
        setYouTubeDocument(snapshot.data() as YouTubeDocument);
      });
      return () => unsubscribe();
    }
  }, [documentId]);

  const add = async (text: string) => {
    if (documentId) {
      const urlStrings = extractYouTubeUrlStrings(text);
      const entries = (
        await Promise.all(
          urlStrings.map(async (urlString) => {
            const key = extractYouTubeUrlStringV(urlString);
            const value = await fetchYouTubeOEmbed(urlString);
            return key && value ? [key, value] : null;
          })
        )
      ).filter(Boolean) as [string, YouTubeOEmbed][];
      if (entries.length > 0) {
        const dict = Object.fromEntries(entries);
        const docRef = doc(db, collectionName, documentId);
        if (youTubeDocument) {
          await updateDoc(docRef, {
            ...youTubeDocument,
            ...dict
          });
        } else {
          await setDoc(docRef, dict);
        }
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
    a.download = "export.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return { document: youTubeDocument, add, exportUrls };
};
