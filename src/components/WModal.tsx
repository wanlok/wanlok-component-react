import { Modal, Stack } from "@mui/material";
import { ReactNode } from "react";

export const WModal = ({ open, onClose, children }: { open: boolean; onClose: () => void; children?: ReactNode }) => {
  return (
    <Modal open={open} onClose={onClose} aria-labelledby="modal-modal-title" aria-describedby="modal-modal-description">
      <Stack
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "common.white"
        }}
      >
        {children}
      </Stack>
    </Modal>
  );
};
