import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import styles from "./Main.module.css";
import MainMenu from "./MainMenu";
import useWindowDimensions from "../common/useWindowDimension";

export default function () {
    const theme = useTheme();
    const mobile = useMediaQuery(theme.breakpoints.down("md"));
    const height = useWindowDimensions().height - 1;
    const buttonHeight = 56;
    const contentHeight = height - (mobile ? buttonHeight : 0);
    return (
        <Grid container className={mobile ? "" : styles.root}>
            <Grid
                item
                xs={12}
                sm={12}
                md={2}
                className={mobile ? styles.top : styles.left}
                style={mobile ? { height: buttonHeight } : {}}
            >
                <MainMenu buttonHeight={buttonHeight} fullWidth={!mobile} />
            </Grid>
            <Grid
                item
                xs={12}
                sm={12}
                md={10}
                className={styles.content}
                style={{ height: contentHeight }}
            >
                <Outlet context={[contentHeight]} />
            </Grid>
        </Grid>
    );
}
