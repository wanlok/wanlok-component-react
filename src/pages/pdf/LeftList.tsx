import { DragEvent } from "react";
import { Stack, Typography } from "@mui/material";
import { LayoutHeader, topSx } from "../../components/LayoutHeader";
import { PDFFile } from "./usePDF";

const Row = ({
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

export const LeftList = ({
  files,
  selectedFile,
  isDragOver,
  onFileClick,
  onDragEnter,
  onDragOver,
  onDragLeave,
  onDrop
}: {
  files: PDFFile[];
  selectedFile: PDFFile | null;
  isDragOver: boolean;
  onFileClick: (file: PDFFile) => void;
  onDragEnter: (event: DragEvent) => void;
  onDragOver: (event: DragEvent) => void;
  onDragLeave: () => void;
  onDrop: (event: DragEvent) => void;
}) => {
  return (
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
          <Row key={file.id} file={file} selectedFile={selectedFile} onFileClick={onFileClick} />
        ))}
      </Stack>
    </Stack>
  );
};
