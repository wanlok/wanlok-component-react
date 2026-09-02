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

export interface RegionPoint {
  x: number;
  y: number;
}

export interface ComponentFolder {
  id: string;
  name: string;
}

export interface Message {
  name: string;
  text: string;
  createdAt: string;
}

export interface KanbanItem {
  id: string;
  name: string;
  content: string;
  createdAt: string;
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
  createdAt: string;
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

interface ParentInfo {
  attributes?: { [key: string]: string };
}

export interface Region {
  points: RegionPoint[];
  recogniseLanguage?: string;
  text?: string;
  translateLanguage?: string;
  translatedText?: string;
  type?: "question" | "answers";
  delimiter?: string;
  correctAnswerIndices?: number[];
}

export interface CloudinaryFileInfo extends ParentInfo {
  name: string;
  mimeType: string;
  url: string;
  layout?: string;
  regions?: Region[];
  previewAlignment?: string;
}

export type ImageMeta = { width: number; height: number; type: string };

export interface YouTubeInfo extends ParentInfo {
  name: string;
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
  youtubeRegular: { [key: string]: YouTubeInfo };
  youtubeShorts: { [key: string]: YouTubeInfo };
}

export const isCollectionKey = (key: string): key is keyof CollectionDocument => {
  return ["charts", "files", "hyperlinks", "youtubeRegular", "youtubeShorts"].includes(key);
};

export type Attributes = { [key: string]: string };

export type TypedAttributes = { [key: string]: number | string };

export type CollectionAttributes = { name: string; type: "text" | "number"; visible?: boolean }[];

export const emptyCollectionAttributes: CollectionAttributes = [];

export type CollectionCounts = {
  chart: number;
  file: number;
  hyperlink: number;
  image: number;
  pdf: number;
  quiz: number;
  region: number;
  video: number;
  youTubeRegular: number;
  youTubeShort: number;
};

export const emptyCollectionCounts: CollectionCounts = {
  chart: 0,
  file: 0,
  hyperlink: 0,
  image: 0,
  pdf: 0,
  quiz: 0,
  region: 0,
  video: 0,
  youTubeRegular: 0,
  youTubeShort: 0
};

export type CollectionSequences = {
  [key in keyof CollectionDocument]: string[];
};

export const emptyCollectionSequences: CollectionSequences = {
  charts: [],
  files: [],
  hyperlinks: [],
  youtubeRegular: [],
  youtubeShorts: []
};

export const serverUrl = "https://wanlok.ddns.net";

export const viewUrls = {
  files: `${serverUrl}/files/`,
  hyperlinks: true,
  youtubeRegular: "https://www.youtube.com/watch?v=",
  youtubeShorts: "https://www.youtube.com/shorts/"
};

export const regex = {
  HYPERLINK: /https?:\/\/[^\s"']+/g,
  YOUTUBE:
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:(?:watch\?v=([\w-]{11})(?:[^\s]*)?)|(?:embed\/([\w-]{11})(?:[^\s]*)?)|(?:shorts\/([\w-]{11})(?:[^\s]*)?))|youtu\.be\/([\w-]{11})(?:[^\s]*)?)/g,
  QUESTION_NUMBER: /^\s*(?:Q\s*)?(?:\d+|[A-Za-z])[.):]\s*/i
};

export interface YakijujuDocument {
  scores: { [key: string]: number };
}
