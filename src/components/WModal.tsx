import { alpha, Modal, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactNode } from "react";

type PanelProps = {
  titleIcon?: ReactNode;
  title?: string;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
};

const ModalPanel = ({ titleIcon, title, top, bottom, children }: PanelProps) => (
  <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
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
    {bottom && <Stack sx={{ flexDirection: "row", minHeight: 55, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
  </Stack>
);

export const WModal = ({
  open,
  onClose,
  right,
  ...panelProps
}: {
  open: boolean;
  onClose: () => void;
  right?: PanelProps;
} & PanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
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
          flexDirection: "row",
          width: mobile ? "100vw" : right !== undefined ? 800 : 400,
          height: mobile ? "100dvh" : undefined,
          minHeight: mobile ? undefined : "40vh",
          maxHeight: mobile ? undefined : "80vh",
          overflow: "hidden",
          gap: "1px"
        }}
      >
        <ModalPanel {...panelProps} />
        {right && <ModalPanel {...right} />}
      </Stack>
    </Modal>
  );
};
