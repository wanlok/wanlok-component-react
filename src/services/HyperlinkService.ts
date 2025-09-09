import { Hyperlink, regex, serverUrl } from "./Types";
import { extractUrlStrings } from "../common/StringUtils";

const submitHyperlinks = async (urls: string[]) => {
  const response = await fetch(`${serverUrl}/save-screenshot`, {
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

export const getHyperlinks = async (text: string) => {
  let hyperlinks: { [key: string]: string } = {};
  const urlStrings = extractUrlStrings(text, regex.HYPERLINK, [
    ...extractUrlStrings(text, regex.STEAM),
    ...extractUrlStrings(text, regex.YOUTUBE)
  ]);
  if (urlStrings.length > 0) {
    (await submitHyperlinks(urlStrings)).forEach(({ url, id }) => {
      hyperlinks[url] = id;
    });
  }
  return { hyperlinks };
};
