import { useOutletContext } from "react-router-dom";
import styles from "./index.module.css";
import ArcGISMap from "./ArcGISMap";

export default function () {
    const [height] = useOutletContext() as [number];
    return <ArcGISMap height={height} />;
}
