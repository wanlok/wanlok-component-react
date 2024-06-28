import { Link } from "react-router-dom";
import { Button } from "@mui/material";
import styles from "./MainMenu.module.css";

export default function () {
  return (
    <>
      <Link to={"/"}>
        <Button variant="text" fullWidth className={styles.button}>
          Home
        </Button>
      </Link>
      <Link to={"/map"}>
        <Button variant="text" fullWidth className={styles.button}>
          Map
        </Button>
      </Link>
      <Link to={"/chart"}>
        <Button variant="text" fullWidth className={styles.button}>
          Chart
        </Button>
      </Link>
    </>
  );
}
