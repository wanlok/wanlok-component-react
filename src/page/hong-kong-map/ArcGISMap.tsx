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

import './ArcGISMap.css';
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

// function getUniqueValueInfos(selectedDistrictIndex: number, selectedSiteIndex: number) {
//     var uniqueValueInfos: any[] = [];
//     for (var i = 0; i < Districts.length; i++) {
//         for (var j = 0; j < Districts[i].sites.length; j++) {
//             for (var k = 0; k < Districts[i].sites[j].building_ids.length; k++) {
//                 uniqueValueInfos.push({
//                     value: Districts[i].sites[j].building_ids[k],
//                     symbol: symbol(i === selectedDistrictIndex ? (j === selectedSiteIndex ? '#0094FF' : '#00F0FF') : 'white')
//                 });
//             }
//         }
//     }
//     return uniqueValueInfos;
// }

function getSelectedDistrictIndex(
    response: any,
    districtMap: { [key: string]: number }
) {
    var selectedDistrictIndex = -1;
    if (response.results.length > 0) {
        for (var i = 0; i < response.results.length; i++) {
            const attributes = response.results[i].graphic.attributes;
            if (attributes != null) {
                if (attributes["ENAME"] != null) {
                    selectedDistrictIndex = districtMap[attributes["ENAME"]];
                }
            }
        }
    }
    return selectedDistrictIndex;
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

function updateDistrictCursor(
    sceneView: SceneView,
    featureLayer: FeatureLayer,
    response: any
) {
    sceneView.graphics.removeAll();
    const result = response.results.filter(function (result: any) {
        return result.graphic != null && result.graphic.layer === featureLayer;
    })[0];
    if (result != null) {
        const dummy: any = {
            geometry: result.graphic.geometry,
            symbol: new SimpleFillSymbol({
                color: "rgba(0, 0, 0, 0.5)",
                outline: new SimpleLineSymbol({
                    color: "black",
                    width: 1
                })
            })
        };
        sceneView.graphics.add(dummy);
        sceneView.container.style.cursor = "pointer";
    }
}

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
    height
}: {
    // selectedDistrictIndex: number;
    // setSelectedDistrictIndex: Dispatch<SetStateAction<number>>;
    // selectedSiteIndex: number;
    // setSelectedSiteIndex: Dispatch<SetStateAction<number>>;
    height: number;
}) {
    const navigate = useNavigate();
    // const selectedDistrictIndexRef = useRef(selectedDistrictIndex);
    // const selectedSiteIndexRef = useRef(selectedSiteIndex);

    // useEffect(() => {
    //     selectedDistrictIndexRef.current = selectedDistrictIndex;
    // }, [selectedDistrictIndex]);

    // useEffect(() => {
    //     selectedSiteIndexRef.current = selectedSiteIndex;
    // }, [selectedSiteIndex]);

    const [sceneView, setSceneView] = useState<SceneView>();
    const [sceneLayer, setSceneLayer] = useState<SceneLayer>();
    const [districtExtents, setDistrictExtents] = useState<{
        [key: string]: Extent;
    }>();

    // const districtMap: { [key: string]: number } = {};
    // for (var i = 0; i < Districts.length; i++) {
    //     districtMap[Districts[i]['name'].toUpperCase()] = i + 1;
    // }

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

        var query = featureLayer.createQuery();
        query.outFields = ["*"];
        query.returnGeometry = true;
        featureLayer
            .queryFeatures(query)
            .then(function (results) {
                var extents: { [key: string]: Extent } = {};
                for (var i = 0; i < results.features.length; i++) {
                    const feature = results.features[i];
                    extents[feature.attributes["ENAME"]] =
                        feature.geometry.extent;
                }
                setDistrictExtents(extents);
            })
            .catch(() => {});

        sceneView.on("click", function (event) {
            // const center = sceneView.center;
            // console.log(center.latitude, center.longitude);
            // sceneView?.hitTest(event).then(function (response) {
            //     const selectedSiteIndex = getSelectedSiteIndex(response, selectedDistrictIndexRef.current - 1);
            //     if (selectedSiteIndex > -1) {
            //         // setSelectedSiteIndex(selectedSiteIndex === selectedSiteIndexRef.current ? -1 : selectedSiteIndex);
            //         navigate(`/floor-plan?district=${selectedDistrictIndexRef.current - 1}&site=${selectedSiteIndex}`);
            //     } else {
            //         const selectedDistrictIndex = getSelectedDistrictIndex(response, districtMap);
            //         if (selectedDistrictIndex > -1) {
            //             setSelectedSiteIndex(-1);
            //             setSelectedDistrictIndex(selectedDistrictIndex);
            //         }
            //     }
            // });
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

        sceneView.watch("zoom", function (newValue, oldValue, propertyName) {
            if (newValue >= 15 - 0.5) {
                sceneView.graphics.removeAll();
            }
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

    if (sceneView != null && districtExtents != null && sceneLayer != null) {
        //     if (selectedDistrictIndex === 0) {
        //         sceneView.goTo(initialLocation);
        //     } else if (selectedDistrictIndex != selectedDistrictIndexRef.current) {
        //         const selectedDistrict = Districts[selectedDistrictIndex - 1];
        //         const key = selectedDistrict.name.toUpperCase();
        //         if (selectedDistrict.center === undefined) {
        //             sceneView.goTo({
        //                 target: districtExtents[key],
        //                 zoom: 15,
        //                 tilt: 45
        //             });
        //         } else {
        //             sceneView.goTo({
        //                 center: [selectedDistrict.center.latitude, selectedDistrict.center.longitude],
        //                 zoom: 15,
        //                 tilt: 45
        //             });
        //         }
        //     }
        sceneLayer.renderer = new UniqueValueRenderer({
            field: "BUILDINGID",
            // uniqueValueInfos: getUniqueValueInfos(selectedDistrictIndex - 1, selectedSiteIndex),
            defaultSymbol: symbol("white")
        });
    }

    return <div id="viewDiv" style={{ height: height }}></div>;
}

export default ArcGISMap;
