import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import { useEffect, useState } from "react";
import { routes } from "../configs/routes";
import { PrimaryButton } from "../components/PrimaryButton";

export const MainMenu = ({ buttonHeight, fullWidth }: { buttonHeight: number; fullWidth: boolean }) => {
  const { palette } = useTheme();
  const { pathname } = useLocation();
  const [path, setPath] = useState<string>(pathname);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <>
      {routes.map((routes) => {
        return routes.children
          .filter((children) => children.name !== undefined)
          .map((route, index) => {
            return (
              <Link to={route.path} key={index}>
                <PrimaryButton
                  fullWidth={fullWidth}
                  sx={[
                    {
                      height: buttonHeight,
                      textTransform: "none",
                      borderRadius: 0
                    },
                    path === route.path ? { backgroundColor: palette.primary.dark } : {}
                  ]}
                  onClick={() => {
                    setPath(route.path);
                  }}
                >
                  {route.name}
                </PrimaryButton>
              </Link>
            );
          });
      })}
    </>
  );
};
