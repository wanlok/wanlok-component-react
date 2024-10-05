import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";
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

import "./ArcGISMap.css";
// import './Tooltip.css';
import { useNavigate } from "react-router-dom";

const initialLocation = {
    center: [114.1095, 22.345],
    zoom: 11,
    tilt: 0,
    heading: 0
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

// function getSelectedSiteIndex(response: any, selectedDistrictIndex: number) {
//     var selectedSiteIndex = -1;
//     if (response.results.length > 0 && selectedDistrictIndex > -1) {
//         for (var i = 0; i < response.results.length; i++) {
//             const attributes = response.results[i].graphic.attributes;
//             if (attributes != null && attributes['BUILDINGID'] != null) {
//                 for (var j = 0; j < Districts[selectedDistrictIndex].sites.length; j++) {
//                     for (var k = 0; k < Districts[selectedDistrictIndex].sites[j].building_ids.length; k++) {
//                         if (Districts[selectedDistrictIndex].sites[j].building_ids[k] === attributes['BUILDINGID']) {
//                             selectedSiteIndex = j;
//                             break;
//                         }
//                     }
//                     if (selectedSiteIndex > -1) {
//                         break;
//                     }
//                 }
//             }
//             if (selectedSiteIndex > -1) {
//                 break;
//             }
//         }
//     }
//     return selectedSiteIndex;
// }

// function updateBuildingTooltipAndCursor(
//     sceneView: SceneView,
//     sceneLayer: SceneLayer,
//     response: any,
//     selectedDistrictIndex: number,
//     selectedSiteIndex: number,
//     setSelectedSiteIndex: Dispatch<SetStateAction<number>>
// ) {
//     const result = response.results.filter(function (result: any) {
//         return result.graphic != null && result.graphic.layer === sceneLayer;
//     })[0];
//     var siteIndex = -1;
//     if (result != null) {
//         for (var i = 0; i < Districts[selectedDistrictIndex].sites.length; i++) {
//             for (var j = 0; j < Districts[selectedDistrictIndex].sites[i].building_ids.length; j++) {
//                 if (Districts[selectedDistrictIndex].sites[i].building_ids[j] === result.graphic.attributes['BUILDINGID']) {
//                     siteIndex = i;
//                     break;
//                 }
//             }
//             if (siteIndex > -1) {
//                 break;
//             }
//         }
//     }
//     if (siteIndex != selectedSiteIndex) {
//         setSelectedSiteIndex(siteIndex);
//     }
//     Tooltip.clear(sceneView.container);
//     if (siteIndex > -1) {
//         const screenPoint = sceneView.toScreen(result.mapPoint);
//         Tooltip.append(sceneView.container, screenPoint.x, screenPoint.y, 'Site ' + (siteIndex + 1));
//         sceneView.container.style.cursor = 'pointer';
//     } else {
//         sceneView.container.style.cursor = 'default';
//     }
// }

function ArcGISMap({
    height,
    buildingIds,
    onClick
}: {
    height: number;
    buildingIds: number[];
    onClick: (response: any) => void;
}) {
    const navigate = useNavigate();
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

        sceneView.on("click", function (event) {
            sceneView?.hitTest(event).then(function (response) {
                onClick(response);
            });
        });

        sceneView.on("double-click", function (event) {
            event.stopPropagation();
        });

        // sceneView.on('pointer-move', function (event) {
        //     sceneView.hitTest(event).then(function (response) {
        //         sceneView.container.style.cursor = 'default';
        //         if (sceneView.zoom >= 15 - 0.5) {
        //             updateBuildingTooltipAndCursor(
        //                 sceneView,
        //                 sceneLayer,
        //                 response,
        //                 selectedDistrictIndexRef.current - 1,
        //                 selectedSiteIndexRef.current,
        //                 setSelectedSiteIndex
        //             );
        //         } else {
        //             updateDistrictCursor(sceneView, featureLayer, response);
        //         }
        //     });
        // });

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
            uniqueValueInfos: getUniqueValueInfos(buildingIds),
            defaultSymbol: symbol("white")
        });
    }

    return <div id="viewDiv" style={{ height: height }}></div>;
}

export default ArcGISMap;
