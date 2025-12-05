import { Stack } from "@mui/material";
import { WModal } from "../../components/WModal";
import { WText } from "../../components/WText";
import { TextInput } from "../../components/TextInput";
import { WButton } from "../../components/WButton";

export const ProjectModal = ({ open, onClose }: { open: boolean; onClose: () => void }) => {
  return (
    <WModal open={open} onClose={onClose}>
      <WText text="Attributes" editable={false} rightButtons={[]} />
      <Stack sx={{ flexDirection: "row", backgroundColor: "background.default" }}>
        <Stack sx={{ flex: 1 }}>
          <TextInput
            label="Hello World"
            value={"Hello World"}
            onChange={(value) => {
              // const newAttributes = [...attributes];
              // newAttributes[i].name = value;
              // setAttributes(newAttributes);
            }}
            hideHelperText={true}
            inputPropsSx={{ flex: 1 }}
          />
        </Stack>
      </Stack>
      <WButton>Save</WButton>
    </WModal>
  );
};
