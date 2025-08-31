import { toList } from "../common/ListDictUtils";

export enum Direction {
  left = "left",
  right = "right"
}

export interface Folder {
  name: string;
  counts: CollectionCounts;
  sequences: CollectionSequences;
}

export interface ChartItem {
  chart: string;
  x: number[];
  y: number[];
}

export interface FileInfo {
  id?: string;
  name?: string;
  mime_type: string;
  reject_reason?: string;
}

export interface SteamInfo {
  title: string;
  imageUrl: string;
}

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

export interface Hyperlink {
  id: string;
  url: string;
}

export interface FolderDocument {
  folders: Folder[];
}

export interface CollectionDocument {
  charts: { [key: string]: ChartItem };
  files: { [key: string]: FileInfo };
  hyperlinks: { [key: string]: string };
  steam: { [key: string]: SteamInfo };
  youtube_regular: { [key: string]: YouTubeOEmbed };
  youtube_shorts: { [key: string]: YouTubeOEmbed };
}

export const isCollectionKey = (key: string): key is keyof CollectionDocument => {
  return ["charts", "files", "hyperlinks", "steam", "youtube_regular", "youtube_shorts"].includes(key);
};

export type CollectionCounts = {
  [key in keyof CollectionDocument]: number;
};

export const emptyCollectionCounts: CollectionCounts = {
  charts: 0,
  files: 0,
  hyperlinks: 0,
  steam: 0,
  youtube_regular: 0,
  youtube_shorts: 0
};

export const getCounts = (collectionDocument: CollectionDocument): CollectionCounts => {
  return {
    charts: toList(collectionDocument?.charts).length,
    files: toList(collectionDocument?.files).length,
    hyperlinks: toList(collectionDocument?.hyperlinks).length,
    steam: toList(collectionDocument?.steam).length,
    youtube_regular: toList(collectionDocument?.youtube_regular).length,
    youtube_shorts: toList(collectionDocument?.youtube_shorts).length
  };
};

export type CollectionSequences = {
  [key in keyof CollectionDocument]: string[];
};

export const emptyCollectionSequences: CollectionSequences = {
  charts: [],
  files: [],
  hyperlinks: [],
  steam: [],
  youtube_regular: [],
  youtube_shorts: []
};

export const serverUrl = "https://wanlok.ddns.net";

export const viewUrls = {
  files: `${serverUrl}/files/`,
  hyperlinks: true,
  steam: "https://store.steampowered.com/agecheck/app/",
  youtube_regular: "https://www.youtube.com/watch?v=",
  youtube_shorts: "https://www.youtube.com/shorts/"
};
