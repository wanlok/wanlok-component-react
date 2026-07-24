import { alpha, Divider, Modal, Stack, Tab, Tabs, Typography, useMediaQuery, useTheme } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { iconButtonSx, WButton } from "./WButton";
import { ReactElement, ReactNode, useState } from "react";

type PanelProps = {
  titleIcon?: ReactElement;
  title?: string;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
};

export const WModalContent = ({ titleIcon, title, top, bottom, children }: PanelProps) => (
  <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
    {(titleIcon || title) && (
      <Stack sx={{ flexDirection: "row", flexShrink: 0 }}>
        <Stack sx={{ flexDirection: "row", flex: 1, alignItems: "center", p: 2, gap: 1 }}>
          {titleIcon}
          {title && <Typography sx={{ flex: 1 }}>{title}</Typography>}
        </Stack>
      </Stack>
    )}
    {top && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{top}</Stack>}
    <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>{children}</Stack>
    {bottom && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
  </Stack>
);

export const WModal = ({
  open,
  onClose,
  right,
  rightIcon,
  rightTitle,
  ...panelProps
}: {
  open: boolean;
  onClose: () => void;
  right?: ReactNode;
  rightIcon?: ReactElement;
  rightTitle?: string;
} & PanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [tab, setTab] = useState(0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: alpha(palette.common.white, 0.8) } }
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
          flexDirection: mobile && right ? "column" : "row",
          width: mobile ? "100vw" : right !== undefined ? 800 : 400,
          height: mobile ? "100dvh" : undefined,
          maxHeight: mobile ? undefined : "80vh",
          overflow: "hidden",
          gap: mobile && right ? 0 : "1px",
          backgroundColor: mobile && right ? "common.white" : undefined,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "divider"
        }}
      >
        {mobile && right ? (
          <>
            <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
              <Tabs
                value={tab}
                variant="fullWidth"
                onChange={(_, value) => setTab(value)}
                sx={{
                  flex: 1,
                  "& .MuiTab-root": {
                    p: 2,
                    backgroundColor: "common.white",
                    color: "text.primary",
                    textTransform: "none",
                    minHeight: 56,
                    fontSize: 16,
                    justifyContent: "flex-start"
                  },
                  "& .MuiTab-root.Mui-selected": {
                    backgroundColor: "background.default",
                    color: "text.primary"
                  },
                  "& .MuiTabs-indicator": { display: "none" }
                }}
              >
                <Tab icon={panelProps.titleIcon} iconPosition="start" label={panelProps.title ?? "Main"} />
                <Tab icon={rightIcon} iconPosition="start" label={rightTitle ?? "More"} />
              </Tabs>
              <Divider orientation="vertical" flexItem sx={{ my: 1 }} />
              <WButton onClick={onClose} sx={{ ...iconButtonSx, backgroundColor: "transparent" }}>
                <CloseIcon sx={{ fontSize: 24 }} />
              </WButton>
            </Stack>
            <Stack sx={{ flex: 1, overflow: "hidden", display: tab === 0 ? "flex" : "none" }}>
              <WModalContent {...panelProps} title={undefined} titleIcon={undefined} />
            </Stack>
            <Stack sx={{ flex: 1, overflow: "hidden", display: tab === 1 ? "flex" : "none" }}>{right}</Stack>
          </>
        ) : (
          <>
            <WModalContent {...panelProps} />
            {right}
          </>
        )}
      </Stack>
    </Modal>
  );
};
