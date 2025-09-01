import { extractUrlStrings } from "../services/HyperlinkService";
import { extractSteamAppIds } from "../services/SteamService";
import { CollectionCounts, CollectionDocument } from "../services/Types";
import { extractYouTubeInfos } from "../services/YouTubeService";
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
  const steamAppIds = extractSteamAppIds(text);
  const youTubeInfos = extractYouTubeInfos(text);
  const hyperlinks = extractUrlStrings(
    text,
    [steamAppIds, youTubeInfos].every((list) => list.length === 0)
  );
  return {
    charts: 0,
    files: 0,
    hyperlinks: hyperlinks.length,
    steam: steamAppIds.length,
    youtube_regular: youTubeInfos.filter((info) => info.type === "youtube_regular").length,
    youtube_shorts: youTubeInfos.filter((info) => info.type === "youtube_shorts").length
  };
};
