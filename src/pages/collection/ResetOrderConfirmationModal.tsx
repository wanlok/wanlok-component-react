import { Stack, Typography } from "@mui/material";
import { Undo as UndoIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { YesNoButtons } from "../../components/YesNoButtons";

export const ResetOrderConfirmationModal = ({
  open,
  onClose,
  onConfirm
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) => {
  return (
    <WModal
      open={open}
      onClose={onClose}
      titleIcon={<UndoIcon sx={{ fontSize: 24 }} />}
      title="Reset Order"
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
          Are you sure you want to reset the arranged order?
        </Typography>
        <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
          Please note that items will be arranged in a random order after reset.
        </Typography>
      </Stack>
    </WModal>
  );
};
