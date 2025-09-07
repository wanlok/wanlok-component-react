import { extractSteamUrlStrings } from "./SteamService";
import { Hyperlink, serverUrl } from "./Types";
import { extractYouTubeInfos } from "./YouTubeService";

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

export const extractUrlStrings = (text: string): string[] => {
  const exclusion = new Set([
    ...extractSteamUrlStrings(text),
    ...extractYouTubeInfos(text).map(({ urlString }) => urlString)
  ]);
  const regex = /https?:\/\/[^\s"']+/g;
  const urlStrings = text.match(regex) ?? [];
  return urlStrings.filter((urlString) => !exclusion.has(urlString));
};

export const getHyperlinks = async (text: string) => {
  let hyperlinks: { [key: string]: string } = {};
  const urlStrings = extractUrlStrings(text);
  if (urlStrings.length > 0) {
    (await submitHyperlinks(urlStrings)).forEach(({ url, id }) => {
      hyperlinks[url] = id;
    });
  }
  return { hyperlinks };
};
