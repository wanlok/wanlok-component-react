import { YouTubeOEmbed } from "../common/WTypes";

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

const extractYouTubeInfo = (text: string): { urlString: string; id: string; type: string }[] => {
  const regex =
    /https?:\/\/(?:www\.)?(?:youtube\.com\/(?:(?:watch\?v=([\w-]{11}))|(?:embed\/([\w-]{11}))|(?:shorts\/([\w-]{11})))|youtu\.be\/([\w-]{11}))/g;

  const matches: { urlString: string; id: string; type: string }[] = [];
  let match: RegExpExecArray | null;

  while ((match = regex.exec(text)) !== null) {
    const [urlString, watchId, embedId, shortsId, shareId] = match;

    let id: string | undefined;
    let type: string;

    if (shortsId) {
      id = shortsId;
      type = "youtube_shorts";
    } else {
      id = watchId ?? embedId ?? shareId;
      type = "youtube_regular";
    }

    if (id) {
      matches.push({ urlString, id, type });
    }
  }

  return matches;
};

export const extractYouTubeRegularAndShortInfos = async (text: string) => {
  const youtube_regular: { [key: string]: YouTubeOEmbed } = {};
  const youtube_shorts: { [key: string]: YouTubeOEmbed } = {};

  const list = extractYouTubeInfo(text);

  const results = (
    await Promise.all(
      list.map(async ({ urlString, id, type }) => {
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
