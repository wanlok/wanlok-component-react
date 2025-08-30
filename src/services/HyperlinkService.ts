import { Hyperlink } from "./Types";

const fetchHyperlink = async (url: string) => {
  const response = await fetch(`https://wanlok.ddns.net/save-screenshot?url=${url}`);
  return (await response.json()) as Hyperlink;
};

const extractHyperlinks = (text: string): string[] => {
  const regex = /https?:\/\/[^\s"']+/g;
  return text.match(regex) || [];
};

export const getHyperlinks = async (text: string, list: { [key: string]: any }[]) => {
  let hyperlinks: { [key: string]: string } = {};
  const listEmpty = list.every((obj) => Object.keys(obj).length === 0);
  if (listEmpty) {
    const list = extractHyperlinks(text);

    const results = (await Promise.all(list.map(async (url) => await fetchHyperlink(url)))).filter(
      Boolean
    ) as Hyperlink[];

    results.forEach(({ url, id }) => {
      hyperlinks[url] = id;
    });
  }
  return { hyperlinks };
};
