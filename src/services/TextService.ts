import { extractUrlStrings } from "../common/StringUtils";
import { regex, TextItem } from "./Types";
import { v4 as uuidv4 } from "uuid";

export const getTexts = async (text: string) => {
  const texts: { [key: string]: TextItem } = {};

  let value = text;

  const urlStrings = [
    ...extractUrlStrings(text, regex.STEAM),
    ...extractUrlStrings(text, regex.YOUTUBE),
    ...extractUrlStrings(text, regex.HYPERLINK)
  ];

  urlStrings.forEach((url) => {
    const escaped = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    value = value.replace(new RegExp(escaped, "g"), "");
  });

  if (value.length > 0) {
    texts[uuidv4()] = { value };
  }

  return { texts };
};
