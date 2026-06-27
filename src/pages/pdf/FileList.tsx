import { Stack, Typography } from "@mui/material";
import { PDFFile } from "./usePDF";

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

export const FileList = ({
  files,
  selectedFile,
  onFileClick
}: {
  files: PDFFile[];
  selectedFile: PDFFile | null;
  onFileClick: (file: PDFFile) => void;
}) => {
  return (
    <Stack sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
      {files.map((file) => (
        <PDFFileRow key={file.id} file={file} selectedFile={selectedFile} onFileClick={onFileClick} />
      ))}
    </Stack>
  );
};
