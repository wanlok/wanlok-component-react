import { useState } from "react";
import { GlobalStyles, Stack, Typography } from "@mui/material";
import { pdfjs } from "react-pdf";
import { LayoutPanel } from "../../components/LayoutPanel";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { usePDF } from "./usePDF";
import { PageContainer } from "./PageContainer";
import { FileList } from "./FileList";

pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();

const panelWidth = 300;

export const PDFPage = () => {
  const [panelOpened, setPanelOpened] = useState(false);
  const { files, selectedFile, onFileClick, isDragOver, onDragEnter, onDragOver, onDragLeave, onDrop } = usePDF();

  return (
    <>
      <GlobalStyles styles={{ ".pdf-document-contents": { display: "contents" } }} />
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
            <FileList files={files} selectedFile={selectedFile} onFileClick={onFileClick} />
          </Stack>
        }
        topChildren={
          <Stack sx={[topSx, { px: 2 }]}>
            <Typography variant="body1">PDF</Typography>
          </Stack>
        }
      >
        <PageContainer files={files} selectedFile={selectedFile} />
      </LayoutPanel>
    </>
  );
};
