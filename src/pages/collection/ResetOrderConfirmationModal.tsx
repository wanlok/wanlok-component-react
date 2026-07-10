import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon, Done as DoneIcon, Undo as UndoIcon } from "@mui/icons-material";
import { WModal } from "../../components/WModal";
import { WButton } from "../../components/WButton";

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
        <>
          <WButton
            onClick={() => {
              onConfirm();
              onClose();
            }}
            rightIcon={<DoneIcon sx={{ fontSize: 24 }} />}
            sx={{ flex: 1 }}
          >
            Confirm
          </WButton>
          <WButton onClick={onClose} rightIcon={<CloseIcon sx={{ fontSize: 24 }} />} sx={{ flex: 1 }}>
            Cancel
          </WButton>
        </>
      }
    >
      <Stack sx={{ gap: 2 }}>
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
