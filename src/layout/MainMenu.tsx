import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./MainMenu.module.css";
import routes from "../routes";

export default function ({
  buttonHeight,
  fullWidth
}: {
  buttonHeight: number;
  fullWidth: boolean;
}) {
  return (
    <>
      {routes.map((routes, index) => {
        return routes.children.map((route, index) => {
          return (
            <Link to={route.path} key={index}>
              <Button
                color="primary"
                fullWidth={fullWidth}
                className={styles.button}
                sx={{ height: buttonHeight }}
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
