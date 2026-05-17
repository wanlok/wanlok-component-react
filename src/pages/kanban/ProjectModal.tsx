import { Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const Row = ({
  label,
  value,
  index,
  disabled = false,
  onRowValueChange
}: {
  label: string;
  value: string | string[];
  index: number;
  disabled?: boolean;
  onRowValueChange: (index: number, value: string | string[]) => void;
}) => {
  if (typeof value === "string") {
    return (
      <TextInput
        label={label}
        value={value}
        onChange={(value) => onRowValueChange(index, value)}
        hideHelperText={true}
        disabled={disabled}
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
          onChange={(v) => {
            const values = [...value];
            values[i] = v;
            onRowValueChange(index, values);
          }}
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
  title,
  rows,
  onRowValueChange,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  rows: { label: string; value: string | string[]; disabled?: boolean }[];
  onRowValueChange: (index: number, value: string | string[]) => void;
  onSaveButtonClick: () => void;
}) => {
  return (
    <WModal open={open} onClose={onClose}>
      <WText text={title} editable={false} rightButtons={[]} />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1 }}>
          {rows.map(({ label, value, disabled }, i) => (
            <Row key={`row-${i}`} label={label} value={value} index={i} disabled={disabled} onRowValueChange={onRowValueChange} />
          ))}
        </Stack>
      </Stack>
      <WButton onClick={onSaveButtonClick}>Save</WButton>
    </WModal>
  );
};
