import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import { MainMenu } from "./MainMenu";
import { useWindowDimensions } from "../common/useWindowDimension";

export const Main = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const height = useWindowDimensions().height;
  const buttonHeight = 56;
  const contentHeight = height - (mobile ? buttonHeight : 0);
  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height: "100vh" }}>
      <Stack
        sx={[
          { backgroundColor: "primary.main" },
          mobile
            ? {
                flexDirection: "row",
                height: buttonHeight,
                overflowX: "auto"
              }
            : {
                flexDirection: "column",
                width: "320px"
              }
        ]}
      >
        <MainMenu buttonHeight={buttonHeight} fullWidth={!mobile} />
      </Stack>
      <Stack sx={[{ flex: 1 }, mobile ? { height: "1%" } : {}]}>
        <Outlet context={[contentHeight]} />
      </Stack>
    </Stack>
  );
};
