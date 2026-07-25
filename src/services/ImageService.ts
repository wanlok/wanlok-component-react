import { convertPdfToImageBlobs } from "../utils/convertPdfToImageBlobs";
import { CloudinaryFileInfo } from "./Types";

const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`;

const uploadImageBlob = async (blob: Blob, name: string, mimeType: string): Promise<{ [key: string]: CloudinaryFileInfo }> => {
  const formData = new FormData();
  formData.append("upload_preset", "wanlok-component");
  formData.append("file", blob, name);

  const response = await fetch(cloudinaryUrl, { method: "POST", body: formData });
  const { public_id, secure_url } = await response.json();
  return { [public_id]: { name, mime_type: mimeType, url: secure_url } };
};

export const uploadAndGetFileInfos = async (files: File[], onPendingCount?: (count: number) => void) => {
  let fileInfos: { [key: string]: CloudinaryFileInfo } = {};

  if (files.length === 0) {
    return fileInfos;
  }

  const file = files[0];
  const mimeType = file.type;

  try {
    if (mimeType === "application/pdf") {
      const blobs = await convertPdfToImageBlobs(file, onPendingCount);
      for (const { name, blob } of blobs) {
        const result = await uploadImageBlob(blob, name, "image/png");
        fileInfos = { ...fileInfos, ...result };
      }
    } else if (mimeType.startsWith("image/")) {
      onPendingCount?.(1);
      const blob = new Blob([await file.arrayBuffer()], { type: mimeType });
      fileInfos = await uploadImageBlob(blob, file.name.replace(/\.[^.]+$/, ""), mimeType);
    }
  } catch (err) {
    console.log("Upload error:", err);
  }

  return fileInfos;
};
