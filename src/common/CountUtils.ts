import { extractUrlStrings } from "./StringUtils";
import { CloudinaryFileInfo, CollectionCounts, CollectionDocument, regex } from "../services/Types";
import { extractYouTubeInfos } from "../services/YouTubeService";
import { toList } from "./ListDictUtils";

const getFileType = (file: CloudinaryFileInfo): "image" | "pdf" | "video" | "file" => {
  if (file.mimeType.startsWith("image/")) {
    return "image";
  }
  if (file.mimeType === "application/pdf") {
    return "pdf";
  }
  if (file.mimeType.startsWith("video/")) {
    return "video";
  }
  return "file";
};

export const getCounts = (collectionDocument: CollectionDocument): CollectionCounts => {
  const files = toList(collectionDocument?.files);
  return {
    chart: toList(collectionDocument?.charts).length,
    file: files.filter(([, file]) => getFileType(file) === "file").length,
    hyperlink: toList(collectionDocument?.hyperlinks).length,
    image: files.filter(([, file]) => getFileType(file) === "image").length,
    pdf: files.filter(([, file]) => getFileType(file) === "pdf").length,
    quiz: files.filter(([, file]) => file.layout === "quiz" && (file.regions?.length ?? 0) > 0).length,
    region: files.filter(([, file]) => file.layout === "regions" && (file.regions?.length ?? 0) > 0).length,
    steam: toList(collectionDocument?.steam).length,
    video: files.filter(([, file]) => getFileType(file) === "video").length,
    youTubeRegular: toList(collectionDocument?.youtubeRegular).length,
    youTubeShort: toList(collectionDocument?.youtubeShorts).length
  };
};

export const getCountsByUrlStrings = (urlStrings: string[]): CollectionCounts => {
  const text = urlStrings.join("\n");
  const steamUrlStrings = extractUrlStrings(text, regex.STEAM);
  const youTubeUrlStrings = extractUrlStrings(text, regex.YOUTUBE);
  const hyperlinks = extractUrlStrings(text, regex.HYPERLINK, [...steamUrlStrings, ...youTubeUrlStrings]);
  const youTubeInfos = extractYouTubeInfos(youTubeUrlStrings);
  return {
    chart: 0,
    file: 0,
    hyperlink: hyperlinks.length,
    image: 0,
    pdf: 0,
    quiz: 0,
    region: 0,
    steam: steamUrlStrings.length,
    video: 0,
    youTubeRegular: youTubeInfos.filter((info) => info.type === "youtubeRegular").length,
    youTubeShort: youTubeInfos.filter((info) => info.type === "youtubeShorts").length
  };
};
