import { ChangeEvent, useState } from "react";
import { readFileAsString } from "../../common/readFileAsString";

const maxNumberOfFiles = 5;

export interface Item {
  image_url: string;
  name: string;
}

export interface ProcessedFile {
  name: string;
  items: Item[] | null;
}

export const useMapper = () => {
  const [numberOfFiles, setNumberOfFiles] = useState<string>("2");
  const [processedFiles, setItems] = useState<Record<string, ProcessedFile>>({});

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

  const changeFile = async (id: string, e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const processedFile = {
        name: file.name,
        items: await getItems(file)
      };
      setItems((prev) => ({ ...prev, [id]: processedFile }));
    }
  };

  const deleteFile = (id: string) => {
    setItems((prev) => {
      const { [id]: _, ...rest } = prev;
      return rest;
    });
  };

  const getItems = async (file: File) => {
    let items: Item[] | null = null;
    const jsonString = await readFileAsString(file);
    if (jsonString) {
      try {
        items = JSON.parse(jsonString) as Item[];
      } catch (e) {}
    }
    return items;
  };

  return {
    numberOfFiles,
    processedFiles,
    fileItems,
    fileMetadata,
    changeNumberOfFiles,
    changeFile,
    deleteFile
  };
};
