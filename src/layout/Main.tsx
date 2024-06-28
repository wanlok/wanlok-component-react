import { Grid } from "@mui/material";
import { Outlet } from "react-router-dom";
import styles from "./Main.module.css";
import MainMenu from "./MainMenu";

export default function () {
  return (
    <Grid container className={styles.root}>
      <Grid item xs={12} md={2} className={styles.left}>
        <MainMenu />
      </Grid>
      <Grid item xs={12} md={10}>
        <Outlet />
      </Grid>
    </Grid>
  );
}
