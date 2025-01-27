import { Button, ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import classes from "./BuildingListPanel.module.css";
import { Building } from "./ArcGISMap";

function BuildingListPanel({
  buildings,
  onLocateButtonClick,
  onDeleteButtonClick
}: {
  buildings: Building[];
  onLocateButtonClick: (building: Building) => void;
  onDeleteButtonClick: (building: Building) => void;
}) {
  return (
    <Grid container className={classes.container}>
      <Grid item xs={12} sm={12} md={12}>
        {buildings.map((building, index) => (
          <Card elevation={0} sx={{ mt: index === 0 ? 0 : 2 }}>
            <CardContent>
              <Typography>Building {index + 1}</Typography>
              {/* <Typography>{building.buildingIdList}</Typography> */}
            </CardContent>
            <ButtonGroup variant="contained" aria-label="Basic button group" fullWidth>
              <Button onClick={() => onLocateButtonClick(building)}>Locate</Button>
              <Button onClick={() => onDeleteButtonClick(building)}>Delete</Button>
            </ButtonGroup>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
}

export default BuildingListPanel;
