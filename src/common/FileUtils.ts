export const getFiles = (): Promise<File[]> => {
  return new Promise((resolve) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async () => {
      const files = input.files;
      if (files) {
        resolve(Array.from(files));
      } else {
        resolve([]);
      }
    };
    input.click();
  });
};

export const getFileExtension = (mimeType: string) => {
  let fileExtension = "";
  if (mimeType === "image/jpeg") {
    fileExtension = ".jpg";
  } else if (mimeType === "image/png") {
    fileExtension = ".png";
  } else if (mimeType === "image/gif") {
    fileExtension = ".gif";
  } else if (mimeType === "image/webp") {
    fileExtension = ".webp";
  }
  return fileExtension;
};
