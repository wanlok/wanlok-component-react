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

export interface BookmarkDocument {
  youtube_regular: { [key: string]: YouTubeOEmbed };
  youtube_shorts: { [key: string]: YouTubeOEmbed };
}
