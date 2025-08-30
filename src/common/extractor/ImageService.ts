import { toDict } from "../ListDictUtils";
import { FileInfo } from "../WTypes";

const serverAddress = "https://wanlok.ddns.net";

export const uploadAndGetFileInfos = async (files: File[]) => {
  let fileInfos: { [key: string]: FileInfo } = {};

  const formData = new FormData();
  files.forEach((file: File) => formData.append("files", file));

  try {
    const response = await fetch(`${serverAddress}/upload`, {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      fileInfos = toDict(await response.json(), "name", (item: FileInfo) => {
        item.name = item.originalName;
        delete item.originalName;
        return item;
      });
    } else {
      throw new Error(`Upload failed with status ${response.status}`);
    }
  } catch (err) {
    console.log("Upload error:", err);
  }

  return fileInfos;
};
