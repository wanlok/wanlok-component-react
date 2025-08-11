import { Link, matchPath, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { routes } from "../configs/routes";
import { PrimaryButton } from "../components/PrimaryButton";
import { Main } from "./Main";

export const MainMenu = ({ buttonHeight, fullWidth }: { buttonHeight: number; fullWidth: boolean }) => {
  const { palette } = useTheme();
  const { pathname } = useLocation();
  const [path, setPath] = useState<string>(pathname);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  const mainRoute = routes.find((route) => route.element?.type === Main);
  const filteredRoutes = mainRoute?.children?.filter((child) => child.name !== undefined) ?? [];

  return (
    <>
      {filteredRoutes.map((route, index) => (
        <Link to={route.path} key={index}>
          <PrimaryButton
            fullWidth={fullWidth}
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
            onClick={() => {
              setPath(route.path);
            }}
          >
            {route.name}
          </PrimaryButton>
        </Link>
      ))}
    </>
  );
};
