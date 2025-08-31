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

const extractHyperlinks = (text: string): string[] => {
  const regex = /https?:\/\/[^\s"']+/g;
  return text.match(regex) || [];
};

export const getHyperlinks = async (text: string, list: { [key: string]: any }[]) => {
  let hyperlinks: { [key: string]: string } = {};
  const listEmpty = list.every((obj) => Object.keys(obj).length === 0);
  if (listEmpty) {
    const urls = extractHyperlinks(text);
    const results = await submitHyperlinks(urls);
    results.forEach(({ url, id }) => {
      hyperlinks[url] = id;
    });
  }
  return { hyperlinks };
};
