import { Stack, Typography } from "@mui/material";
import { RestartAlt as RestartAltIcon } from "@mui/icons-material";
import { WModal } from "../../../components/WModal";
import { YesNoButtons } from "../../../components/YesNoButtons";

export const ResetModal = ({
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
      tabs={[{ icon: <RestartAltIcon sx={{ fontSize: 24 }} />, label: "Reset" }]}
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
          Are you sure you want to reset all your answers?
        </Typography>
      </Stack>
    </WModal>
  );
};
