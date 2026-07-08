import { alpha, Modal, Stack, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const WModal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children?: ReactNode }) => {
  const { palette } = useTheme();
  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: alpha(palette.common.black, 0.8) } }
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Stack
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          backgroundColor: "background.default"
        }}
      >
        {children}
      </Stack>
    </Modal>
  );
};
