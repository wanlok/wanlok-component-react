export interface Counts {
  steam: number;
  youtube_regular: number;
  youtube_shorts: number;
}

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

export const isCollectionDocumentKey = (key: string): key is keyof CollectionDocument => {
  return ["charts", "steam", "youtube_regular", "youtube_shorts"].includes(key);
};

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
