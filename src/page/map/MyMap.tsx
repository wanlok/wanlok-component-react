import { useEffect, useState } from "react";

import Map from "@arcgis/core/Map";
import SceneLayer from "@arcgis/core/layers/SceneLayer";
import SceneView from "@arcgis/core/views/SceneView";
// import MapView from '@arcgis/core/views/MapView';
import FeatureLayer from "@arcgis/core/layers/FeatureLayer";
import Extent from "@arcgis/core/geometry/Extent";

import UniqueValueRenderer from "@arcgis/core/renderers/UniqueValueRenderer";
import SimpleFillSymbol from "@arcgis/core/symbols/SimpleFillSymbol";
import SimpleLineSymbol from "@arcgis/core/symbols/SimpleLineSymbol";
import MeshSymbol3D from "@arcgis/core/symbols/MeshSymbol3D";
import FillSymbol3DLayer from "@arcgis/core/symbols/FillSymbol3DLayer";

const initialLocation = {
    center: [114.1095, 22.345],
    zoom: 11,
    tilt: 0,
    heading: 0
};

export default () => {
    const [sceneView, setSceneView] = useState<SceneView>();
    const [sceneLayer, setSceneLayer] = useState<SceneLayer>();
    const [districtExtents, setDistrictExtents] = useState<{
        [key: string]: Extent;
    }>();

    useEffect(() => {
        const map = new Map({
            basemap: "dark-gray-vector",
            ground: "world-elevation"
        });

        const sceneView = new SceneView({
            container: "viewDiv",
            map: map,
            ...initialLocation,
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

        var query = featureLayer.createQuery();
        query.outFields = ["*"];
        query.returnGeometry = true;
        featureLayer.queryFeatures(query).then(function (results) {
            var extents: { [key: string]: Extent } = {};
            for (var i = 0; i < results.features.length; i++) {
                const feature = results.features[i];
                extents[feature.attributes["ENAME"]] = feature.geometry.extent;
            }
            setDistrictExtents(extents);
        });

        // sceneView.on("click", function (event) {
        //     sceneView?.hitTest(event).then(function (response) {
        //         for (var i = 0; i < response.results.length; i++) {
        //             const attributes = response.results[i].graphic.attributes;

        //         }
        //     });
        // });

        sceneView.on("double-click", function (event) {
            event.stopPropagation();
        });

        sceneView.watch("zoom", function (newValue, oldValue, propertyName) {
            if (newValue >= 15 - 0.5) {
                sceneView.graphics.removeAll();
            }
        });

        return () => {
            sceneView?.destroy();
        };
    }, []);

    return (
        <div
            id="viewDiv"
            style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
                height: "100%"
            }}
        ></div>
    );
};
