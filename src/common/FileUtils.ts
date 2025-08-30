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
