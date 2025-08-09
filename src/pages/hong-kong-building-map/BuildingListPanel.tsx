import { ButtonGroup, Card, CardContent, Grid, Typography } from "@mui/material";
import classes from "./BuildingListPanel.module.css";
import { Building } from "./ArcGISMap";
import { Dispatch, useRef } from "react";
import { PrimaryButton } from "../../components/PrimaryButton";

export const BuildingListPanel = ({
  buildings,
  setBuildings,
  onLocateBuildingButtonClick,
  onDeleteBuildingButtonClick
}: {
  buildings: Building[];
  setBuildings: Dispatch<React.SetStateAction<Building[]>>;
  onLocateBuildingButtonClick: (building: Building) => void;
  onDeleteBuildingButtonClick: (building: Building) => void;
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);

  const load = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const fileReader = new FileReader();
      fileReader.onload = (e) => {
        try {
          setBuildings(JSON.parse(e.target?.result as string));
        } catch (error) {}
      };
      fileReader.readAsText(file);
    }
  };

  const save = () => {
    const jsonString = JSON.stringify(buildings, null, 2);
    const blob = new Blob([jsonString], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "buildings.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Grid container className={classes.container} sx={{ p: 2, backgroundColor: "background.default" }}>
      <Grid item xs={12} sm={12} md={12}>
        <Typography variant="h5" component="h2" sx={{ mb: 2 }}>
          Building List ({buildings.length})
        </Typography>
        <input ref={inputRef} style={{ display: "none" }} type="file" onChange={load} />
        <ButtonGroup disableElevation variant="contained" aria-label="Basic button group" fullWidth>
          <PrimaryButton
            onClick={() => {
              inputRef.current?.click();
            }}
          >
            Load
          </PrimaryButton>
          <PrimaryButton onClick={save}>Save</PrimaryButton>
        </ButtonGroup>
        {buildings.map((building, index) => (
          <Card elevation={0} sx={{ mt: 2 }}>
            <CardContent>
              <Typography>Building {index + 1}</Typography>
            </CardContent>
            <ButtonGroup disableElevation variant="contained" aria-label="Basic button group" fullWidth>
              <PrimaryButton onClick={() => onLocateBuildingButtonClick(building)}>Locate</PrimaryButton>
              <PrimaryButton onClick={() => onDeleteBuildingButtonClick(building)}>Delete</PrimaryButton>
            </ButtonGroup>
          </Card>
        ))}
      </Grid>
    </Grid>
  );
};
