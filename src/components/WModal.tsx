import { alpha, Modal, Stack, useMediaQuery, useTheme } from "@mui/material";
import { TabItem, WTabs } from "./WTabs";
import { ReactElement, ReactNode, useState } from "react";

type PanelProps = {
  tabs?: TabItem[];
  tab?: number;
  onTabChange?: (tab: number) => void;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
};

export const WModalContent = ({ tabs, tab = 0, onTabChange, top, bottom, children }: PanelProps) => (
  <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
    {tabs && tabs.length > 0 && <WTabs value={tab} tabs={tabs} onChange={onTabChange ?? (() => {})} />}
    {top && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{top}</Stack>}
    <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>{children}</Stack>
    {bottom && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
  </Stack>
);

export const WModal = ({
  open,
  onClose,
  width,
  right,
  rightWidth = 400,
  rightIcon,
  rightTitle,
  ...panelProps
}: {
  open: boolean;
  onClose: () => void;
  width?: number | string;
  right?: ReactNode;
  rightWidth?: number;
  rightIcon?: ReactElement;
  rightTitle?: string;
} & PanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const [mobileTab, setMobileTab] = useState(0);

  return (
    <Modal
      open={open}
      onClose={onClose}
      slotProps={{
        backdrop: { sx: { backgroundColor: alpha(palette.common.white, 0.6) } }
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
          width: mobile ? "100vw" : (width ?? (right !== undefined ? 800 : rightWidth)),
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
            <WTabs
              value={mobileTab}
              tabs={[
                { icon: panelProps.tabs?.[0]?.icon, label: panelProps.tabs?.[0]?.label ?? "Main" },
                { icon: rightIcon, label: rightTitle ?? "More" }
              ]}
              onChange={setMobileTab}
              onClose={onClose}
            />
            <Stack sx={{ flex: 1, overflow: "hidden", display: mobileTab === 0 ? "flex" : "none" }}>
              <WModalContent {...panelProps} />
            </Stack>
            <Stack sx={{ flex: 1, overflow: "hidden", display: mobileTab === 1 ? "flex" : "none" }}>{right}</Stack>
          </>
        ) : (
          <>
            <WModalContent {...panelProps} />
            {right && <Stack sx={{ width: rightWidth }}>{right}</Stack>}
          </>
        )}
      </Stack>
    </Modal>
  );
};
