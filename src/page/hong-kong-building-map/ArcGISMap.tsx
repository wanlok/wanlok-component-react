import { Dispatch, useEffect, useState } from "react";
import Map from "@arcgis/core/Map";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SceneView from "@arcgis/core/views/SceneView";
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer";
import "./ArcGISMap.css";

export type CameraConfig = {
    position: {
        spatialReference: {
            latestWkid: number;
            wkid: number;
        };
        x: number;
        y: number;
        z: number;
    };
    heading: number;
    tilt: number;
};

export type Building = {
    name: string;
    cameraConfig: CameraConfig;
    buildingIds: number[];
};

export const parseCameraConfig = (cameraConfig: string): CameraConfig => {
    return JSON.parse(cameraConfig);
};

export const parseBuildingIds = (buildingIdsString: string): number[] => {
    const buildingIds: number[] = [];
    const slices = buildingIdsString.split(",");
    for (var i = 0; i < slices.length; i++) {
        buildingIds.push(Number(slices[i]));
    }
    return buildingIds;
};

export const clone = (building: Building): Building => {
    return {
        name: building.name,
        cameraConfig: building.cameraConfig,
        buildingIds: building.buildingIds
    };
};

const initialLocation = {
    center: [114.1095, 22.345],
    zoom: 11,
    heading: 0,
    tilt: 0
};

const symbol = (color: string) => {
    return new MeshSymbol3D({
        symbolLayers: [
            new FillSymbol3DLayer({
                material: {
                    color: color
                }
            })
        ]
    });
};

const getUniqueValueInfos = (
    buildingIds: number[],
    selectedBuilding?: Building
) => {
    var uniqueValueInfos: any[] = [];
    for (var i = 0; i < buildingIds.length; i++) {
        uniqueValueInfos.push({
            value: buildingIds[i],
            symbol: symbol("green")
        });
    }
    if (selectedBuilding) {
        for (var i = 0; i < selectedBuilding.buildingIds.length; i++) {
            uniqueValueInfos.push({
                value: selectedBuilding.buildingIds[i],
                symbol: symbol("red")
            });
        }
    }
    return uniqueValueInfos;
};

export const isBuilding = (response: any) => {
    var building = false;
    for (var i = 0; i < response.results.length; i++) {
        const attributes = response.results[i].graphic.attributes;
        if (attributes !== null && attributes["BUILDINGID"] !== null) {
            building = true;
            break;
        }
    }
    return building;
};

export const getBuildingIds = (response: any): number[] => {
    const buildingIds = [];
    for (var i = 0; i < response.results.length; i++) {
        const attributes = response.results[i].graphic.attributes;
        if (attributes !== null && attributes["BUILDINGID"] !== null) {
            buildingIds.push(attributes["BUILDINGID"]);
        }
    }
    return buildingIds;
};

function ArcGISMap({
    height,
    buildingIdsString,
    selectedBuilding,
    onChange,
    onClick,
    setCameraConfigString
}: {
    height: number;
    buildingIdsString: string;
    selectedBuilding?: Building;
    onChange?: (value: {
        position: __esri.Point;
        heading: number;
        tilt: number;
    }) => void;
    onClick: (response: any) => void;
    setCameraConfigString: Dispatch<React.SetStateAction<string>>;
}) {
    const [sceneView, setSceneView] = useState<SceneView>();
    const [sceneLayer, setSceneLayer] = useState<SceneLayer>();

    useEffect(() => {
        const map = new Map({
            basemap: "dark-gray-vector",
            ground: "world-elevation"
        });

        const sceneView = new SceneView({
            container: "viewDiv",
            map: map,
            ...initialLocation
        });
        setSceneView(sceneView);

        const sceneLayer = new SceneLayer({
            portalItem: {
                id: "aa6b63f9143a4356b6f491819cdc1c27"
            },
            popupEnabled: false
        });
        setSceneLayer(sceneLayer);
        map.add(sceneLayer);

        const outlineSymbol = new SimpleLineSymbol({
            color: "transparent",
            width: 1
        });

        const renderer = new UniqueValueRenderer({
            field: "ENAME",
            defaultSymbol: new SimpleFillSymbol({
                color: "transparent",
                outline: outlineSymbol
            })
        });

        const featureLayer = new FeatureLayer({
            url: "https://services3.arcgis.com/6j1KwZfY2fZrfNMR/arcgis/rest/services/Hong_Kong_18_Districts/FeatureServer/0",
            renderer: renderer
        });
        map.add(featureLayer, 0);

        sceneView.on("double-click", (event) => event.stopPropagation());

        sceneView.on("click", (event) =>
            sceneView?.hitTest(event).then((response) => onClick(response))
        );

        sceneView.on("pointer-move", (event) =>
            sceneView
                .hitTest(event)
                .then(
                    (response) =>
                        (sceneView.container.style.cursor = isBuilding(response)
                            ? "pointer"
                            : "default")
                )
        );

        sceneView.on("mouse-wheel", () => setCameraConfigString(""));

        if (onChange) {
            sceneView.on("drag", (event) =>
                sceneView.hitTest(event).then(() =>
                    onChange({
                        position: sceneView.camera.position,
                        heading: sceneView.camera.heading,
                        tilt: sceneView.camera.tilt
                    })
                )
            );
        }

        return () => {
            featureLayer.destroy();
            renderer.destroy();
            outlineSymbol.destroy();
            sceneLayer.destroy();
            sceneView.destroy();
            map.destroy();
        };
    }, []);

    if (sceneLayer) {
        sceneLayer.renderer = new UniqueValueRenderer({
            field: "BUILDINGID",
            uniqueValueInfos: getUniqueValueInfos(
                parseBuildingIds(buildingIdsString),
                selectedBuilding
            ),
            defaultSymbol: symbol("white")
        });
    }

    if (selectedBuilding) {
        sceneView?.goTo(selectedBuilding.cameraConfig);
    }

    return (
        <div
            id="viewDiv"
            style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: height
            }}
        ></div>
    );
}

export default ArcGISMap;
