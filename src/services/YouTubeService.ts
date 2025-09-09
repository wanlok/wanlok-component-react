import { extractUrlStrings } from "../common/StringUtils";
import { regex, YouTubeOEmbed } from "./Types";

const SINGLE_URL_REGEX =
  /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:(?:watch\?v=([\w-]{11}))|(?:embed\/([\w-]{11}))|(?:shorts\/([\w-]{11})))|youtu\.be\/([\w-]{11}))/;

export const fetchYouTubeOEmbed = async (urlString: string) => {
  let youTubeOEmbed: YouTubeOEmbed | undefined = undefined;
  try {
    const response = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(urlString)}&format=json`);
    if (response.ok) {
      youTubeOEmbed = (await response.json()) as YouTubeOEmbed;
    }
  } catch (e) {}
  return youTubeOEmbed;
};

export const extractYouTubeInfos = (urlStrings: string[]): { urlString: string; id: string; type: string }[] => {
  const youTubeInfos: { urlString: string; id: string; type: string }[] = [];
  for (const urlString of urlStrings) {
    const match = urlString.match(SINGLE_URL_REGEX);
    if (match) {
      const [, watchId, embedId, shortsId, shareId] = match;
      const id = shortsId ?? watchId ?? embedId ?? shareId ?? "";
      const type = shortsId ? "youtube_shorts" : "youtube_regular";
      youTubeInfos.push({ urlString, id, type });
    }
  }
  return youTubeInfos;
};

export const getYouTubeRegularAndShortInfos = async (text: string) => {
  const youtube_regular: { [key: string]: YouTubeOEmbed } = {};
  const youtube_shorts: { [key: string]: YouTubeOEmbed } = {};

  const youTubeInfos = extractYouTubeInfos(extractUrlStrings(text, regex.YOUTUBE));

  const results = (
    await Promise.all(
      youTubeInfos.map(async ({ urlString, id, type }) => {
        const value = await fetchYouTubeOEmbed(urlString);
        return value ? { id, type, value } : null;
      })
    )
  ).filter(Boolean) as { id: string; type: string; value: YouTubeOEmbed }[];

  for (const { id, type, value } of results) {
    if (type === "youtube_regular") {
      youtube_regular[id] = value;
    } else if (type === "youtube_shorts") {
      youtube_shorts[id] = value;
    }
  }

  return { youtube_regular, youtube_shorts };
};
