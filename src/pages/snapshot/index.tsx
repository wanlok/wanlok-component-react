import { FormControl, FormHelperText, MenuItem, Select, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { PrimaryButton } from "../../components/PrimaryButton";

interface Row {
  type: string;
  value: string;
}

export const TextInput = ({
  placeholder,
  value,
  onChange
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  const [v, setValue] = useState(value);
  return (
    <FormControl>
      <TextField
        placeholder={placeholder}
        value={v}
        multiline
        onChange={(event) => {
          setValue(event.target.value);
          onChange(event.target.value);
        }}
        // onKeyDown={(event) => {
        //   if (event.key === "Enter" && !event.shiftKey) {
        //     event.preventDefault();
        //     submit();
        //   }
        // }}
      />
      <FormHelperText sx={{ mt: 1 }}>Shift + Enter for multiple lines</FormHelperText>
    </FormControl>
  );
};

export const SnapshotInput = ({
  row,
  rowIndex,
  onRowTypeChange,
  onRowValueChange
}: {
  row: Row;
  rowIndex: number;
  onRowTypeChange: (index: number, type: string) => void;
  onRowValueChange: (index: number, value: string) => void;
}) => {
  return (
    <Stack sx={{ flexDirection: "row", flex: 1, gap: 2, backgroundColor: "#EEEEEE", p: 2 }}>
      <Stack sx={{ justifyContent: "center", width: 160 }}>
        <Select
          value={row.type}
          onChange={(event) => {
            onRowTypeChange(rowIndex, event.target.value);
          }}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          <MenuItem value={"text"}>Text</MenuItem>
          <MenuItem value={"barchart"}>Bar Chart</MenuItem>
        </Select>
      </Stack>
      <Stack sx={{ flex: 1 }}>
        {row.type === "text" && (
          <TextInput
            placeholder="Text"
            value={row.value}
            onChange={(value) => {
              onRowValueChange(rowIndex, value);
            }}
          />
        )}
      </Stack>
      <Stack sx={{ flexDirection: "row" }}>
        <PrimaryButton>Delete</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export const SnapshotForm = ({
  rows,
  onAddButtonClick,
  onRowTypeChange,
  onRowValueChange
}: {
  rows: Row[];
  onAddButtonClick: () => void;
  onRowTypeChange: (index: number, type: string) => void;
  onRowValueChange: (index: number, value: string) => void;
}) => {
  return (
    <Stack sx={{ flexDirection: "column", flex: 1 }}>
      {rows.map((row, i) => (
        <Stack sx={{ flexDirection: "column", flex: 1, mt: i === 0 ? 0 : "1px" }}>
          <SnapshotInput row={row} rowIndex={i} onRowTypeChange={onRowTypeChange} onRowValueChange={onRowValueChange} />
          {i === rows.length - 1 && <PrimaryButton onClick={onAddButtonClick}>Add</PrimaryButton>}
        </Stack>
      ))}
    </Stack>
  );
};

export const Snapshot = () => {
  const [rows, setRows] = useState<Row[]>([{ type: "text", value: "" }]);

  const onAddButtonClick = () => {
    setRows((previous) => {
      return [...previous, { type: "text", value: "" }];
    });
  };

  const onRowTypeChange = (index: number, type: string) => {
    setRows((previous) => {
      const rows = [...previous];
      rows[index].type = type;
      return rows;
    });
  };

  const onRowValueChange = (index: number, value: string) => {
    setRows((previous) => {
      const rows = [...previous];
      rows[index].value = value;
      return rows;
    });
  };

  return (
    <Stack sx={{ flexDirection: "row" }}>
      <Stack sx={{ width: 400 }}></Stack>
      <SnapshotForm
        rows={rows}
        onAddButtonClick={onAddButtonClick}
        onRowTypeChange={onRowTypeChange}
        onRowValueChange={onRowValueChange}
      />
    </Stack>
  );
};
