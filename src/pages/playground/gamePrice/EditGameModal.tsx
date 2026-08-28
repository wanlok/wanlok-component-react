import { useState } from "react";
import { Stack } from "@mui/material";
import { Edit as EditIcon } from "@mui/icons-material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";

export const EditGameModal = ({
  open,
  onClose,
  name,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  name: string;
  onSaveButtonClick: (newName: string) => void;
}) => {
  const [newName, setNewName] = useState(name);

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <EditIcon sx={{ fontSize: 18, mt: 0.1 }} />, label: "Edit Game" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!newName}
          onYesClick={() => {
            onSaveButtonClick(newName);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ p: 2 }}>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Name" value={newName} onChange={(value) => setNewName(value)} inputSx={{ flex: 1 }} />
        </StyledContainer>
      </Stack>
    </WModal>
  );
};
