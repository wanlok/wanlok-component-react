import { alpha, Modal, Stack, useMediaQuery, useTheme } from "@mui/material";
import { TabItem, WTabs } from "./WTabs";
import { ReactElement, ReactNode } from "react";

type PanelProps = {
  tabs?: TabItem[];
  tab?: number;
  onTabChange?: (tab: number) => void;
  onClose?: () => void;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
};

export const WModalContent = ({ tabs, tab = 0, onTabChange, onClose, top, bottom, children }: PanelProps) => (
  <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
    <Stack sx={{ gap: "1px" }}>
      {tabs && tabs.length > 0 && (
        <WTabs value={tab} tabs={tabs} onChange={onTabChange ?? (() => {})} onClose={onClose} />
      )}
      {top && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{top}</Stack>}
    </Stack>
    <Stack sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>{children}</Stack>
    {bottom && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
  </Stack>
);

export const WModal = ({
  open,
  onClose,
  width,
  height,
  right,
  rightWidth = 400,
  rightIcon,
  rightTitle,
  rightTabs,
  rightTab,
  onRightTabChange,
  mobileSelectedTab = 0,
  onMobileSelectedTabChange,
  hideLeftLabel,
  ...panelProps
}: {
  open: boolean;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
  right?: ReactNode;
  rightWidth?: number;
  rightIcon?: ReactElement;
  rightTitle?: string;
  rightTabs?: TabItem[];
  rightTab?: number;
  onRightTabChange?: (tab: number) => void;
  mobileSelectedTab?: number;
  onMobileSelectedTabChange?: (tab: number) => void;
  hideLeftLabel?: boolean;
} & PanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const leftTabs = panelProps.tabs ?? [{ label: "Main" }];
  const allRightTabs = rightTabs ?? [{ icon: rightIcon, label: rightTitle ?? "More" }];
  const leftTabCount = leftTabs.length;

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
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          margin: "auto",
          flexDirection: mobile && right ? "column" : "row",
          width: mobile ? "100vw" : (width ?? (right !== undefined ? 800 : rightWidth)),
          height: mobile ? "100dvh" : (height ?? "fit-content"),
          maxHeight: mobile ? undefined : "80dvh",
          overflow: "hidden",
          gap: mobile && right ? 0 : "1px",
          backgroundColor: right ? "common.white" : undefined,
          borderWidth: 1,
          borderStyle: "solid",
          borderColor: "divider"
        }}
      >
        {mobile && right ? (
          <WModalContent
            tabs={[...leftTabs, ...allRightTabs]}
            tab={mobileSelectedTab}
            onTabChange={(newTab) => {
              onMobileSelectedTabChange?.(newTab);
              if (newTab >= leftTabCount) {
                onRightTabChange?.(newTab - leftTabCount);
              } else {
                panelProps.onTabChange?.(newTab);
              }
            }}
            onClose={onClose}
            top={mobileSelectedTab < leftTabCount ? panelProps.top : undefined}
            bottom={mobileSelectedTab < leftTabCount ? panelProps.bottom : undefined}
          >
            {mobileSelectedTab < leftTabCount ? panelProps.children : right}
          </WModalContent>
        ) : (
          <>
            <WModalContent {...panelProps} tabs={hideLeftLabel ? undefined : panelProps.tabs} />
            {right && (
              <Stack sx={{ width: rightWidth }}>
                {rightTabs && rightTabs.length > 0 && (
                  <WTabs value={rightTab ?? 0} tabs={rightTabs} onChange={onRightTabChange ?? (() => {})} />
                )}
                {right}
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
};
