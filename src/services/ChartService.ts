import { v4 } from "uuid";
import { ChartItem } from "./Types";

const isChartItem = (jsonObject: unknown): jsonObject is ChartItem => {
  if (!jsonObject || typeof jsonObject !== "object") {
    return false;
  }
  const candidate = jsonObject as Record<string, unknown>;
  return (
    typeof candidate.chart === "string" &&
    Array.isArray(candidate.x) &&
    candidate.x.every((i: unknown) => typeof i === "number") &&
    Array.isArray(candidate.y) &&
    candidate.y.every((i: unknown) => typeof i === "number")
  );
};

export const getChartItems = (text: string) => {
  const charts: { [key: string]: ChartItem } = {};

  const regex = /{[^{}]*}/g;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    try {
      const jsonObject = JSON.parse(match[0]);
      if (isChartItem(jsonObject)) {
        charts[v4()] = jsonObject;
      }
    } catch {
      // ignore chunks that aren't valid JSON
    }
  }

  return { charts };
};
