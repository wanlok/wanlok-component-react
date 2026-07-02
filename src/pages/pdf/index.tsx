import { useState } from "react";
import { GlobalStyles, Stack, Typography } from "@mui/material";
import { pdfjs } from "react-pdf";
import { LayoutPanel } from "../../components/LayoutPanel";
import { topSx } from "../../components/LayoutHeader";
import { usePDF } from "./usePDF";
import { PageContainer } from "./PageContainer";
import { LeftList } from "./LeftList";

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
          <LeftList
            files={files}
            selectedFile={selectedFile}
            isDragOver={isDragOver}
            onFileClick={onFileClick}
            onDragEnter={onDragEnter}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
          />
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
