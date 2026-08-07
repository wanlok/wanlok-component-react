import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";
import { Folder } from "../../services/Types";

export const DeleteFolderConfirmationModal = ({
  open,
  folder,
  onClose,
  onConfirm
}: {
  open: boolean;
  folder: Folder | undefined;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ icon: <CloseIcon sx={{ fontSize: 24, mt: "-2px" }} />, label: "Delete Folder" }]}
      bottom={
        <YesNoButtons
          onYesClick={() => {
            onConfirm();
            onClose();
          }}
          onNoClick={onClose}
        />
      }
    >
      <Stack sx={{ gap: 2, p: 2 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
          Are you sure you want to delete "{folder?.name}"? This action cannot be undone.
        </Typography>
      </Stack>
    </WModal>
  );
};
