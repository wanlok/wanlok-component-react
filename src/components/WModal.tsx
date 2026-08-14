import { alpha, Modal, Stack, useMediaQuery, useTheme } from "@mui/material";
import { TabItem, WTabs } from "./WTabs";
import { ReactNode, RefObject } from "react";

type PanelProps = {
  tabs?: TabItem[];
  selectedTab?: number;
  onTabChange?: (tab: number) => void;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

type RightPanelProps = {
  rightWidth?: number;
  rightTabs?: TabItem[];
  rightSelectedTab?: number;
  onRightTabChange?: (tab: number) => void;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
  rightChildren?: ReactNode;
  rightScrollRef?: RefObject<HTMLDivElement | null>;
};

const WModalContent = ({
  tabs,
  selectedTab = 0,
  onTabChange,
  top,
  bottom,
  children,
  scrollRef
}: PanelProps) => {
  const hasHeader = (tabs != null && tabs.length > 0) || top != null;
  return (
    <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
      {hasHeader && (
        <Stack sx={{ gap: "1px" }}>
          {tabs && tabs.length > 0 && <WTabs value={selectedTab} tabs={tabs} onChange={onTabChange ?? (() => {})} />}
          {top && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{top}</Stack>}
        </Stack>
      )}
      <Stack ref={scrollRef} sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
        {children}
      </Stack>
      {bottom && <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>}
    </Stack>
  );
};

export const WModal = ({
  open,
  onClose,
  width,
  height,
  isFullScreen = false,
  mobileSelectedTab = 0,
  onMobileSelectedTabChange,
  hideLeftLabel,
  tabs,
  selectedTab,
  onTabChange,
  top,
  bottom,
  children,
  rightWidth = 400,
  rightTabs,
  rightSelectedTab,
  onRightTabChange,
  rightTop,
  rightBottom,
  rightChildren,
  rightScrollRef
}: {
  open: boolean;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
  isFullScreen?: boolean;
  mobileSelectedTab?: number;
  onMobileSelectedTabChange?: (tab: number) => void;
  hideLeftLabel?: boolean;
} & PanelProps &
  RightPanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const fullScreen = mobile || isFullScreen;
  const leftTabs = tabs ?? [];
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
          flexDirection: mobile && rightChildren ? "column" : "row",
          width: fullScreen ? "100vw" : (width ?? (rightChildren !== undefined ? 800 : rightWidth)),
          height: fullScreen ? "100dvh" : (height ?? "fit-content"),
          maxHeight: fullScreen ? undefined : "80dvh",
          overflow: "hidden",
          gap: mobile && rightChildren ? 0 : "1px",
          backgroundColor: rightChildren ? "common.white" : undefined,
          borderWidth: fullScreen ? 0 : 1,
          borderStyle: "solid",
          borderColor: "divider"
        }}
      >
        {mobile && rightChildren ? (
          <WModalContent
            tabs={[...leftTabs, ...(rightTabs ?? [])]}
            selectedTab={mobileSelectedTab}
            onTabChange={(newTab) => {
              onMobileSelectedTabChange?.(newTab);
              if (newTab >= leftTabCount) {
                onRightTabChange?.(newTab - leftTabCount);
              } else {
                onTabChange?.(newTab);
              }
            }}
            top={mobileSelectedTab < leftTabCount ? top : rightTop}
            bottom={mobileSelectedTab < leftTabCount ? bottom : rightBottom}
          >
            {mobileSelectedTab < leftTabCount ? children : rightChildren}
          </WModalContent>
        ) : (
          <>
            <WModalContent
              tabs={hideLeftLabel ? undefined : tabs}
              selectedTab={selectedTab}
              onTabChange={onTabChange}
              top={top}
              bottom={bottom}
            >
              {children}
            </WModalContent>
            {rightChildren && (
              <Stack sx={{ width: rightWidth }}>
                <WModalContent
                  tabs={rightTabs}
                  selectedTab={rightSelectedTab}
                  onTabChange={onRightTabChange}
                  top={rightTop}
                  bottom={rightBottom}
                  scrollRef={rightScrollRef}
                >
                  {rightChildren}
                </WModalContent>
              </Stack>
            )}
          </>
        )}
      </Stack>
    </Modal>
  );
};
