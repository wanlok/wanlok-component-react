import { alpha, Modal, Stack, Typography, useTheme } from "@mui/material";
import { ReactNode } from "react";

export const WModal = ({
  open,
  onClose,
  titleIcon,
  title,
  top,
  bottom,
  children
}: {
  open: boolean;
  onClose: () => void;
  titleIcon?: ReactNode;
  title?: string;
  top?: ReactNode;
  bottom?: ReactNode;
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
          maxHeight: "50vh",
          overflow: "hidden",
          backgroundColor: "background.default"
        }}
      >
        {(titleIcon || title) && (
          <Stack sx={{ flexDirection: "row", flexShrink: 0 }}>
            <Stack sx={{ flexDirection: "row", flex: 1, alignItems: "center", p: 2, gap: 1 }}>
              {titleIcon}
              {title && <Typography sx={{ flex: 1 }}>{title}</Typography>}
            </Stack>
          </Stack>
        )}
        {top && <Stack sx={{ flexDirection: "row", height: 55, gap: "1px", flexShrink: 0 }}>{top}</Stack>}
        <Stack sx={{ flex: 1, overflow: "auto", p: 2, backgroundColor: "common.white" }}>{children}</Stack>
        {bottom && <Stack sx={{ flexDirection: "row", height: 55, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
      </Stack>
    </Modal>
  );
};
