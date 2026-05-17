import { Divider, Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { SelectInput } from "../../components/SelectInput";
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
              <Stack key={`row-${i}`} sx={{ gap: 1 }}>
                <SelectInput
                  label="Number of Columns"
                  items={Array.from({ length: 5 }, (_, i) => ({
                    label: String(i + 1),
                    value: String(i + 1)
                  }))}
                  value={String(value.length)}
                  onChange={(count) => {
                    const newCount = parseInt(count);
                    const newValues =
                      newCount > value.length
                        ? [...value, ...Array(newCount - value.length).fill("")]
                        : value.slice(0, newCount);
                    onRowValueChange(i, newValues);
                  }}
                />
                {value.map((v, j) => (
                  <TextInput
                    key={`row-${i}-${j}`}
                    label={`Column ${j + 1}`}
                    value={v}
                    onChange={(newV) => {
                      const values = [...value];
                      values[j] = newV;
                      onRowValueChange(i, values);
                    }}
                    hideHelperText={true}
                    inputPropsSx={{ flex: 1 }}
                  />
                ))}
              </Stack>
            )
          )}
        </Stack>
      </Stack>
      <WButton onClick={onSaveButtonClick}>Save</WButton>
    </WModal>
  );
};
