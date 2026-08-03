import { extractUrlStrings } from "./StringUtils";
import { CollectionCounts, CollectionDocument, regex } from "../services/Types";
import { extractYouTubeInfos } from "../services/YouTubeService";
import { toList } from "./ListDictUtils";

export const getCounts = (collectionDocument: CollectionDocument): CollectionCounts => {
  return {
    charts: toList(collectionDocument?.charts).length,
    files: toList(collectionDocument?.files).length,
    hyperlinks: toList(collectionDocument?.hyperlinks).length,
    steam: toList(collectionDocument?.steam).length,
    youtubeRegular: toList(collectionDocument?.youtubeRegular).length,
    youtubeShorts: toList(collectionDocument?.youtubeShorts).length
  };
};

export const getCountsByUrlStrings = (urlStrings: string[]): CollectionCounts => {
  const text = urlStrings.join("\n");
  const steamUrlStrings = extractUrlStrings(text, regex.STEAM);
  const youTubeUrlStrings = extractUrlStrings(text, regex.YOUTUBE);
  const hyperlinks = extractUrlStrings(text, regex.HYPERLINK, [...steamUrlStrings, ...youTubeUrlStrings]);
  const youTubeInfos = extractYouTubeInfos(youTubeUrlStrings);
  return {
    charts: 0,
    files: 0,
    hyperlinks: hyperlinks.length,
    steam: steamUrlStrings.length,
    youtubeRegular: youTubeInfos.filter((info) => info.type === "youtubeRegular").length,
    youtubeShorts: youTubeInfos.filter((info) => info.type === "youtubeShorts").length
  };
};
