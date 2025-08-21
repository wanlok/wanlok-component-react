import { Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { useWindowDimensions } from "../common/useWindowDimension";
import { routes } from "../configs/routes";
import { WButton } from "../components/WButton";

export const Main = () => {
  const { pathname } = useLocation();
  const { breakpoints, palette } = useTheme();
  const { height } = useWindowDimensions();
  const mobile = useMediaQuery(breakpoints.down("md"));
  const buttonHeight = 56;
  const contentHeight = height - (mobile ? buttonHeight : 0);

  const mainRoute = routes.find((route) => route.element?.type === Main);
  const filteredRoutes = mainRoute?.children?.filter((child) => child.name !== undefined) ?? [];

  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height }}>
      <Stack
        sx={{
          backgroundColor: "primary.main",
          height: mobile ? buttonHeight : height,
          flexDirection: mobile ? "row" : "column",
          overflowX: "auto"
        }}
      >
        {filteredRoutes.map((route, index) => (
          <Link to={route.path} key={index}>
            <WButton
              fullWidth={!mobile}
              sx={[
                {
                  height: buttonHeight,
                  textTransform: "none",
                  borderRadius: 0
                },
                matchPath({ path: route.path, end: route.path === "/" }, pathname)
                  ? { backgroundColor: palette.primary.dark }
                  : {}
              ]}
            >
              {route.name}
            </WButton>
          </Link>
        ))}
      </Stack>
      <Stack sx={[{ flex: 1, height: contentHeight }]}>
        <Outlet context={[contentHeight]} />
      </Stack>
    </Stack>
  );
};
