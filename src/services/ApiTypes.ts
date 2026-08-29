export const apiUrl = "https://component.wanlok.workers.dev/api";

export type ApiResponse<T> = { status: string; data: T };

export interface CollectionCounts {
  chart: number;
  file: number;
  hyperlink: number;
  image: number;
  pdf: number;
  quiz: number;
  region: number;
  steam: number;
  video: number;
  youTubeRegular: number;
  youTubeShort: number;
}

export interface Collection {
  name: string;
  counts: CollectionCounts;
}

export interface RegionPoint {
  x: number;
  y: number;
}

export interface Region {
  points: RegionPoint[];
  text?: string;
}

export type QuizContent = { type: "text" | "image"; value: string };

export type Question = { content: QuizContent[]; answers: { content: QuizContent[]; correct: boolean }[] };

export interface CollectionItem {
  name: string;
  url: string;
  regions?: Region[];
  questions?: Question[];
}

export const CURRENCY_CODES = ["aud", "hkd"] as const;

export type CurrencyCode = (typeof CURRENCY_CODES)[number];

export type GameEntry = {
  id: string;
  type?: "titles" | "bundles";
  prices: { datetime: string; price: number }[];
};

export type Game = Partial<Record<CurrencyCode, GameEntry>>;

export const PLATFORMS = ["nintendo", "steam"] as const;

export type Platform = (typeof PLATFORMS)[number];

export type Games = Record<Platform, Record<string, Game>>;

export const GAME_URL_PREFIXES: Record<Platform, Partial<Record<CurrencyCode, string>>> = {
  steam: {
    aud: "https://store.steampowered.com/app/",
    hkd: "https://store.steampowered.com/app/"
  },
  nintendo: {
    aud: "https://ec.nintendo.com/AU/en/",
    hkd: "https://store.nintendo.com.hk/"
  }
};
