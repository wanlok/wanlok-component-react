import { Dispatch, ReactNode } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { LayoutDivider } from "./LayoutDivider";
import { WCard } from "./CardList";

export const LayoutPanel = ({
  panelOpened,
  setPanelOpened,
  width,
  panel,
  mobilePanel,
  children
}: {
  panelOpened: boolean;
  setPanelOpened: Dispatch<React.SetStateAction<boolean>>;
  width: number;
  panel: ReactNode;
  mobilePanel?: ReactNode;
  children?: ReactNode;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ height: "100%", flexDirection: "row" }}>
      {(!mobile || panelOpened) && (
        <LayoutDivider hideDivider={mobile} sx={mobile ? { flex: 1 } : { width }}>
          {panel}
        </LayoutDivider>
      )}
      {!panelOpened && (
        <Stack sx={{ flex: 1 }}>
          {mobile && (
            <LayoutDivider>
              <WCard onItemClick={() => setPanelOpened(!panelOpened)}>{mobilePanel}</WCard>
            </LayoutDivider>
          )}
          {children}
        </Stack>
      )}
    </Stack>
  );
};
