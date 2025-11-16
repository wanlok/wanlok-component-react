import { CloudinaryFileInfo } from "./Types";

const url = `https://api.cloudinary.com/v1_1/${process.env.REACT_APP_CLOUDINARY_CLOUD_NAME}/raw/upload`;

export const uploadAndGetFileInfos = async (files: File[]) => {
  let fileInfos: { [key: string]: CloudinaryFileInfo } = {};

  if (files.length > 0) {
    const file = files[0];
    const mimeType = file.type;

    if (mimeType.startsWith("image/")) {
      const formData = new FormData();
      formData.append("upload_preset", "wanlok-component");
      formData.append("file", files[0]);

      try {
        const response = await fetch(url, {
          method: "POST",
          body: formData
        });

        const { public_id, original_filename, secure_url } = await response.json();

        fileInfos = {
          [public_id]: {
            name: original_filename,
            mime_type: mimeType,
            url: secure_url
          }
        };

        // if (response.ok) {
        // fileInfos = toDict(await response.json(), "id", (item: FileInfo) => {
        //     delete item.id;
        //     return item;
        //   });
        // } else {
        //   throw new Error(`Upload failed with status ${response.status}`);
        // }
      } catch (err) {
        console.log("Upload error:", err);
      }
    }
  }

  return fileInfos;
};
