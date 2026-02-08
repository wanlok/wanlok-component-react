import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { readFileAsString } from "../../common/readFileAsString";
import { sortItems } from "../../common/sortItems";

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
  const [processedFiles, setProcessedFiles] = useState<Record<string, ProcessedFile>>({});
  const [values, setValues] = useState<Record<string, string>>({});

  const fileItems = Array.from({ length: maxNumberOfFiles }).map((_, index) => {
    return { label: `${index + 1}`, value: `${index + 1}` };
  });

  const metadata = useMemo(
    () =>
      Array.from({ length: parseInt(numberOfFiles) }).map((_, index) => {
        const i = index + 1;
        return {
          id: `file-${i}`,
          label: `File ${i}`
        };
      }),
    [numberOfFiles]
  );

  useEffect(() => {
    const newValues = { ...values };
    const ids = metadata.map(({ id }) => id);
    for (const id in newValues) {
      if (!ids.includes(id)) {
        delete newValues[id];
      }
    }
    for (const { id } of metadata) {
      if (newValues[id] === undefined) {
        newValues[id] = "";
      }
    }
    setValues(newValues);
  }, [metadata]);

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
      setProcessedFiles((prev) => ({ ...prev, [id]: processedFile }));
    }
  };

  const deleteFile = (id: string) => {
    setProcessedFiles((prev) => {
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

  const onSelectChange = (id: string, value: string) => {
    const newProcessedFiles = { ...processedFiles };
    const newValues = { ...values };
    for (const m of metadata) {
      if (m.id === id) {
        newValues[m.id] = value;
      } else if (newProcessedFiles[m.id]) {
        newProcessedFiles[m.id].items = sortItems(newProcessedFiles[m.id].items, value);
      }
    }
    setProcessedFiles(newProcessedFiles);
    setValues(newValues);
  };

  return {
    numberOfFiles,
    processedFiles,
    fileItems,
    metadata,
    changeNumberOfFiles,
    changeFile,
    deleteFile,
    values,
    onSelectChange
  };
};
