import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import styles from "./Main.module.css";
import MainMenu from "./MainMenu";

export default function () {
    const theme = useTheme();
    const md = useMediaQuery(theme.breakpoints.down("md"));
    return (
        <Grid container className={md ? "" : styles.root}>
            <Grid
                item
                xs={12}
                sm={12}
                md={2}
                className={md ? styles.top : styles.left}
            >
                <MainMenu fullWidth={!md} />
            </Grid>
            <Grid item xs={12} sm={12} md={10}>
                <Outlet />
            </Grid>
        </Grid>
    );
}
