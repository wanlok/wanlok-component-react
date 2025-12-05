import { Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const ProjectModal = ({
  open,
  onClose,
  rows,
  onRowValueChange,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  rows: { label: string; value: string }[];
  onRowValueChange: (index: number, value: string) => void;
  onSaveButtonClick: () => void;
}) => {
  return (
    <WModal open={open} onClose={onClose}>
      <WText text="Attributes" editable={false} rightButtons={[]} />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1 }}>
          {rows.map(({ label, value }, i) => {
            return (
              <TextInput
                label={label}
                value={value}
                onChange={(value) => onRowValueChange(i, value)}
                hideHelperText={true}
                inputPropsSx={{ flex: 1 }}
              />
            );
          })}
        </Stack>
      </Stack>
      <WButton onClick={onSaveButtonClick}>Save</WButton>
    </WModal>
  );
};
