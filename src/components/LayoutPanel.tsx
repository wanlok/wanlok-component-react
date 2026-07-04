import { Dispatch, ReactNode } from "react";
import { Stack, SxProps, Theme, useMediaQuery, useTheme } from "@mui/material";
import { LayoutDivider } from "./LayoutDivider";
import { WCard } from "./WCardList";
import { DropdownIcon } from "./DropdownIcon";

export const LayoutPanel = ({
  panelOpened,
  setPanelOpened,
  width,
  panel,
  topChildren,
  hideDropdownIcon = false,
  sx,
  children
}: {
  panelOpened: boolean;
  setPanelOpened: Dispatch<React.SetStateAction<boolean>>;
  width: number;
  panel: ReactNode;
  topChildren?: ReactNode;
  hideDropdownIcon?: boolean;
  sx?: SxProps<Theme>;
  children?: ReactNode;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ height: "100%", flex: 1, flexDirection: "row", overflow: "hidden", ...sx }}>
      {(!mobile || panelOpened) && (
        <LayoutDivider hideDivider={mobile} sx={mobile ? { flex: 1 } : { width }}>
          {mobile ? (
            <>
              <WCard onClick={() => setPanelOpened(!panelOpened)}>
                <Stack sx={{ flexDirection: "row", alignItems: "center", backgroundColor: "background.default" }}>
                  <Stack sx={{ flex: 1 }}>{topChildren}</Stack>
                  {!hideDropdownIcon && <DropdownIcon panelOpened={panelOpened} />}
                </Stack>
              </WCard>
              {panel}
            </>
          ) : (
            <Stack sx={{ flex: 1, height: "100%", overflow: "hidden" }}>{panel}</Stack>
          )}
        </LayoutDivider>
      )}
      {!panelOpened && (
        <Stack sx={{ flex: 1 }}>
          {mobile && (
            <WCard onClick={() => setPanelOpened(!panelOpened)}>
              <Stack sx={{ flexDirection: "row", alignItems: "center", backgroundColor: "background.default" }}>
                <Stack sx={{ flex: 1 }}>{topChildren}</Stack>
                {!hideDropdownIcon && <DropdownIcon panelOpened={panelOpened} />}
              </Stack>
            </WCard>
          )}
          {children}
        </Stack>
      )}
    </Stack>
  );
};
