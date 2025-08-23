import { Dispatch, ReactNode } from "react";
import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { LayoutDivider } from "./LayoutDivider";
import { WCard } from "./CardList";

const Top = ({
  opened,
  setOpened,
  children
}: {
  opened: boolean;
  setOpened: Dispatch<React.SetStateAction<boolean>>;
  children?: ReactNode;
}) => {
  return (
    <LayoutDivider>
      <WCard onClick={() => setOpened(!opened)}>{children}</WCard>
    </LayoutDivider>
  );
};

export const LayoutPanel = ({
  panelOpened,
  setPanelOpened,
  width,
  panel,
  topChildren,
  children
}: {
  panelOpened: boolean;
  setPanelOpened: Dispatch<React.SetStateAction<boolean>>;
  width: number;
  panel: ReactNode;
  topChildren?: ReactNode;
  children?: ReactNode;
}) => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  return (
    <Stack sx={{ height: "100%", flexDirection: "row" }}>
      {(!mobile || panelOpened) && (
        <LayoutDivider hideDivider={mobile} sx={mobile ? { flex: 1 } : { width }}>
          {mobile ? (
            <>
              {<Top opened={panelOpened} setOpened={setPanelOpened} children={topChildren} />}
              {panel}
            </>
          ) : (
            <Stack sx={{ flex: 1 }}>{panel}</Stack>
          )}
        </LayoutDivider>
      )}
      {!panelOpened && (
        <Stack sx={{ flex: 1 }}>
          {mobile && <Top opened={panelOpened} setOpened={setPanelOpened} children={topChildren} />}
          {children}
        </Stack>
      )}
    </Stack>
  );
};
