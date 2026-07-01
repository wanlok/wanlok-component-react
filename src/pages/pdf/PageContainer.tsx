import { useCallback, useEffect, useRef, useState } from "react";
import { Stack } from "@mui/material";
import { Document as PDFDocument, Page } from "react-pdf";
import { PDFFile } from "./usePDF";

const borderWidth = 1;

interface PageEntry {
  fileId: string;
  pageNumber: number;
}

const Document = ({
  file,
  itemWidth,
  pageOrder,
  dragIndex,
  onFileLoad,
  onDragStart,
  onDragOver,
  onDrop
}: {
  file: PDFFile;
  itemWidth: number;
  pageOrder: PageEntry[];
  dragIndex: number | null;
  onFileLoad: (fileId: string, numPages: number) => void;
  onDragStart: (index: number) => void;
  onDragOver: (index: number) => void;
  onDrop: (index: number) => void;
}) => {
  const [numPages, setNumPages] = useState(0);

  const onLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
    onFileLoad(file.id, numPages);
  };

  return (
    <PDFDocument className="pdf-document-contents" file={file.file} onLoadSuccess={onLoadSuccess}>
      {Array.from({ length: numPages }, (_, i) => {
        const pageNumber = i + 1;
        const orderIndex = pageOrder.findIndex((p) => p.fileId === file.id && p.pageNumber === pageNumber);
        const order = orderIndex >= 0 ? orderIndex : i;
        return (
          <Stack
            key={`${file.id}-page-${i}`}
            draggable
            onDragStart={() => onDragStart(order)}
            onDragOver={(e) => {
              e.preventDefault();
              onDragOver(order);
            }}
            onDrop={() => onDrop(order)}
            sx={{
              order,
              width: itemWidth,
              borderWidth,
              borderStyle: "solid",
              borderColor: dragIndex === order ? "primary.main" : "black",
              cursor: "grab"
            }}
          >
            <Page pageNumber={pageNumber} width={itemWidth} renderAnnotationLayer={false} renderTextLayer={false} />
          </Stack>
        );
      })}
    </PDFDocument>
  );
};

export const PageContainer = ({ files, selectedFile }: { files: PDFFile[]; selectedFile: PDFFile | null }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const [pageOrder, setPageOrder] = useState<PageEntry[]>([]);
  const [dragIndex, setDragIndex] = useState<number | null>(null);

  useEffect(() => {
    const node = containerRef.current;
    if (!node) {
      return;
    }
    const observer = new ResizeObserver(([entry]) => {
      setContainerWidth(entry.contentRect.width);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
    };
  }, []);

  const onFileLoad = useCallback((fileId: string, numPages: number) => {
    setPageOrder((prev) => {
      if (prev.some((p) => p.fileId === fileId)) {
        return prev;
      }
      const newPages = Array.from({ length: numPages }, (_, i) => ({ fileId, pageNumber: i + 1 }));
      return [...prev, ...newPages];
    });
  }, []);

  const onDragStart = (index: number) => {
    setDragIndex(index);
  };

  const onDragOver = (_index: number) => {};

  const onDrop = (targetIndex: number) => {
    if (dragIndex === null || dragIndex === targetIndex) {
      return;
    }
    setPageOrder((prev) => {
      const next = [...prev];
      const [dragged] = next.splice(dragIndex, 1);
      next.splice(targetIndex, 0, dragged);
      return next;
    });
    setDragIndex(null);
  };

  const numColumns = Math.max(1, Math.floor(containerWidth / 150));
  const itemWidth = Math.floor((containerWidth - borderWidth * 2 * numColumns) / numColumns);

  const displayedFiles = selectedFile ? [selectedFile] : files;

  return (
    <Stack ref={containerRef} sx={{ flex: 1, overflowY: "auto", p: 4 }}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 4 }}>
        {displayedFiles.map((file) => (
          <Document
            key={file.id}
            file={file}
            itemWidth={itemWidth}
            pageOrder={pageOrder}
            dragIndex={dragIndex}
            onFileLoad={onFileLoad}
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
          />
        ))}
      </Stack>
    </Stack>
  );
};
