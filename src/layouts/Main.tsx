import { Divider, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { useWindowDimensions } from "../common/useWindowDimension";
import { routes } from "../configs/routes";
import { WButton } from "../components/WButton";
import { Fragment } from "react/jsx-runtime";
import { DummyContainer } from "../components/DummyContainer";

const buttonHeight = 100;

export const Main = () => {
  const { pathname } = useLocation();
  const { breakpoints, palette } = useTheme();
  const { height } = useWindowDimensions();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const contentHeight = height - (mobile ? buttonHeight : 0);

  const mainRoute = routes.find((route) => route.element?.type === Main);
  const filteredRoutes = mainRoute?.children?.filter((child) => child.name !== undefined) ?? [];

  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height }}>
      <DummyContainer hideDivider={pathname === "/youtube"} sx={{ backgroundColor: "primary.main" }}>
        <Stack sx={{ flexDirection: mobile ? "row" : "column", overflowX: "auto", alignItems: "center" }}>
          {filteredRoutes.map((route, index) => (
            <Fragment key={`menu-fragment-${index}`}>
              {index > 0 && (
                <Divider
                  key={`menu-divider-${index}`}
                  orientation={mobile ? "vertical" : "horizontal"}
                  sx={[mobile ? { height: "80%" } : { width: "80%" }]}
                />
              )}
              <Link to={route.path} key={`menu-link-${index}`}>
                <WButton
                  sx={{
                    height: buttonHeight,
                    aspectRatio: "1 / 1",
                    flexDirection: "column",
                    gap: "4px",
                    fontSize: 14,
                    backgroundColor: matchPath({ path: route.path, end: route.path === "/" }, pathname)
                      ? palette.primary.dark
                      : palette.primary.main
                  }}
                >
                  <img src={route.image} alt="" style={{ width: 32, height: 32 }} />
                  {route.name}
                </WButton>
              </Link>
            </Fragment>
          ))}
        </Stack>
      </DummyContainer>
      <Stack sx={[{ flex: 1, height: contentHeight, overflow: "auto" }]}>
        <Outlet context={[contentHeight]} />
      </Stack>
    </Stack>
  );
};
