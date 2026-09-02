export const readFileAsString = (file: File | null): Promise<string | null> => {
  return new Promise((resolve, reject) => {
    if (!file) {
      resolve(null);
      return;
    }
    const fielReader = new FileReader();
    fielReader.onload = ({ target }) => {
      const result = target?.result;
      if (typeof result === "string") {
        resolve(result);
      } else {
        resolve(null);
      }
    };
    fielReader.onerror = (error) => reject(error);
    fielReader.readAsText(file);
  });
};
