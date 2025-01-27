import { Dispatch } from "react";
import { Button, Grid, TextField, Typography } from "@mui/material";
import classes from "./AddPanel.module.css";
import { Building, parseBuildingIds, parseCameraConfig } from "./ArcGISMap";
import PrimaryButton from "../../component/PrimaryButton";

function AddPanel({
  cameraConfigString,
  setCameraConfigString,
  buildingIdsString,
  setBuildingIdsString,
  setBuildings
}: {
  cameraConfigString: string;
  setCameraConfigString: Dispatch<React.SetStateAction<string>>;
  buildingIdsString: string;
  setBuildingIdsString: Dispatch<React.SetStateAction<string>>;
  setBuildings: Dispatch<React.SetStateAction<Building[]>>;
}) {
  return (
    <Grid
      container
      rowSpacing={2}
      className={classes.container}
      sx={{
        p: 2,
        backgroundColor: "background.default"
      }}
    >
      <Typography variant="h5" component="h2">
        Map
      </Typography>
      <Grid item xs={12} sm={12} md={12}>
        <TextField label="Camera Config" fullWidth multiline value={cameraConfigString} />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <TextField
          label="Building Ids"
          fullWidth
          multiline
          value={buildingIdsString}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setBuildingIdsString(event.target.value);
          }}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={12}>
        <PrimaryButton
          onClick={() => {
            if (cameraConfigString.length > 0 && buildingIdsString.length > 0) {
              setBuildings((prevState) => {
                return [
                  ...prevState,
                  {
                    name: "Hello World",
                    cameraConfig: parseCameraConfig(cameraConfigString),
                    buildingIds: parseBuildingIds(buildingIdsString)
                  }
                ];
              });
              setCameraConfigString("");
              setBuildingIdsString("");
            }
          }}
        >
          Add Building
        </PrimaryButton>
      </Grid>
    </Grid>
  );
}

export default AddPanel;
