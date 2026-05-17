import { Divider, Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

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
      <Divider />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1, gap: 1, p: 1 }}>
          {rows.map(({ label, value, disabled }, i) =>
            typeof value === "string" ? (
              <TextInput
                key={`row-${i}`}
                label={label}
                value={value}
                onChange={(v) => onRowValueChange(i, v)}
                hideHelperText={true}
                disabled={disabled}
                inputPropsSx={{ flex: 1 }}
              />
            ) : (
              value.map((v, j) => (
                <TextInput
                  key={`row-${i}-${j}`}
                  label={`${j + 1}`}
                  value={v}
                  onChange={(newV) => {
                    const values = [...value];
                    values[j] = newV;
                    onRowValueChange(i, values);
                  }}
                  hideHelperText={true}
                  inputPropsSx={{ flex: 1 }}
                />
              ))
            )
          )}
        </Stack>
      </Stack>
      <WButton onClick={onSaveButtonClick}>Save</WButton>
    </WModal>
  );
};
