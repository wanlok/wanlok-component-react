import { Link, useLocation } from "react-router-dom";
import { Button, useTheme } from "@mui/material";
import styles from "./MainMenu.module.css";
import routes from "../configs/routes";
import { useEffect, useState } from "react";

export default function ({ buttonHeight, fullWidth }: { buttonHeight: number; fullWidth: boolean }) {
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
              <Button
                color="primary"
                variant="contained"
                disableElevation
                fullWidth={fullWidth}
                className={styles.button}
                sx={[
                  {
                    height: buttonHeight,
                    borderRadius: 0,
                    p: 2,
                    textTransform: "none"
                  },
                  path === route.path ? { backgroundColor: palette.primary.dark } : {}
                ]}
                onClick={() => {
                  setPath(route.path);
                }}
              >
                {route.name}
              </Button>
            </Link>
          );
        });
      })}
    </>
  );
}
