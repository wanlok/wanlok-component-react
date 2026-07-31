import { CloudinaryFileInfo } from "./Types";
import { resizeImageBlob } from "../utils/resizeImageBlob";

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/raw/upload`;

const mimeTypeExtensions: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
  "image/svg+xml": "svg"
};

const uploadImageBlob = async (
  blob: Blob,
  name: string,
  mimeType: string
): Promise<{ [key: string]: CloudinaryFileInfo }> => {
  const ext = mimeTypeExtensions[mimeType];
  const resizedBlob = mimeType === "image/svg+xml" ? blob : await resizeImageBlob(blob, mimeType);
  const formData = new FormData();
  formData.append("upload_preset", "wanlok-component");
  formData.append("file", resizedBlob, ext ? `${name}.${ext}` : name);

  const response = await fetch(cloudinaryUrl, { method: "POST", body: formData });
  const { public_id, secure_url } = await response.json();
  return { [public_id]: { name, mime_type: mimeType, url: secure_url } };
};

export const uploadImageBlobs = async (blobs: { name: string; blob: Blob }[]) => {
  let fileInfos: { [key: string]: CloudinaryFileInfo } = {};
  for (const { name, blob } of blobs) {
    fileInfos = { ...fileInfos, ...(await uploadImageBlob(blob, name, "image/png")) };
  }
  return fileInfos;
};

export const uploadAndGetFileInfos = async (files: File[]) => {
  let fileInfos: { [key: string]: CloudinaryFileInfo } = {};

  if (files.length === 0) {
    return fileInfos;
  }

  const file = files[0];
  const mimeType = file.type;

  try {
    if (mimeType.startsWith("image/")) {
      const blob = new Blob([await file.arrayBuffer()], { type: mimeType });
      fileInfos = await uploadImageBlob(blob, file.name.replace(/\.[^.]+$/, ""), mimeType);
    }
  } catch (err) {
    console.log("Upload error:", err);
  }

  return fileInfos;
};
