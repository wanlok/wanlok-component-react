import { v4 } from "uuid";
import { ChartItem } from "../common/WTypes";

const isChartItem = (jsonObject: any): boolean => {
  return (
    jsonObject &&
    typeof jsonObject === "object" &&
    typeof jsonObject.chart === "string" &&
    Array.isArray(jsonObject.x) &&
    jsonObject.x.every((i: any) => typeof i === "number") &&
    Array.isArray(jsonObject.y) &&
    jsonObject.y.every((i: any) => typeof i === "number")
  );
};

export const extractChartItems = (text: string) => {
  const charts: { [key: string]: ChartItem } = {};

  const regex = /{[^{}]*}/g;

  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    try {
      const jsonObject = JSON.parse(match[0]);
      if (isChartItem(jsonObject)) {
        charts[v4()] = jsonObject;
      }
    } catch {}
  }

  return { charts };
};
