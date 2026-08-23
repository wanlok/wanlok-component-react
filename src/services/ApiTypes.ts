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

export type QuizContent = { type: "text" | "image"; value: string };

export type Question = { content: QuizContent[]; answers: { content: QuizContent[]; correct: boolean }[] };

export interface Quiz {
  label: string;
  value: string;
}

export interface QuizzesDocument {
  quizzes: Quiz[];
}
