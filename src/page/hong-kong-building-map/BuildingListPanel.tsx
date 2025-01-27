import { Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import classes from "./BuildingListPanel.module.css";
import { Building } from "./ArcGISMap";
import PrimaryButton from "../../component/PrimaryButton";

function BuildingListPanel({
  buildings,
  onLocateButtonClick,
  onDeleteButtonClick
}: {
  buildings: Building[];
  onLocateButtonClick: (building: Building) => void;
  onDeleteButtonClick: (building: Building) => void;
}) {
  const save = () => {
    const jsonString = JSON.stringify(buildings, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "data.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Building List ({buildings.length})
        </Typography>
        <ButtonGroup disableElevation variant="contained" aria-label="Basic button group" fullWidth>
          <PrimaryButton>Load</PrimaryButton>
          <PrimaryButton onClick={save}>Save</PrimaryButton>
        </ButtonGroup>
        {buildings.map((building, index) => (
          <Card elevation={0} sx={{ mt: 2 }}>
            <CardContent>
              <Typography>Building {index + 1}</Typography>
              {/* <Typography>{building.buildingIdList}</Typography> */}
            </CardContent>
            <ButtonGroup disableElevation variant="contained" aria-label="Basic button group" fullWidth>
              <PrimaryButton onClick={() => onLocateButtonClick(building)}>Locate</PrimaryButton>
              <PrimaryButton onClick={() => onDeleteButtonClick(building)}>Delete</PrimaryButton>
            </ButtonGroup>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default BuildingListPanel;
