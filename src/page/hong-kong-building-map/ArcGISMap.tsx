import { useEffect, useState } from "react";
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

const initialLocation = {
    center: [114.1095, 22.345],
    zoom: 11,
    heading: 0,
    tilt: 0
};

function symbol(color: string) {
    return new MeshSymbol3D({
        symbolLayers: [
            new FillSymbol3DLayer({
                material: {
                    color: color
                }
            })
        ]
    });
}

function getUniqueValueInfos(buildingIds: number[]) {
    var uniqueValueInfos: any[] = [];
    for (var i = 0; i < buildingIds.length; i++) {
        uniqueValueInfos.push({
            value: buildingIds[i],
            symbol: symbol("green")
        });
    }
    return uniqueValueInfos;
}

export function isBuilding(response: any) {
    var building = false;
    for (var i = 0; i < response.results.length; i++) {
        const attributes = response.results[i].graphic.attributes;
        if (attributes !== null && attributes["BUILDINGID"] !== null) {
            building = true;
            break;
        }
    }
    return building;
}

export function getBuildingIds(response: any): number[] {
    const buildingIds = [];
    for (var i = 0; i < response.results.length; i++) {
        const attributes = response.results[i].graphic.attributes;
        if (attributes !== null && attributes["BUILDINGID"] !== null) {
            buildingIds.push(attributes["BUILDINGID"]);
        }
    }
    return buildingIds;
}

export function parseBuildingIds(buildingIdList: string): number[] {
    const buildingIds: number[] = [];
    const slices = buildingIdList.split(",");
    for (var i = 0; i < slices.length; i++) {
        buildingIds.push(Number(slices[i]));
    }
    return buildingIds;
}

function ArcGISMap({
    height,
    buildingIdList,
    locate,
    onChange,
    onClick
}: {
    height: number;
    buildingIdList: string;
    locate: number;
    onChange: (value: {
        position: __esri.Point;
        heading: number;
        tilt: number;
    }) => void;
    onClick: (response: any) => void;
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

        sceneView.on("double-click", function (event) {
            event.stopPropagation();
        });

        sceneView.on("click", function (event) {
            sceneView?.hitTest(event).then(function (response) {
                onClick(response);
            });
        });

        sceneView.on("pointer-move", function (event) {
            sceneView.hitTest(event).then(function (response) {
                sceneView.container.style.cursor = isBuilding(response)
                    ? "pointer"
                    : "default";
            });
        });

        sceneView.on("drag", function (event) {
            sceneView.hitTest(event).then(function () {
                onChange({
                    position: sceneView.camera.position,
                    heading: sceneView.camera.heading,
                    tilt: sceneView.camera.tilt
                });
            });
        });

        return () => {
            featureLayer.destroy();
            renderer.destroy();
            outlineSymbol.destroy();
            sceneLayer.destroy();
            sceneView.destroy();
            map.destroy();
        };
    }, []);

    if (sceneLayer != null) {
        sceneLayer.renderer = new UniqueValueRenderer({
            field: "BUILDINGID",
            uniqueValueInfos: getUniqueValueInfos(
                parseBuildingIds(buildingIdList)
            ),
            defaultSymbol: symbol("white")
        });
    }

    return <div id="viewDiv" style={{ height: height }}></div>;
}

export default ArcGISMap;
