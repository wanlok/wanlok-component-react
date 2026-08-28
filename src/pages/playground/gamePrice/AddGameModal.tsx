import { useState } from "react";
import { Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StyledContainer } from "../../../components/StyledContainer";
import { TextInput } from "../../../components/TextInput";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";

export const AddGameModal = ({
  open,
  onClose,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  onSaveButtonClick: (name: string, url: string) => void;
}) => {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <AddIcon sx={{ fontSize: 26, mt: -0.1 }} />, label: "Add Game" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!name || !url}
          onYesClick={() => {
            onSaveButtonClick(name, url);
            onClose();
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: "1px", p: 2 }}>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="Name" value={name} onChange={(value) => setName(value)} inputSx={{ flex: 1 }} />
        </StyledContainer>
        <StyledContainer sx={{ p: 1 }}>
          <TextInput label="URL" value={url} onChange={(value) => setUrl(value)} inputSx={{ flex: 1 }} />
        </StyledContainer>
      </Stack>
    </WModal>
  );
};
