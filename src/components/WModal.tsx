import { alpha, Modal, Stack, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const WModal = ({
  open,
  onClose,
  titleIcon,
  title,
  children
}: {
  open: boolean;
  onClose: () => void;
  titleIcon?: ReactNode;
  title?: string;
  children?: ReactNode;
}) => {
  const { palette } = useTheme();
  return (
    <Modal
      open={open}
      onClose={(_, reason) => {
        if (reason === "backdropClick") {
          return;
        }
        onClose();
      }}
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
        {(titleIcon || title) && (
          <Stack sx={{ flexDirection: "row" }}>
            <Stack sx={{ flexDirection: "row", flex: 1, alignItems: "center", p: 2, gap: 1 }}>
              {titleIcon}
              {title && <Typography sx={{ flex: 1 }}>{title}</Typography>}
            </Stack>
          </Stack>
        )}
        {children}
      </Stack>
    </Modal>
  );
};
