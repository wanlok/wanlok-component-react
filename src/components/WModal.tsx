import { alpha, Modal, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ReactElement, ReactNode, RefObject, useState } from "react";
import { PanelRow } from "./PanelRow";
import { DropdownIcon } from "./DropdownIcon";
import { WCard, WCardList } from "./WCardList";

export type PageItem = {
  icon?: ReactElement;
  label: string;
  description?: string;
};

type PanelProps = {
  pages?: PageItem[];
  selectedPage?: number;
  onPageChange?: (page: number) => void;
  top?: ReactNode;
  bottom?: ReactNode;
  children?: ReactNode;
  scrollRef?: RefObject<HTMLDivElement | null>;
};

type RightPanelProps = {
  rightWidth?: number;
  rightPages?: PageItem[];
  rightSelectedPage?: number;
  onRightPageChange?: (page: number) => void;
  rightTop?: ReactNode;
  rightBottom?: ReactNode;
  rightChildren?: ReactNode;
  rightScrollRef?: RefObject<HTMLDivElement | null>;
};

const WModalContent = ({ pages, selectedPage = 0, onPageChange, top, bottom, children, scrollRef }: PanelProps) => {
  const hasHeader = (pages != null && pages.length > 0) || top != null;
  const [pagesOpened, setPagesOpened] = useState(false);
  const selectedPageItem = pages?.[selectedPage];
  return (
    <Stack sx={{ flex: 1, overflow: "hidden", backgroundColor: "background.default" }}>
      {hasHeader && (
        <Stack sx={{ gap: "1px" }}>
          {pages &&
            pages.length > 0 &&
            selectedPageItem &&
            (pages.length > 1 ? (
              <WCard onClick={() => setPagesOpened(!pagesOpened)} sx={{ backgroundColor: "background.default" }}>
                <Stack sx={{ flexDirection: "row", alignItems: "center" }}>
                  <Stack sx={{ flex: 1 }}>
                    <PanelRow icon={selectedPageItem.icon} title={selectedPageItem.label} />
                  </Stack>
                  <DropdownIcon panelOpened={pagesOpened} />
                </Stack>
              </WCard>
            ) : (
              <PanelRow icon={selectedPageItem.icon} title={selectedPageItem.label} />
            ))}
          {top && !pagesOpened && (
            <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{top}</Stack>
          )}
        </Stack>
      )}
      <Stack ref={scrollRef} sx={{ flex: 1, overflow: "auto", backgroundColor: "common.white" }}>
        {pagesOpened && pages ? (
          <WCardList
            items={pages}
            renderContent={(page) => (
              <PanelRow icon={page.icon} title={page.label}>
                {page.description && (
                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                    {page.description}
                  </Typography>
                )}
              </PanelRow>
            )}
            onContentClick={(page) => {
              if (page) {
                onPageChange?.(pages.indexOf(page));
              }
              setPagesOpened(false);
            }}
            renderRightContent={() => <></>}
          />
        ) : (
          children
        )}
      </Stack>
      {bottom && !pagesOpened && (
        <Stack sx={{ flexDirection: "row", minHeight: 56, gap: "1px", flexShrink: 0 }}>{bottom}</Stack>
      )}
    </Stack>
  );
};

export const WModal = ({
  open,
  onClose,
  width,
  height,
  isFullScreen = false,
  mobileSelectedPage = 0,
  onMobileSelectedPageChange,
  hideLeftLabel,
  pages,
  selectedPage,
  onPageChange,
  top,
  bottom,
  children,
  rightWidth = 400,
  rightPages,
  rightSelectedPage,
  onRightPageChange,
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
  mobileSelectedPage?: number;
  onMobileSelectedPageChange?: (page: number) => void;
  hideLeftLabel?: boolean;
} & PanelProps &
  RightPanelProps) => {
  const { palette, breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const fullScreen = mobile || isFullScreen;
  const leftPages = pages ?? [];
  const leftPageCount = leftPages.length;

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
          width: fullScreen ? undefined : (width ?? (rightChildren !== undefined ? 800 : rightWidth)),
          height: fullScreen ? undefined : (height ?? "fit-content"),
          maxHeight: fullScreen ? undefined : "80dvh",
          overflow: "hidden",
          gap: mobile && rightChildren ? 0 : "1px",
          backgroundColor: rightChildren ? "common.white" : undefined,
          borderTopWidth: mobile || !fullScreen ? 1 : 0,
          borderBottomWidth: mobile || !fullScreen ? 1 : 0,
          borderLeftWidth: fullScreen ? 0 : 1,
          borderRightWidth: fullScreen ? 0 : 1,
          borderStyle: "solid",
          borderColor: "divider",
          outline: "none"
        }}
      >
        {mobile && rightChildren ? (
          <WModalContent
            pages={[...leftPages, ...(rightPages ?? [])]}
            selectedPage={mobileSelectedPage}
            onPageChange={(newPage) => {
              onMobileSelectedPageChange?.(newPage);
              if (newPage >= leftPageCount) {
                onRightPageChange?.(newPage - leftPageCount);
              } else {
                onPageChange?.(newPage);
              }
            }}
            top={mobileSelectedPage < leftPageCount ? top : rightTop}
            bottom={mobileSelectedPage < leftPageCount ? bottom : rightBottom}
          >
            {mobileSelectedPage < leftPageCount ? children : rightChildren}
          </WModalContent>
        ) : (
          <>
            <WModalContent
              pages={hideLeftLabel ? undefined : pages}
              selectedPage={selectedPage}
              onPageChange={onPageChange}
              top={top}
              bottom={bottom}
            >
              {children}
            </WModalContent>
            {rightChildren && (
              <Stack sx={{ width: rightWidth }}>
                <WModalContent
                  pages={rightPages}
                  selectedPage={rightSelectedPage}
                  onPageChange={onRightPageChange}
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
