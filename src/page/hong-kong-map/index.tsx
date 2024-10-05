import { useOutletContext } from "react-router-dom";
import styles from "./index.module.css";
import ArcGISMap, { getBuildingIds } from "./ArcGISMap";
import { useState } from "react";

export default function () {
    const [height] = useOutletContext() as number[];
    const [buildingIds, setBuildingIds] = useState<number[]>([]);

    return (
        <ArcGISMap
            height={height}
            buildingIds={buildingIds}
            onClick={(response) => {
                setBuildingIds((prevBuildingIds) => [
                    ...prevBuildingIds,
                    ...getBuildingIds(response)
                ]);
            }}
        />
    );
}
