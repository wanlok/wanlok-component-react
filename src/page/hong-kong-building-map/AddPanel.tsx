import { Dispatch } from "react";
import { Button, Grid, TextField } from "@mui/material";
import classes from "./AddPanel.module.css";

function AddPanel({
    cameraConfig,
    buildingIdList,
    setBuildingIdList
}: {
    cameraConfig: string;
    buildingIdList: string;
    setBuildingIdList: Dispatch<React.SetStateAction<string>>;
}) {
    return (
        <Grid
            container
            rowSpacing={2}
            className={classes.container}
        >
            <Grid item xs={12} sm={12} md={12}>
                <TextField
                    label="Camera Config"
                    fullWidth
                    multiline
                    value={cameraConfig}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <TextField
                    label="Building Ids"
                    fullWidth
                    multiline
                    value={buildingIdList}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                        setBuildingIdList(event.target.value);
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={12}>
                <Button fullWidth variant="contained">
                    Add
                </Button>
            </Grid>
        </Grid>
    );
}

export default AddPanel;
