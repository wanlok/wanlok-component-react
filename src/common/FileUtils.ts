export const getFiles = (callback: (files: File[]) => void) => {
  const input = document.createElement("input");
  input.type = "file";
  input.onchange = async () => {
    const files = input.files;
    if (files) {
      callback(Array.from(files));
    } else {
      callback([]);
    }
  };
  input.click();
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
