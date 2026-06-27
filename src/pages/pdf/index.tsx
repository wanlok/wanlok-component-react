import { useState } from "react";
import { Stack, Typography } from "@mui/material";
import { Document, Page, pdfjs } from "react-pdf";
import { LayoutPanel } from "../../components/LayoutPanel";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { PDFFile, usePDF } from "./usePDF";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const panelWidth = 300;
const gridThumbnailWidth = 200;

const PDFFileRow = ({
  file,
  selectedFile,
  onFileClick
}: {
  file: PDFFile;
  selectedFile: PDFFile | null;
  onFileClick: (file: PDFFile) => void;
}) => {
  const selected = selectedFile?.id === file.id;
  return (
    <Stack
      sx={{ px: 2, py: 1, cursor: "pointer", backgroundColor: selected ? "action.selected" : "transparent" }}
      onClick={() => onFileClick(file)}
    >
      <Typography variant="body2" noWrap>
        {file.name}
      </Typography>
    </Stack>
  );
};

const PDFPageGrid = ({ file }: { file: PDFFile }) => {
  const [numPages, setNumPages] = useState(0);
  return (
    <Document file={file.file} onLoadSuccess={({ numPages }) => setNumPages(numPages)}>
      <Stack sx={{ flexDirection: "row", flexWrap: "wrap", gap: 2, p: 2 }}>
        {Array.from({ length: numPages }, (_, i) => (
          <Page
            key={`${file.id}-page-${i}`}
            pageNumber={i + 1}
            width={gridThumbnailWidth}
            renderAnnotationLayer={false}
            renderTextLayer={false}
          />
        ))}
      </Stack>
    </Document>
  );
};

export const PDFPage = () => {
  const [panelOpened, setPanelOpened] = useState(false);
  const { files, selectedFile, onFileClick, isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop } = usePDF();

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
          <Stack sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            {files.map((file) => (
              <PDFFileRow key={file.id} file={file} selectedFile={selectedFile} onFileClick={onFileClick} />
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
      <Stack sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
        {(selectedFile ? [selectedFile] : files).map((file) => (
          <PDFPageGrid key={file.id} file={file} />
        ))}
      </Stack>
    </LayoutPanel>
  );
};
