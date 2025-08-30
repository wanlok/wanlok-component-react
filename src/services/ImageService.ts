import { toDict } from "../common/ListDictUtils";
import { FileInfo } from "./Types";

export const uploadAndGetFileInfos = async (files: File[]) => {
  let fileInfos: { [key: string]: FileInfo } = {};

  const formData = new FormData();
  files.forEach((file: File) => formData.append("files", file));

  try {
    const response = await fetch("https://wanlok.ddns.net/upload", {
      method: "POST",
      body: formData
    });
    if (response.ok) {
      fileInfos = toDict(await response.json(), "id", (item: FileInfo) => {
        delete item.id;
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
