import { useCallback, useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { LayoutPanel } from "../../components/LayoutPanel";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { PDFFile, usePDF } from "./usePDF";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const panelWidth = 300;

const PDFDocumentPreview = ({ file, thumbnailWidth }: { file: PDFFile; thumbnailWidth: number }) => {
  const [numPages, setNumPages] = useState(0);
  return (
    <Document file={file.file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      {Array.from({ length: numPages }, (_, i) => (
        <Page
          key={`${file.id}-page-${i}`}
          pageNumber={i + 1}
          width={thumbnailWidth}
          renderAnnotationLayer={false}
          renderTextLayer={false}
        />
      ))}
    </Document>
  );
};

export const PDFPage = () => {
  const [panelOpened, setPanelOpened] = useState(false);
  const [thumbnailWidth, setThumbnailWidth] = useState(0);
  const { files, isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop } = usePDF();

  const scrollableRef = useCallback((node: HTMLDivElement | null) => {
    if (node) {
      setThumbnailWidth(node.clientWidth);
    }
  }, []);

  return (
    <LayoutPanel
      panelOpened={panelOpened}
      setPanelOpened={setPanelOpened}
      width={panelWidth}
      panel={
        <Stack
          sx={{
            flex: 1,
            overflow: "hidden",
            outline: isDragOver ? "2px dashed" : "none",
            outlineColor: "primary.main"
          }}
          onDragEnter={onDragEnter}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onDrop={onDrop}
        >
          <LayoutHeader
            top={
              <Stack sx={[topSx, { px: 1 }]}>
                <Typography variant="body1">PDF</Typography>
              </Stack>
            }
            bottom={<Stack sx={{ flexDirection: "row", gap: "1px" }} />}
          />
          <Stack ref={scrollableRef} sx={{ flex: 1, overflowY: "auto", minHeight: 0, gap: 2 }}>
            {files.map((file) => (
              <PDFDocumentPreview key={file.id} file={file} thumbnailWidth={thumbnailWidth} />
            ))}
          </Stack>
        </Stack>
      }
      topChildren={
        <Stack sx={[topSx, { px: 2 }]}>
          <Typography variant="body1">PDF</Typography>
        </Stack>
      }
    >
      <div>Hello World</div>
    </LayoutPanel>
  );
};
