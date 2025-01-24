import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./MainMenu.module.css";
import routes from "../routes";
import { useState } from "react";

export default function ({
  buttonHeight,
  fullWidth
}: {
  buttonHeight: number;
  fullWidth: boolean;
}) {
  const [path, setPath] = useState<string>("/");
  return (
    <>
      {routes.map((routes, index) => {
        return routes.children.map((route, index) => {
          return (
            <Link to={route.path} key={index}>
              <Button
                color="primary"
                variant={path === route.path ? "contained" : "text"}
                disableElevation
                fullWidth={fullWidth}
                className={styles.button}
                sx={{
                  height: buttonHeight,
                  borderRadius: 0,
                  p: 2,
                  textTransform: "none"
                }}
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
