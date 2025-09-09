import { extractUrlStrings } from "../services/HyperlinkService";
import { extractSteamUrlStrings } from "../services/SteamService";
import { CollectionCounts, CollectionDocument } from "../services/Types";
import { extractYouTubeInfos, extractYouTubeUrlStrings } from "../services/YouTubeService";
import { toList } from "./ListDictUtils";

export const getCounts = (collectionDocument: CollectionDocument): CollectionCounts => {
  return {
    charts: toList(collectionDocument?.charts).length,
    files: toList(collectionDocument?.files).length,
    hyperlinks: toList(collectionDocument?.hyperlinks).length,
    steam: toList(collectionDocument?.steam).length,
    youtube_regular: toList(collectionDocument?.youtube_regular).length,
    youtube_shorts: toList(collectionDocument?.youtube_shorts).length
  };
};

export const getCountsByUrlStrings = (urlStrings: string[]): CollectionCounts => {
  const text = urlStrings.join("\n");
  const hyperlinks = extractUrlStrings(text);
  const steamUrlStrings = extractSteamUrlStrings(text);
  const youTubeInfos = extractYouTubeInfos(extractYouTubeUrlStrings(text));
  return {
    charts: 0,
    files: 0,
    hyperlinks: hyperlinks.length,
    steam: steamUrlStrings.length,
    youtube_regular: youTubeInfos.filter((info) => info.type === "youtube_regular").length,
    youtube_shorts: youTubeInfos.filter((info) => info.type === "youtube_shorts").length
  };
};
