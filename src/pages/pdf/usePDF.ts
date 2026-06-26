import { DragEvent, useState } from "react";
import { v4 as uuidv4 } from "uuid";

export interface PDFFile {
  id: string;
  name: string;
  file: File;
}

export const usePDF = () => {
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [dragCounter, setDragCounter] = useState(0);

  const onDragEnter = (event: DragEvent) => {
    event.preventDefault();
    setDragCounter((previous) => {
      if (previous === 0) {
        setIsDragOver(true);
      }
      return previous + 1;
    });
  };

  const onDragOver = (event: DragEvent) => {
    event.preventDefault();
  };

  const onDragLeave = () => {
    setDragCounter((previous) => {
      const next = previous - 1;
      if (next === 0) {
        setIsDragOver(false);
      }
      return next;
    });
  };

  const onDrop = (event: DragEvent) => {
    event.preventDefault();
    setIsDragOver(false);
    setDragCounter(0);
    const droppedFiles = Array.from(event.dataTransfer.files).filter(
      (file) => file.type === "application/pdf"
    );
    const newFiles: PDFFile[] = droppedFiles.map((file) => ({
      id: uuidv4(),
      name: file.name,
      file
    }));
    setFiles((previous) => [...previous, ...newFiles]);
  };

  return { files, isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop };
};
