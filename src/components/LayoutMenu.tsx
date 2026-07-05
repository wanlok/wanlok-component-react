import { Box, Divider, Stack, useMediaQuery, useTheme } from "@mui/material";
import { Link, matchPath, Outlet, useLocation } from "react-router-dom";
import { useWindowDimensions } from "../common/useWindowDimension";
import { routes } from "../configs/routes";
import { WButton } from "./WButton";
import { Fragment } from "react/jsx-runtime";
import { LayoutDivider } from "./LayoutDivider";

const buttonHeight = 100;

export const LayoutMenu = () => {
  const { pathname } = useLocation();
  const { breakpoints } = useTheme();
  const { height } = useWindowDimensions();
  const mobile = useMediaQuery(breakpoints.down("md"));

  const contentHeight = height - (mobile ? buttonHeight : 0);

  const mainRoute = routes.find((route) => route.element?.type === LayoutMenu);
  const filteredRoutes = mainRoute?.children?.filter((child) => child.name !== undefined) ?? [];

  return (
    <Stack sx={{ flexDirection: mobile ? "column" : "row", height }}>
      <LayoutDivider>
        <Stack sx={{ flexDirection: mobile ? "row" : "column", overflowX: "auto", alignItems: "center" }}>
          {filteredRoutes.map((route, index) => {
            const selected = matchPath({ path: route.path, end: route.path === "/" }, pathname);
            return (
              <Fragment key={`menu-fragment-${index}`}>
                {index > 1 && (
                  <Divider
                    key={`menu-divider-${index}`}
                    orientation={mobile ? "vertical" : "horizontal"}
                    sx={[mobile ? { height: "70%" } : { width: "70%" }]}
                  />
                )}
                <Link to={route.path.replace(/\/:[\w]+\??$/, "")} key={`menu-link-${index}`}>
                  <WButton
                    sx={{
                      height: buttonHeight,
                      aspectRatio: "1/1",
                      flexDirection: "column",
                      gap: "4px",
                      fontSize: 14,
                      p: 0,
                      backgroundColor: "transparent"
                    }}
                  >
                    {(() => {
                      const icon = selected ? route.icon_selected : route.icon;
                      const renderedIcon =
                        typeof icon === "string" ? (
                          <Box
                            component="img"
                            src={icon}
                            alt=""
                            sx={{ width: index === 0 ? "100%" : 32, height: index === 0 ? "100%" : 32 }}
                          />
                        ) : (
                          icon
                        );
                      return index === 0 ? (
                        renderedIcon
                      ) : (
                        <>
                          {renderedIcon}
                          {route.name}
                        </>
                      );
                    })()}
                  </WButton>
                </Link>
              </Fragment>
            );
          })}
        </Stack>
      </LayoutDivider>
      <Stack sx={[{ flex: 1, height: contentHeight, overflow: "auto" }]}>
        <Outlet context={[contentHeight]} />
      </Stack>
    </Stack>
  );
};
