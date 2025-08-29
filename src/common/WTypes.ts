export interface ChartItem {
  chart: string;
  x: number[];
  y: number[];
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

export const isCollectionKey = (key: string): key is keyof CollectionDocument => {
  return ["charts", "steam", "youtube_regular", "youtube_shorts"].includes(key);
};

export type CollectionCounts = {
  [key in keyof CollectionDocument]: number;
};

export const emptyCollectionCounts: CollectionCounts = { charts: 0, steam: 0, youtube_regular: 0, youtube_shorts: 0 };

export type CollectionSequences = {
  [key in keyof CollectionDocument]: string[];
};

export const emptyCollectionSequences: CollectionSequences = {
  charts: [],
  steam: [],
  youtube_regular: [],
  youtube_shorts: []
};

export interface Folder {
  name: string;
  counts: CollectionCounts;
  sequences: CollectionSequences;
}

export interface FolderDocument {
  folders: Folder[];
}

export interface CollectionDocument {
  charts: { [key: string]: ChartItem };
  steam: { [key: string]: SteamInfo };
  youtube_regular: { [key: string]: YouTubeOEmbed };
  youtube_shorts: { [key: string]: YouTubeOEmbed };
}

export const viewUrls = {
  steam: "https://store.steampowered.com/agecheck/app/",
  youtube_regular: "https://www.youtube.com/watch?v=",
  youtube_shorts: "https://www.youtube.com/shorts/"
};
