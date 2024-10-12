import {
    Card,
    CardActionArea,
    CardContent,
    Grid,
    Typography
} from "@mui/material";
import classes from "./BuildingListPanel.module.css";
import { Building } from "./ArcGISMap";
import { Dispatch } from "react";

function BuildingListPanel({
    buildings,
    setSelectedBuilding
}: {
    buildings: Building[];
    setSelectedBuilding: Dispatch<React.SetStateAction<Building | undefined>>;
}) {
    return (
        <Grid container rowSpacing={2} className={classes.container}>
            <Grid item xs={12} sm={12} md={12}>
                {buildings.map((building, index) => (
                    <Card style={{ backgroundColor: "red" }}>
                        <CardActionArea
                            onClick={() => setSelectedBuilding(building)}
                        >
                            <CardContent>
                                <Typography>Building {index}</Typography>
                                {/* <Typography>{building.buildingIdList}</Typography> */}
                            </CardContent>
                        </CardActionArea>
                    </Card>
                ))}
            </Grid>
        </Grid>
    );
}

export default BuildingListPanel;
