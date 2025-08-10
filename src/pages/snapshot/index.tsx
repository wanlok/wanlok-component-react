import {
  Card,
  CardActionArea,
  CardContent,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from "@mui/material";
import { useEffect, useRef, useState } from "react";
import { PrimaryButton } from "../../components/PrimaryButton";
import { Row, Snapshot, useSnapshot } from "./useSnapshot";
import { useNavigate, useParams } from "react-router-dom";

export const TextInput = ({
  placeholder,
  value,
  onChange
}: {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}) => {
  return (
    <FormControl>
      <TextField
        placeholder={placeholder}
        value={value}
        multiline
        onChange={(event) => onChange(event.target.value)}
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
  onRowValueChange,
  onRowDeleteButtonClick
}: {
  row: Row;
  rowIndex: number;
  onRowTypeChange: (index: number, type: string) => void;
  onRowValueChange: (index: number, value: string) => void;
  onRowDeleteButtonClick: (index: number) => void;
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
        <PrimaryButton onClick={() => onRowDeleteButtonClick(rowIndex)}>Delete</PrimaryButton>
      </Stack>
    </Stack>
  );
};

export const SnapshotList = ({
  snapshots,
  onSnapshotClick
}: {
  snapshots: Snapshot[];
  onSnapshotClick: (index: number, snapshot: Snapshot) => void;
}) => {
  return (
    <Stack sx={{ width: 400, overflowY: "auto", p: 2 }}>
      <Stack>
        {snapshots.map((snapshot, i) => (
          <Card key={`snapshot-${i + 1}`} sx={{ mt: i === 0 ? 0 : 2 }}>
            <CardActionArea onClick={() => onSnapshotClick(i, snapshot)}>
              <CardContent>
                <Typography gutterBottom variant="h5" component="div">{`Snapshot ${i + 1}`}</Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Document Id: {snapshot.id}
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary" }}>
                  Date/Time: {snapshot.timestamp?.toDate().toLocaleString()}
                </Typography>
              </CardContent>
            </CardActionArea>
          </Card>
        ))}
      </Stack>
    </Stack>
  );
};

export const SnapshotForm = ({
  snapshot,
  onAddButtonClick,
  onRowTypeChange,
  onRowValueChange,
  onRowDeleteButtonClick,
  onNewButtonClick,
  onSaveButtonClick,
  onDownloadPDFButtonClick
}: {
  snapshot: Snapshot;
  onAddButtonClick: () => void;
  onRowTypeChange: (index: number, type: string) => void;
  onRowValueChange: (index: number, value: string) => void;
  onRowDeleteButtonClick: (index: number) => void;
  onNewButtonClick: () => void;
  onSaveButtonClick: () => void;
  onDownloadPDFButtonClick: () => void;
}) => {
  return (
    <Stack sx={{ flexDirection: "column", flex: 1, overflowY: "auto" }}>
      <Stack>
        <div>
          <button onClick={onNewButtonClick}>New</button>
          <button onClick={onSaveButtonClick}>Save</button>
          {snapshot.id && <button onClick={onDownloadPDFButtonClick}>Download PDF</button>}
        </div>
        {snapshot.rows.map((row, i) => (
          <Stack key={`snapshot-input-${i}`} sx={{ flexDirection: "column", flex: 1, mt: i === 0 ? 0 : "1px" }}>
            <SnapshotInput
              row={row}
              rowIndex={i}
              onRowTypeChange={onRowTypeChange}
              onRowValueChange={onRowValueChange}
              onRowDeleteButtonClick={onRowDeleteButtonClick}
            />
            {i === snapshot.rows.length - 1 && <PrimaryButton onClick={onAddButtonClick}>Add</PrimaryButton>}
          </Stack>
        ))}
      </Stack>
    </Stack>
  );
};

export const SnapshotPage = () => {
  const { snapshots, addSnapshot, updateSnapshot } = useSnapshot();
  const snapshotIndexRef = useRef<number>(-1);
  const [snapshot, setSnapshot] = useState<Snapshot>({ rows: [{ type: "text", value: "" }] });
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const index = snapshots.findIndex((s) => s.id === id);
    if (index > -1) {
      snapshotIndexRef.current = index;
      setSnapshot(snapshots[index]);
    } else {
      snapshotIndexRef.current = -1;
      setSnapshot({ rows: [{ type: "text", value: "" }] });
    }
  }, [snapshots, id]);

  const onAddButtonClick = () => {
    setSnapshot((previous) => {
      const snapshot = { ...previous };
      snapshot.rows.push({ type: "text", value: "" });
      return snapshot;
    });
  };

  const onRowTypeChange = (index: number, type: string) => {
    setSnapshot((previous) => {
      const snapshot = { ...previous };
      snapshot.rows[index].type = type;
      return snapshot;
    });
  };

  const onRowValueChange = (index: number, value: string) => {
    setSnapshot((previous) => {
      const snapshot = { ...previous };
      snapshot.rows[index].value = value;
      return snapshot;
    });
  };

  const onRowDeleteButtonClick = (index: number) => {
    setSnapshot((previous) => {
      const snapshot = { ...previous };
      snapshot.rows = [...snapshot.rows.slice(0, index), ...snapshot.rows.slice(index + 1)];
      return snapshot;
    });
  };

  const onNewButtonClick = () => {
    navigate("/snapshot");
  };

  const onSaveButtonClick = async () => {
    let valid;
    if (snapshotIndexRef.current > -1 && snapshot.id) {
      valid = await updateSnapshot(snapshotIndexRef.current, snapshot);
    } else {
      valid = await addSnapshot(snapshot);
    }
    if (valid) {
      alert("Saved");
    } else {
      alert("Invalid submission. Please check that you’ve entered all required data.");
    }
  };

  const onSnapshotClick = (index: number, snapshot: Snapshot) => {
    navigate(`/snapshot/${snapshot.id}`);
  };

  const onDownloadPDFButtonClick = () => {
    navigate(`/pdf/${snapshot.id}`);
  };

  return (
    <Stack sx={{ flexDirection: "row", height: "100%" }}>
      <SnapshotForm
        snapshot={snapshot}
        onAddButtonClick={onAddButtonClick}
        onRowTypeChange={onRowTypeChange}
        onRowValueChange={onRowValueChange}
        onRowDeleteButtonClick={onRowDeleteButtonClick}
        onNewButtonClick={onNewButtonClick}
        onSaveButtonClick={onSaveButtonClick}
        onDownloadPDFButtonClick={onDownloadPDFButtonClick}
      />
      <SnapshotList snapshots={snapshots} onSnapshotClick={onSnapshotClick} />
    </Stack>
  );
};
