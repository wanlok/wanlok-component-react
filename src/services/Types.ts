export enum Direction {
  left = "left",
  right = "right"
}

export interface Rect {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface ComponentFolder {
  id: string;
  name: string;
}

export interface Message {
  name: string;
  text: string;
  created_at: string;
}

export interface KanbanItem {
  id: string;
  name: string;
  content: string;
  created_at: string;
  messages: Message[];
}

export interface KanbanColumn {
  name: string;
  items: KanbanItem[];
}

export interface KanbanProject {
  id: string;
  name: string;
  columns: KanbanColumn[];
  created_at: string;
}

export interface Kanban {
  projects: KanbanProject[];
}

export interface Folder {
  name: string;
  attributes: CollectionAttributes;
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

interface ParentInfo {
  attributes?: { [key: string]: string };
}

export interface CloudinaryFileInfo extends ParentInfo {
  title: string;
  mime_type: string;
  url: string;
}

export interface SteamInfo {
  title: string;
  imageUrl: string;
}

export interface YouTubeInfo extends ParentInfo {
  title: string;
  imageUrl: string;
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
  files: { [key: string]: CloudinaryFileInfo };
  hyperlinks: { [key: string]: string };
  steam: { [key: string]: SteamInfo };
  youtube_regular: { [key: string]: YouTubeInfo };
  youtube_shorts: { [key: string]: YouTubeInfo };
}

export const isCollectionKey = (key: string): key is keyof CollectionDocument => {
  return ["charts", "files", "hyperlinks", "steam", "youtube_regular", "youtube_shorts"].includes(key);
};

export type Attributes = { [key: string]: string };

export type TypedAttributes = { [key: string]: number | string };

export type CollectionAttributes = { name: string; type: "text" | "number" }[];

export const emptyCollectionAttributes: CollectionAttributes = [];

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

export const regex = {
  HYPERLINK: /https?:\/\/[^\s"']+/g,
  STEAM: /https:\/\/store\.steampowered\.com\/[^\s]+/g,
  YOUTUBE:
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:(?:watch\?v=([\w-]{11})(?:[^\s]*)?)|(?:embed\/([\w-]{11})(?:[^\s]*)?)|(?:shorts\/([\w-]{11})(?:[^\s]*)?))|youtu\.be\/([\w-]{11})(?:[^\s]*)?)/g
};

export interface YakijujuDocument {
  scores: { [key: string]: number };
}
