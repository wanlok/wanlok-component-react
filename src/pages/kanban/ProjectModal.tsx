import { Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const Row = ({
  label,
  value,
  index,
  onRowValueChange
}: {
  label: string;
  value: string | string[];
  index: number;
  onRowValueChange: (index: number, value: string) => void;
}) => {
  if (typeof value === "string") {
    return (
      <TextInput
        label={label}
        value={value}
        onChange={(value) => onRowValueChange(index, value)}
        hideHelperText={true}
        inputPropsSx={{ flex: 1 }}
      />
    );
  }
  return (
    <>
      {value.map((v, i) => (
        <TextInput
          label={`${i + 1}`}
          value={v}
          onChange={(value) => onRowValueChange(index, value)}
          hideHelperText={true}
          inputPropsSx={{ flex: 1 }}
        />
      ))}
    </>
  );
};

export const ProjectModal = ({
  open,
  onClose,
  rows,
  onRowValueChange,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  rows: { label: string; value: string | string[] }[];
  onRowValueChange: (index: number, value: string) => void;
  onSaveButtonClick: () => void;
}) => {
  return (
    <WModal open={open} onClose={onClose}>
      <WText text="Attributes" editable={false} rightButtons={[]} />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1 }}>
          {rows.map(({ label, value }, index) => (
            <Row label={label} value={value} index={index} onRowValueChange={onRowValueChange} />
          ))}
        </Stack>
      </Stack>
      <WButton onClick={onSaveButtonClick}>Save</WButton>
    </WModal>
  );
};
