import { useOutletContext } from "react-router-dom";
import styles from "./index.module.css";
import ArcGISMap, { getBuildingIds, parseBuildingIds } from "./ArcGISMap";
import { useState } from "react";
import { Button, Grid, TextField } from "@mui/material";

export default function () {
    const [height] = useOutletContext() as number[];
    const [buildingIdList, setBuildingIdList] = useState<string>("");
    const [goToJSONString, setGoToJSONString] = useState<string>("");
    const [locate, setLocate] = useState<number>(Date.now());

    return (
        <>
            <div style={{ position: "relative" }}>
                <div
                    style={{
                        position: "absolute",
                        top: "24px",
                        right: "24px",
                        width: "320px",
                        backgroundColor: "white",
                        padding: "24px 24px 24px 24px"
                    }}
                >
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                label="Go To"
                                fullWidth
                                multiline
                                value={goToJSONString}
                            />
                        </Grid>
                        <Grid item xs={12} sm={12} md={12}>
                            <TextField
                                label="Building Ids"
                                fullWidth
                                multiline
                                value={buildingIdList}
                                onChange={(
                                    event: React.ChangeEvent<HTMLInputElement>
                                ) => {
                                    setBuildingIdList(event.target.value);
                                }}
                            />
                        </Grid>
                    </Grid>
                </div>
            </div>
            <ArcGISMap
                height={height}
                buildingIdList={buildingIdList}
                locate={locate}
                onChange={(value) => {
                    setGoToJSONString(JSON.stringify(value));
                }}
                onClick={(response) => {
                    setBuildingIdList((previous) => {
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
                }}
            />
        </>
    );
}
