import { useState } from "react";
import { Alert, Stack } from "@mui/material";
import { Add as AddIcon } from "@mui/icons-material";
import { StyledContainer } from "../../components/StyledContainer";
import { TextInput } from "../../components/TextInput";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";

export const AddProductModal = ({
  open,
  onClose,
  onSaveButtonClick
}: {
  open: boolean;
  onClose: () => void;
  onSaveButtonClick: (url: string, name: string) => Promise<{ error?: string }>;
}) => {
  const [url, setUrl] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string>();

  return (
    <WModal
      open={open}
      onClose={onClose}
      pages={[{ icon: <AddIcon sx={{ fontSize: 26, mt: -0.1 }} />, label: "Add Product" }]}
      bottom={
        <YesNoButtons
          yesLabel="Save"
          yesDisabled={!name || !url}
          onYesClick={async () => {
            const result = await onSaveButtonClick(name, url);
            if (result.error) {
              setError(result.error);
            } else {
              onClose();
            }
          }}
          noLabel="Cancel"
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: 2, p: 2 }}>
        <Stack sx={{ gap: "1px" }}>
          <StyledContainer isError={!!error} sx={{ p: 1 }}>
            <TextInput
              label="URL"
              value={url}
              onChange={(value) => {
                setUrl(value);
                setError(undefined);
              }}
              inputSx={{ flex: 1 }}
            />
          </StyledContainer>
          <StyledContainer sx={{ p: 1 }}>
            <TextInput label="Name" value={name} onChange={(value) => setName(value)} inputSx={{ flex: 1 }} />
          </StyledContainer>
        </Stack>
        {error && (
          <Alert severity="error" sx={{ borderRadius: 0 }}>
            {error}
          </Alert>
        )}
      </Stack>
    </WModal>
  );
};
