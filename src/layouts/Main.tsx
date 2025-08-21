import { Divider, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { useWindowDimensions } from "../common/useWindowDimension";
import { routes } from "../configs/routes";
import { WButton } from "../components/WButton";

const buttonHeight = 100;

export const Main = () => {
  const { pathname } = useLocation();
  const { breakpoints, palette } = useTheme();
  const { width, height } = useWindowDimensions();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const contentHeight = height - (mobile ? buttonHeight : 0);

  const mainRoute = routes.find((route) => route.element?.type === Main);
  const filteredRoutes = mainRoute?.children?.filter((child) => child.name !== undefined) ?? [];

  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height }}>
      <Stack
        sx={{
          width: mobile ? width : buttonHeight,
          height: mobile ? buttonHeight : height,
          flexDirection: mobile ? "row" : "column",
          overflowX: "auto",
          backgroundColor: "primary.main"
        }}
      >
        {filteredRoutes.map((route, index) => (
          <>
            {index > 0 && <Divider sx={{ m: 0 }} />}
            <Link to={route.path} key={index}>
              <WButton
                sx={
                  {
                    height: buttonHeight,
                    aspectRatio: "1 / 1",
                    flexDirection: "column",
                    // backgroundColor: "blue",
                    gap: "4px",
                    fontSize: 12
                  }
                  // matchPath({ path: route.path, end: route.path === "/" }, pathname)
                  //   ? { backgroundColor: palette.primary.dark }
                  //   : {}
                }
              >
                <img src={route.image} alt="YouTube" style={{ width: 32, height: 32 }} />
                {route.name}
              </WButton>
            </Link>
          </>
        ))}
      </Stack>
      <Stack sx={[{ flex: 1, height: contentHeight, overflow: "auto" }]}>
        <Outlet context={[contentHeight]} />
      </Stack>
    </Stack>
  );
};
