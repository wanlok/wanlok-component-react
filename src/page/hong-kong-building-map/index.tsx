import { useOutletContext } from "react-router-dom";
import styles from "./index.module.css";
import ArcGISMap, { getBuildingIds, parseBuildingIds } from "./ArcGISMap";
import { SetStateAction, useState } from "react";
import {
    Button,
    Grid,
    TextField,
    useMediaQuery,
    useTheme
} from "@mui/material";
import AddPanel from "./AddPanel";

export default function () {
    const [height] = useOutletContext() as number[];
    const [cameraConfig, setCameraConfig] = useState<string>("");
    const [buildingIdList, setBuildingIdList] = useState<string>("");
    const mobile = useMediaQuery(useTheme().breakpoints.down("md"));
    return (
        <Grid container spacing={2} style={{ position: "relative", marginTop: 0 }}>
            <Grid item xs={12} sm={12} md={4}>
                111
            </Grid>
            <Grid item xs={12} sm={12} md={4}>
                <ArcGISMap
                    height={height}
                    buildingIdList={buildingIdList}
                    onChange={(value) => {
                        setCameraConfig(JSON.stringify(value));
                    }}
                    onClick={(response) => {
                        setBuildingIdList((previous) => {
                            const buildingIdDict: { [key: number]: number } =
                                {};

                            for (var i = 0; i < previous.length; i++) {
                                buildingIdDict[
                                    parseBuildingIds(previous)[i]
                                ] = 1;
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
                    }}
                />
            </Grid>
            <Grid item xs={12} sm={12} md={4} style={{zIndex: 1}}>
                <AddPanel
                    cameraConfig={cameraConfig}
                    buildingIdList={buildingIdList}
                    setBuildingIdList={setBuildingIdList}
                />
            </Grid>
        </Grid>
    );
}
