import { Button, Stack, Typography } from "@mui/material";
import { SelectInput } from "../../components/SelectInput";
import { ProcessedFile, useMapper } from "./useMapper";
import { ChangeEvent, useEffect, useState } from "react";
import { MapperSelect } from "./MapperSelect";

interface DummyInterface {
  id: string;
  label: string;
  processedFile: ProcessedFile;
  changeFile: (key: string, e: ChangeEvent<HTMLInputElement>) => void;
  deleteFile: (key: string) => void;
}

const FileInput = ({ id, label, processedFile, changeFile, deleteFile }: DummyInterface) => {
  if (processedFile) {
    return (
      <Stack direction="row">
        <Typography>{processedFile.name}</Typography>
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
  const { numberOfFiles, processedFiles, fileItems, fileMetadata, changeNumberOfFiles, changeFile, deleteFile } =
    useMapper();
  const [values, setValues] = useState<Record<string, string>>({});

  useEffect(() => {
    console.log(processedFiles);
  }, [processedFiles]);

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
              processedFile={processedFiles[id]}
              changeFile={changeFile}
              deleteFile={deleteFile}
            />
          );
        })}
      </Stack>
      <Stack gap={1}>
        {fileMetadata
          .filter(({ id }) => processedFiles[id])
          .map(({ id }) => {
            return (
              <MapperSelect
                key={id}
                processedFile={processedFiles[id]}
                value={values[id]}
                onChange={(e) => setValues((prev) => ({ ...prev, [id]: e.target.value }))}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};
