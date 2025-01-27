import { useOutletContext } from "react-router-dom";
import classes from "./index.module.css";
import ArcGISMap, { Building, getBuildingIds, parseBuildingIds } from "./ArcGISMap";
import { Dispatch, SetStateAction, useState } from "react";
import { Divider, Grid, useMediaQuery, useTheme } from "@mui/material";
import AddPanel from "./AddPanel";
import BuildingListPanel from "./BuildingListPanel";

export default function () {
  const [height] = useOutletContext() as number[];
  const [cameraConfigString, setCameraConfigString] = useState<string>("");
  const [buildingIdsString, setBuildingIdsString] = useState<string>("");
  const [buildings, setBuildings] = useState<Building[]>([]);
  const [selectedBuilding, setSelectedBuilding] = useState<Building | undefined>();
  const mobile = useMediaQuery(useTheme().breakpoints.down("md"));

  const onArcGISMapChange = (value: { position: __esri.Point; heading: number; tilt: number }) => {
    setCameraConfigString(JSON.stringify(value));
    setSelectedBuilding(undefined);
  };

  const onArcGISMapClick = (response: any) => {
    setSelectedBuilding(undefined);
    setBuildingIdsString((previous) => {
      const buildingIdDict: { [key: number]: number } = {};

      for (var i = 0; i < previous.length; i++) {
        buildingIdDict[parseBuildingIds(previous)[i]] = 1;
      }

      const current = getBuildingIds(response);
      for (var i = 0; i < current.length; i++) {
        if (buildingIdDict.hasOwnProperty(current[i])) {
          delete buildingIdDict[current[i]];
        } else {
          buildingIdDict[current[i]] = 1;
        }
      }

      const buildingIds: number[] = [];
      for (const key in buildingIdDict) {
        const buildingId = Number(key);
        if (!isNaN(buildingId)) {
          buildingIds.push(buildingId);
        }
      }

      return buildingIds.sort().join(",");
    });
  };

  return (
    <Grid container spacing={2} className={classes.container}>
      <Grid item xs={12} sm={12} md={3} className={classes.panel}></Grid>
      <Grid item xs={12} sm={12} md={6}>
        <ArcGISMap
          height={height}
          buildingIdsString={buildingIdsString}
          selectedBuilding={selectedBuilding}
          onChange={onArcGISMapChange}
          onClick={onArcGISMapClick}
        />
      </Grid>
      <Grid item xs={12} sm={12} md={3} className={classes.panel} sx={{ height: height, overflowY: "auto" }}>
        <AddPanel
          cameraConfigString={cameraConfigString}
          setCameraConfigString={setCameraConfigString}
          buildingIdsString={buildingIdsString}
          setBuildingIdsString={setBuildingIdsString}
          setBuildings={setBuildings}
        />
        <Divider />
        <BuildingListPanel
          buildings={buildings}
          onLocateButtonClick={(building) => {
            setSelectedBuilding(building);
            // setCameraConfigString(building.cameraConfig);
            setBuildingIdsString("");
          }}
          onDeleteButtonClick={(building) => {
            setBuildingIdsString("");
            setSelectedBuilding(undefined);
            const i = buildings.indexOf(building);
            setBuildings([...buildings.slice(0, i), ...buildings.slice(i + 1)]);
          }}
        />
      </Grid>
    </Grid>
  );
}
