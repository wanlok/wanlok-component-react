import { Button, Stack, Typography } from "@mui/material";
import { SelectInput } from "../../components/SelectInput";
import { ProcessedFile, useMapper } from "./useMapper";
import { ChangeEvent } from "react";
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
  const {
    numberOfFiles,
    processedFiles,
    fileItems,
    metadata,
    changeNumberOfFiles,
    changeFile,
    deleteFile,
    values,
    onSelectChange
  } = useMapper();

  return (
    <Stack gap={1} sx={{ p: 2 }}>
      <SelectInput items={fileItems} value={numberOfFiles} onChange={changeNumberOfFiles} />
      <Stack gap={1}>
        {metadata.map(({ id, label }) => {
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
        {metadata
          .filter(({ id }) => processedFiles[id])
          .map(({ id }) => {
            return (
              <MapperSelect
                key={id}
                items={processedFiles[id].items}
                value={values[id]}
                onChange={(e) => onSelectChange(id, e.target.value)}
              />
            );
          })}
      </Stack>
    </Stack>
  );
};
