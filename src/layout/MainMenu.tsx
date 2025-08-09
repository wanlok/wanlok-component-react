import { Link, useLocation } from "react-router-dom";
import { useTheme } from "@mui/material";
import routes from "../configs/routes";
import { useEffect, useState } from "react";
import PrimaryButton from "../component/PrimaryButton";

const MainMenu = ({ buttonHeight, fullWidth }: { buttonHeight: number; fullWidth: boolean }) => {
  const { palette } = useTheme();
  const { pathname } = useLocation();
  const [path, setPath] = useState<string>(pathname);

  useEffect(() => {
    setPath(pathname);
  }, [pathname]);

  return (
    <>
      {routes.map((routes, index) => {
        return routes.children.map((route, index) => {
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

export default MainMenu;
