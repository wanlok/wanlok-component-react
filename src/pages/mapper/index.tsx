import { Button, Stack, Typography } from "@mui/material";
import { SelectInput } from "../../components/SelectInput";
import { useMapper } from "./useMapper";
import { ChangeEvent } from "react";
import { MapperSelect } from "./MapperSelect";

interface DummyInterface {
  id: string;
  label: string;
  file: File;
  changeFile: (key: string, e: ChangeEvent<HTMLInputElement>) => void;
  deleteFile: (key: string) => void;
  readFile: (key: string) => void;
}

const FileInput = ({ id, label, file, changeFile, deleteFile, readFile }: DummyInterface) => {
  if (file) {
    return (
      <Stack direction="row">
        <Typography>{file.name}</Typography>
        <Button variant="contained" onClick={() => readFile(id)}>
          Read
        </Button>
        <Button variant="contained" onClick={() => deleteFile(id)}>
          Delete
        </Button>
      </Stack>
    );
  }
  return (
    <Button variant="contained" component="label" sx={{ textTransform: "none" }}>
      {label}
      <input type="file" hidden onChange={(e) => changeFile(id, e)} />
    </Button>
  );
};

export const MapperPage = () => {
  const { numberOfFiles, files, fileItems, fileMetadata, changeNumberOfFiles, changeFile, deleteFile, readFile } =
    useMapper();
  return (
    <Stack gap={1} sx={{ p: 2 }}>
      <SelectInput items={fileItems} value={numberOfFiles} onChange={changeNumberOfFiles} />
      <Stack gap={1}>
        {fileMetadata.map(({ id, label }) => {
          return (
            <FileInput
              key={id}
              id={id}
              label={label}
              file={files[id]}
              changeFile={changeFile}
              deleteFile={deleteFile}
              readFile={readFile}
            />
          );
        })}
      </Stack>
      <Stack gap={1}>
        {fileMetadata
          .filter(({ id }) => files[id])
          .map(({ id }) => {
            return <MapperSelect key={id} id={id} file={files[id]} />;
          })}
      </Stack>
    </Stack>
  );
};
