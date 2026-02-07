import { ChangeEvent, useState } from "react";

const maxNumberOfFiles = 5;

export const useMapper = () => {
  const [numberOfFiles, setNumberOfFiles] = useState<string>("2");
  const [files, setFiles] = useState<Record<string, File>>({});

  const fileItems = Array.from({ length: maxNumberOfFiles }).map((_, index) => {
    return { label: `${index + 1}`, value: `${index + 1}` };
  });

  const fileMetadata = Array.from({ length: parseInt(numberOfFiles) }).map((_, index) => {
    const i = index + 1;
    return {
      id: `file-${i}`,
      label: `File ${i}`
    };
  });

  const changeNumberOfFiles = (value: string) => {
    setNumberOfFiles(value);
  };

  const changeFile = (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFiles((prev) => ({
        ...prev,
        [id]: file
      }));
    }
  };

  const deleteFile = (id: string) => {
    setFiles((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const readFile = (id: string) => {
    const file = files[id];
    if (file) {
      const fielReader = new FileReader();
      fielReader.onload = ({ target }) => {
        const result = target?.result;
        if (typeof result === "string") {
          console.log(result);
        }
      };
      //   fielReader.onerror = (error) => {};
      fielReader.readAsText(file);
    }
  };

  return {
    numberOfFiles,
    files,
    fileItems,
    fileMetadata,
    changeNumberOfFiles,
    changeFile,
    deleteFile,
    readFile
  };
};
