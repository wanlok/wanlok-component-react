import { Stack, Typography } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";

export const DeleteCalculationModal = ({
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
      pages={[{ icon: <CloseIcon sx={{ fontSize: 24 }} />, label: "Delete Calculation" }]}
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
      <Stack sx={{ p: 2 }}>
        <Typography variant="body1" sx={{ lineHeight: 1.5 }}>
          Are you sure you want to delete the calculation?
        </Typography>
      </Stack>
    </WModal>
  );
};
