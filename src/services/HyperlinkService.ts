import { Hyperlink } from "./Types";

const submitHyperlinks = async (urls: string[]) => {
  const response = await fetch("https://wanlok.ddns.net/save-screenshot", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ urls })
  });
  let data: Hyperlink[];
  if (response.ok) {
    data = (await response.json()) as Hyperlink[];
  } else {
    data = [];
  }
  return data;
};

export const extractUrlStrings = (text: string, shouldExtract: boolean): string[] => {
  let hyperlinks: string[];
  if (shouldExtract) {
    const regex = /https?:\/\/[^\s"']+/g;
    hyperlinks = text.match(regex) ?? [];
  } else {
    hyperlinks = [];
  }
  return hyperlinks;
};

export const getHyperlinks = async (text: string, list: { [key: string]: any }[]) => {
  let hyperlinks: { [key: string]: string } = {};
  const urlStrings = extractUrlStrings(
    text,
    list.every((obj) => Object.keys(obj).length === 0)
  );
  if (urlStrings.length > 0) {
    (await submitHyperlinks(urlStrings)).forEach(({ url, id }) => {
      hyperlinks[url] = id;
    });
  }
  return { hyperlinks };
};
