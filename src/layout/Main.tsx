import { Grid, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";
import styles from "./Main.module.css";
import MainMenu from "./MainMenu";
import useWindowDimensions from "../common/useWindowDimension";

const Main = () => {
  const { breakpoints } = useTheme();
  const mobile = useMediaQuery(breakpoints.down("md"));
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
        sx={[{ backgroundColor: "primary.main" }, mobile ? { height: buttonHeight } : {}]}
      >
        <MainMenu buttonHeight={buttonHeight} fullWidth={!mobile} />
      </Grid>
      <Grid item xs={12} sm={12} md={10} className={styles.content} sx={{ height: contentHeight }}>
        <Outlet context={[contentHeight]} />
      </Grid>
    </Grid>
  );
};

export default Main;
