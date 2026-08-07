import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { WModal } from "./WModal";
import { YesNoButtons } from "./YesNoButtons";

export const DeleteConfirmationModal = ({
  open,
  title,
  name,
  onClose,
  onConfirm
}: {
  open: boolean;
  title: string;
  name: string | undefined;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <WModal
      open={open}
      onClose={onClose}
      tabs={[{ icon: <CloseIcon sx={{ fontSize: 24, mt: "-2px" }} />, label: title }]}
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
          Are you sure you want to delete "{name}"? This action cannot be undone.
        </Typography>
      </Stack>
    </WModal>
  );
};
