// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import Plotly from 'plotly.js-dist';

// const Map3D = () => {
//   const navigate = useNavigate();
//   const cesiumContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotlyChartRef = useRef(null);
//   const [basemap, setBasemap] = useState('topo');
//   const [viewer, setViewer] = useState(null);
//   const [leafletMap, setLeafletMap] = useState(null);
//   const [leafletMarker, setLeafletMarker] = useState(null);

//   // Sample bathymetry data
//   const bathyPoints = [
//     {lat: -20.0, lon: 70.0, depth: -4500},
//     {lat: -10.0, lon: 60.0, depth: -3800},
//     {lat: 0.0, lon: 80.0, depth: -5000},
//     {lat: 10.0, lon: 70.0, depth: -2200},
//     {lat: -5.0, lon: 95.0, depth: -3000},
//     {lat: 15.0, lon: 75.0, depth: -1200}
//   ];

//   // Indian Ocean GeoJSON
//   const indianOceanGeoJSON = {
//     "type": "Feature",
//     "properties": {"name":"Indian Ocean (approx)"},
//     "geometry": { 
//       "type": "Polygon", 
//       "coordinates": [[[20, -40], [110, -40], [110, 30], [20, 30], [20, -40]]] 
//     }
//   };

//   useEffect(() => {
//     let cesiumViewer = null;
//     let leafletMapInstance = null;

//     // Initialize Cesium
//     if (window.Cesium && cesiumContainerRef.current) {
//       // Clear container first
//       cesiumContainerRef.current.innerHTML = '';
      
//       // Set Cesium Ion default access token to avoid warnings
//       window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQxYWYtYjY3MC1hM2JlYjVkYjQ0YjciLCJpZCI6NTc3MzMsImlhdCI6MTYyODM0NDQ4N30.1iX9veXZqgVF_S0seQyHfQmf8irTneuaoYxZyxJ3B8Y';
      
//       try {
//         cesiumViewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
//           imageryProvider: new window.Cesium.UrlTemplateImageryProvider({ 
//             url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//             subdomains: ['a','b','c'] 
//           }),
//           baseLayerPicker: false, 
//           timeline: false, 
//           animation: false,
//           homeButton: false,
//           sceneModePicker: false,
//           navigationHelpButton: false,
//           fullscreenButton: false,
//           vrButton: false,
//           creditContainer: document.createElement('div') // Hide credits
//         });
//       } catch (error) {
//         console.error('Cesium initialization error:', error);
//         return;
//       }

//       // Force initial imagery refresh to ensure tiles load
//       setTimeout(() => {
//         try {
//           if (cesiumViewer && cesiumViewer.scene) {
//             cesiumViewer.imageryLayers.removeAll();
//             cesiumViewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
//               url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//               subdomains: ['a','b','c'] 
//             }));
//           }
//         } catch (error) {
//           console.error('Cesium imagery refresh error:', error);
//         }
//       }, 100);

//       // Add Indian Ocean polygon
//       try {
//         cesiumViewer.entities.add({
//           name: 'Indian Ocean (approx)',
//           polygon: {
//             hierarchy: window.Cesium.Cartesian3.fromDegreesArrayHeights([20,-40,0, 110,-40,0, 110,30,0, 20,30,0]),
//             material: window.Cesium.Color.BLUE.withAlpha(0.07),
//             outline: true,
//             outlineColor: window.Cesium.Color.BLUE
//           }
//         });
//       } catch (error) {
//         console.error('Error adding Indian Ocean polygon:', error);
//       }

//       setViewer(cesiumViewer);
//     }

//     // Initialize Leaflet
//     if (leafletMapRef.current) {
//       try {
//         // Clear any existing map
//         if (leafletMapRef.current._leaflet_id) {
//           leafletMapRef.current._leaflet_id = null;
//         }
        
//         leafletMapInstance = L.map(leafletMapRef.current, { worldCopyJump: true }).setView([5,75], 3);
//         const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
//         const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
        
//         satelliteLayer.addTo(leafletMapInstance);
//         L.geoJSON(indianOceanGeoJSON, { 
//           style: { color: '#0077be', weight: 2, fillOpacity: 0.02 } 
//         }).addTo(leafletMapInstance);

//         setLeafletMap(leafletMapInstance);
//       } catch (error) {
//         console.error('Leaflet initialization error:', error);
//       }
//     }

//     // Initialize Plotly
//     if (plotlyChartRef.current) {
//       try {
//         initPlotly();
//       } catch (error) {
//         console.error('Plotly initialization error:', error);
//       }
//     }

//     return () => {
//       if (cesiumViewer && cesiumViewer.scene) {
//         cesiumViewer.destroy();
//       }
//       if (leafletMapInstance) {
//         leafletMapInstance.remove();
//       }
//     };
//   }, []);

//   const initPlotly = () => {
//     try {
//       const trace = {
//         x: bathyPoints.map(p => p.lon),
//         y: bathyPoints.map(p => p.lat),
//         z: bathyPoints.map(p => p.depth),
//         mode: 'markers',
//         marker: { size: 6 },
//         type: 'scatter3d',
//         name: 'Bathymetry samples'
//       };
      
//       const layout = {
//         margin: {l:0, r:0, b:0, t:30},
//         scene: { 
//           xaxis: { title: 'Longitude' }, 
//           yaxis: { title: 'Latitude' }, 
//           zaxis: { title: 'Depth (m)', autorange: 'reversed' } 
//         },
//         title: 'Sample Bathymetry (Indian Ocean)'
//       };
      
//       Plotly.newPlot(plotlyChartRef.current, [trace], layout, {responsive: true});
//     } catch (error) {
//       console.error('Plotly plot creation error:', error);
//     }
//   };

//   const updatePlotlyMarker = (lat, lon) => {
//     try {
//       const markerTrace = { 
//         x: [lon], 
//         y: [lat], 
//         z: [0], 
//         mode: 'markers+text', 
//         marker: {size: 8}, 
//         type: 'scatter3d', 
//         name: 'Selected' 
//       };
      
//       Plotly.react(plotlyChartRef.current, [
//         { 
//           x: bathyPoints.map(p => p.lon), 
//           y: bathyPoints.map(p => p.lat), 
//           z: bathyPoints.map(p => p.depth), 
//           mode: 'markers', 
//           marker: {size: 6}, 
//           type: 'scatter3d' 
//         },
//         markerTrace
//       ], null, {responsive: true});
//     } catch (error) {
//       console.error('Plotly marker update error:', error);
//     }
//   };

//   const flyToIndianOcean = () => {
//     if (viewer) {
//       viewer.camera.flyTo({ 
//         destination: window.Cesium.Cartesian3.fromDegrees(75, -5, 2500000) 
//       });
//     }
//   };

//   const handleBasemapChange = (e) => {
//     const value = e.target.value;
//     setBasemap(value);
    
//     if (viewer && leafletMap && viewer.scene) {
//       if (value === 'osm') {
//         viewer.imageryLayers.removeAll();
//         viewer.imageryLayers.addImageryProvider(new window.Cesium.OpenStreetMapImageryProvider({
//           url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//           subdomains: ['a', 'b', 'c']
//         }));
        
//         leafletMap.eachLayer(layer => { 
//           if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
//         });
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);
//       } else {
//         viewer.imageryLayers.removeAll();
//         viewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
//           url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//           subdomains: ['a','b','c'] 
//         }));
        
//         leafletMap.eachLayer(layer => { 
//           if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
//         });
//         L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }).addTo(leafletMap);
//       }
//     }
//   };

//   const handleBackClick = () => {
//     // Clean up before navigating
//     try {
//       if (viewer) {
//         if (viewer.scene) {
//           viewer.scene.destroy();
//         }
//         if (viewer.entities) {
//           viewer.entities.removeAll();
//         }
//         if (viewer.destroy) {
//           viewer.destroy();
//         }
//       }
//       if (leafletMap) {
//         leafletMap.remove();
//       }
//     } catch (error) {
//       console.log('Cleanup error (safe to ignore):', error);
//     }
//     navigate('/');
//   };

//   // Set up click handlers after maps are initialized
//   useEffect(() => {
//     if (viewer && leafletMap && viewer.scene) {
//       // Set up Cesium click handler
//       const handler = new window.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//       handler.setInputAction(function(click) {
//         const pickedPosition = viewer.scene.pickPosition(click.position);
//         if (!pickedPosition) return;
//         const cartographic = window.Cesium.Cartographic.fromCartesian(pickedPosition);
//         const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
//         const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
        
//         viewer.entities.add({ 
//           position: window.Cesium.Cartesian3.fromDegrees(lon, lat), 
//           point: { pixelSize:10, color: window.Cesium.Color.RED } 
//         });
        
//         if (leafletMarker) {
//           leafletMap.removeLayer(leafletMarker);
//         }
//         const newMarker = L.marker([lat, lon]).addTo(leafletMap)
//           .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`)
//           .openPopup();
//         setLeafletMarker(newMarker);
//         updatePlotlyMarker(lat, lon);
//       }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

//       // Set up Leaflet click handler
//       leafletMap.on('click', function(e) {
//         const { lat, lng } = e.latlng;
//         if (viewer && viewer.scene) {
//           viewer.camera.flyTo({ 
//             destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, 2000000) 
//           });
//         }
//         if (leafletMarker) {
//           leafletMap.removeLayer(leafletMarker);
//         }
//         const newMarker = L.marker([lat, lng]).addTo(leafletMap)
//           .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`)
//           .openPopup();
//         setLeafletMarker(newMarker);
//         updatePlotlyMarker(lat, lng);
//       });

//       // Sync camera
//       const syncCamera = () => {
//         if (viewer && viewer.scene) {
//           const cartographic = window.Cesium.Cartographic.fromCartesian(viewer.camera.position);
//           const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
//           const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
//           leafletMap.setView([lat, lon], 3, { animate: false });
//         }
//       };

//       viewer.camera.changed.addEventListener(syncCamera);

//       return () => {
//         if (handler) {
//           handler.destroy();
//         }
//         if (leafletMap) {
//           leafletMap.off('click');
//         }
//         if (viewer && viewer.camera) {
//           viewer.camera.changed.removeEventListener(syncCamera);
//         }
//       };
//     }
//   }, [viewer, leafletMap, leafletMarker]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       try {
//         if (viewer) {
//           if (viewer.scene) {
//             viewer.scene.destroy();
//           }
//           if (viewer.entities) {
//             viewer.entities.removeAll();
//           }
//           if (viewer.destroy) {
//             viewer.destroy();
//           }
//         }
//         if (leafletMap) {
//           leafletMap.remove();
//         }
//       } catch (error) {
//         console.log('Cleanup error (safe to ignore):', error);
//       }
//     };
//   }, []);

//   return (
//     <>
//       <div className="header">Indian Ocean Interactive 3D Map</div>
//       <div id="app">
//         <div id="cesiumContainer" ref={cesiumContainerRef}></div>
//         <div id="side">
//           <div className="card">
//             <div className="header">
//               <h3>Controls</h3>
//             </div>
//             <div className="controls">
//               <label htmlFor="basemap">Basemap:</label>
//               <select id="basemap" value={basemap} onChange={handleBasemapChange}>
//                 <option value="osm">OpenStreetMap</option>
//                 <option value="topo">TopoMap</option>
//               </select>
//               <button onClick={flyToIndianOcean}>Fly to Indian Ocean</button>
//             </div>
//           </div>
//         <div id="leafletMap" ref={leafletMapRef} style={{height: '100%', width: '100%'}}></div>
//         <div id="plotlyChart" ref={plotlyChartRef} style={{height: '100%', width: '100%'}}></div>
//         </div>
//       </div>
//       <button className="back-button" onClick={handleBackClick} style={{position: 'fixed', top: '20px', left: '20px', zIndex: 1000}}>
//         Back to Home
//       </button>
//     </>
//   );
// };

// export default Map3D;


//second code 

// import React, { useEffect, useRef, useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import L from 'leaflet';
// import Plotly from 'plotly.js-dist';

// const Map3D = () => {
//   const navigate = useNavigate();
//   const cesiumContainerRef = useRef(null);
//   const leafletMapRef = useRef(null);
//   const plotlyChartRef = useRef(null);
//   const [basemap, setBasemap] = useState('topo');
//   const [viewer, setViewer] = useState(null);
//   const [leafletMap, setLeafletMap] = useState(null);
//   const [leafletMarker, setLeafletMarker] = useState(null);

//   // Sample bathymetry data
//   const bathyPoints = [
//     {lat: -20.0, lon: 70.0, depth: -4500},
//     {lat: -10.0, lon: 60.0, depth: -3800},
//     {lat: 0.0, lon: 80.0, depth: -5000},
//     {lat: 10.0, lon: 70.0, depth: -2200},
//     {lat: -5.0, lon: 95.0, depth: -3000},
//     {lat: 15.0, lon: 75.0, depth: -1200}
//   ];

//   // Indian Ocean GeoJSON
//   const indianOceanGeoJSON = {
//     "type": "Feature",
//     "properties": {"name":"Indian Ocean (approx)"},
//     "geometry": { 
//       "type": "Polygon", 
//       "coordinates": [[[20, -40], [110, -40], [110, 30], [20, 30], [20, -40]]] 
//     }
//   };

//   useEffect(() => {
//     let cesiumViewer = null;
//     let leafletMapInstance = null;

//     // Initialize Cesium
//     if (window.Cesium && cesiumContainerRef.current) {
//       // Clear container first
//       cesiumContainerRef.current.innerHTML = '';
      
//       // Set Cesium Ion default access token to avoid warnings
//       window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQxYWYtYjY3MC1hM2JlYjVkYjQ0YjciLCJpZCI6NTc3MzMsImlhdCI6MTYyODM0NDQ4N30.1iX9veXZqgVF_S0seQyHfQmf8irTneuaoYxZyxJ3B8Y';
      
//       try {
//         cesiumViewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
//           imageryProvider: new window.Cesium.UrlTemplateImageryProvider({ 
//             url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//             subdomains: ['a','b','c'] 
//           }),
//           baseLayerPicker: false, 
//           timeline: false, 
//           animation: false,
//           homeButton: false,
//           sceneModePicker: false,
//           navigationHelpButton: false,
//           fullscreenButton: false,
//           vrButton: false,
//           creditContainer: document.createElement('div') // Hide credits
//         });
//       } catch (error) {
//         console.error('Cesium initialization error:', error);
//         return;
//       }

//       // Force initial imagery refresh to ensure tiles load
//       setTimeout(() => {
//         try {
//           if (cesiumViewer && cesiumViewer.scene) {
//             cesiumViewer.imageryLayers.removeAll();
//             cesiumViewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
//               url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//               subdomains: ['a','b','c'] 
//             }));
//           }
//         } catch (error) {
//           console.error('Cesium imagery refresh error:', error);
//         }
//       }, 100);

//       // Add Indian Ocean polygon
//       try {
//         cesiumViewer.entities.add({
//           name: 'Indian Ocean (approx)',
//           polygon: {
//             hierarchy: window.Cesium.Cartesian3.fromDegreesArrayHeights([20,-40,0, 110,-40,0, 110,30,0, 20,30,0]),
//             material: window.Cesium.Color.BLUE.withAlpha(0.07),
//             outline: true,
//             outlineColor: window.Cesium.Color.BLUE
//           }
//         });
//       } catch (error) {
//         console.error('Error adding Indian Ocean polygon:', error);
//       }

//       setViewer(cesiumViewer);
//     }

//     // Initialize Leaflet
//     if (leafletMapRef.current) {
//       try {
//         // Clear any existing map
//         if (leafletMapRef.current._leaflet_id) {
//           leafletMapRef.current._leaflet_id = null;
//         }
        
//         leafletMapInstance = L.map(leafletMapRef.current, { worldCopyJump: true }).setView([5,75], 3);
//         const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
//         const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
        
//         satelliteLayer.addTo(leafletMapInstance);
//         L.geoJSON(indianOceanGeoJSON, { 
//           style: { color: '#0077be', weight: 2, fillOpacity: 0.02 } 
//         }).addTo(leafletMapInstance);

//         setLeafletMap(leafletMapInstance);
//       } catch (error) {
//         console.error('Leaflet initialization error:', error);
//       }
//     }

//     // Initialize Plotly
//     if (plotlyChartRef.current) {
//       try {
//         initPlotly();
//       } catch (error) {
//         console.error('Plotly initialization error:', error);
//       }
//     }

//     return () => {
//       if (cesiumViewer && cesiumViewer.scene) {
//         cesiumViewer.destroy();
//       }
//       if (leafletMapInstance) {
//         leafletMapInstance.remove();
//       }
//     };
//   }, []);

//   const initPlotly = () => {
//     try {
//       const trace = {
//         x: bathyPoints.map(p => p.lon),
//         y: bathyPoints.map(p => p.lat),
//         z: bathyPoints.map(p => p.depth),
//         mode: 'markers',
//         marker: { size: 6 },
//         type: 'scatter3d',
//         name: 'Bathymetry samples'
//       };
      
//       const layout = {
//         margin: {l:0, r:0, b:0, t:30},
//         scene: { 
//           xaxis: { title: 'Longitude' }, 
//           yaxis: { title: 'Latitude' }, 
//           zaxis: { title: 'Depth (m)', autorange: 'reversed' } 
//         },
//         title: 'Sample Bathymetry (Indian Ocean)'
//       };
      
//       Plotly.newPlot(plotlyChartRef.current, [trace], layout, {responsive: true});
//     } catch (error) {
//       console.error('Plotly plot creation error:', error);
//     }
//   };

//   const updatePlotlyMarker = (lat, lon) => {
//     try {
//       const markerTrace = { 
//         x: [lon], 
//         y: [lat], 
//         z: [0], 
//         mode: 'markers+text', 
//         marker: {size: 8}, 
//         type: 'scatter3d', 
//         name: 'Selected' 
//       };
      
//       Plotly.react(plotlyChartRef.current, [
//         { 
//           x: bathyPoints.map(p => p.lon), 
//           y: bathyPoints.map(p => p.lat), 
//           z: bathyPoints.map(p => p.depth), 
//           mode: 'markers', 
//           marker: {size: 6}, 
//           type: 'scatter3d' 
//         },
//         markerTrace
//       ], null, {responsive: true});
//     } catch (error) {
//       console.error('Plotly marker update error:', error);
//     }
//   };

//   const flyToIndianOcean = () => {
//     if (viewer) {
//       viewer.camera.flyTo({ 
//         destination: window.Cesium.Cartesian3.fromDegrees(75, -5, 2500000) 
//       });
//     }
//   };

//   const handleBasemapChange = (e) => {
//     const value = e.target.value;
//     setBasemap(value);
    
//     if (viewer && leafletMap && viewer.scene) {
//       if (value === 'osm') {
//         viewer.imageryLayers.removeAll();
//         viewer.imageryLayers.addImageryProvider(new window.Cesium.OpenStreetMapImageryProvider({
//           url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
//           subdomains: ['a', 'b', 'c']
//         }));
        
//         leafletMap.eachLayer(layer => { 
//           if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
//         });
//         L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);
//       } else {
//         viewer.imageryLayers.removeAll();
//         viewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
//           url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
//           subdomains: ['a','b','c'] 
//         }));
        
//         leafletMap.eachLayer(layer => { 
//           if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
//         });
//         L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }).addTo(leafletMap);
//       }
//     }
//   };

//   const handleBackClick = () => {
//     // Safe cleanup before navigating
//     try {
//       if (viewer) {
//         if (viewer.scene) {
//           viewer.scene.destroy();
//         }
//         if (viewer.entities) {
//           viewer.entities.removeAll();
//         }
//         if (viewer.destroy) {
//           viewer.destroy();
//         }
//       }
//       if (leafletMap) {
//         leafletMap.remove();
//       }
//     } catch (error) {
//       console.log('Cleanup error (safe to ignore):', error);
//     }
//     // Defer navigation to ensure cleanup completes
//     setTimeout(() => {
//       navigate('/');
//     }, 0);
//   };

//   // Set up click handlers after maps are initialized
//   useEffect(() => {
//     if (viewer && leafletMap && viewer.scene) {
//       // Set up Cesium click handler
//       const handler = new window.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
//       handler.setInputAction(function(click) {
//         const pickedPosition = viewer.scene.pickPosition(click.position);
//         if (!pickedPosition) return;
//         const cartographic = window.Cesium.Cartographic.fromCartesian(pickedPosition);
//         const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
//         const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
        
//         viewer.entities.add({ 
//           position: window.Cesium.Cartesian3.fromDegrees(lon, lat), 
//           point: { pixelSize:10, color: window.Cesium.Color.RED } 
//         });
        
//         if (leafletMarker) {
//           leafletMap.removeLayer(leafletMarker);
//         }
//         const newMarker = L.marker([lat, lon]).addTo(leafletMap)
//           .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`)
//           .openPopup();
//         setLeafletMarker(newMarker);
//         updatePlotlyMarker(lat, lon);
//       }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

//       // Set up Leaflet click handler
//       leafletMap.on('click', function(e) {
//         const { lat, lng } = e.latlng;
//         if (viewer && viewer.scene) {
//           viewer.camera.flyTo({ 
//             destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, 2000000) 
//           });
//         }
//         if (leafletMarker) {
//           leafletMap.removeLayer(leafletMarker);
//         }
//         const newMarker = L.marker([lat, lng]).addTo(leafletMap)
//           .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`)
//           .openPopup();
//         setLeafletMarker(newMarker);
//         updatePlotlyMarker(lat, lng);
//       });

//       // Sync camera
//       const syncCamera = () => {
//         if (viewer && viewer.scene) {
//           const cartographic = window.Cesium.Cartographic.fromCartesian(viewer.camera.position);
//           const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
//           const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
//           leafletMap.setView([lat, lon], 3, { animate: false });
//         }
//       };

//       viewer.camera.changed.addEventListener(syncCamera);

//       return () => {
//         if (handler) {
//           handler.destroy();
//         }
//         if (leafletMap) {
//           leafletMap.off('click');
//         }
//         if (viewer && viewer.camera) {
//           viewer.camera.changed.removeEventListener(syncCamera);
//         }
//       };
//     }
//   }, [viewer, leafletMap, leafletMarker]);

//   // Cleanup on unmount
//   useEffect(() => {
//     return () => {
//       try {
//         if (viewer) {
//           if (viewer.scene) {
//             viewer.scene.destroy();
//           }
//           if (viewer.entities) {
//             viewer.entities.removeAll();
//           }
//           if (viewer.destroy) {
//             viewer.destroy();
//           }
//         }
//         if (leafletMap) {
//           leafletMap.remove();
//         }
//       } catch (error) {
//         console.log('Cleanup error (safe to ignore):', error);
//       }
//     };
//   }, []);

//   return (
//     <>
//       <div className="header">Indian Ocean Interactive 3D Map</div>
//       <div id="app">
//         <div id="cesiumContainer" ref={cesiumContainerRef}></div>
//         <div id="side">
//           <div className="card">
//             <div className="header">
//               <h3>Controls</h3>
//             </div>
//             <div className="controls">
//               <label htmlFor="basemap">Basemap:</label>
//               <select id="basemap" value={basemap} onChange={handleBasemapChange}>
//                 <option value="osm">OpenStreetMap</option>
//                 <option value="topo">TopoMap</option>
//               </select>
//               <button onClick={flyToIndianOcean}>Fly to Indian Ocean</button>
//             </div>
//           </div>
//         <div id="leafletMap" ref={leafletMapRef} style={{height: '100%', width: '100%'}}></div>
//         <div id="plotlyChart" ref={plotlyChartRef} style={{height: '100%', width: '100%'}}></div>
//         </div>
//       </div>
//       <button className="back-button" onClick={handleBackClick} style={{position: 'fixed', top: '20px', left: '20px', zIndex: 1000}}>
//         Back to Home
//       </button>
//     </>
//   );
// };

// export default Map3D;


//third code 


import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';
import Plotly from 'plotly.js-dist';

const Map3D = () => {
  const navigate = useNavigate();
  const cesiumContainerRef = useRef(null);
  const leafletMapRef = useRef(null);
  const plotlyChartRef = useRef(null);
  const [basemap, setBasemap] = useState('topo');
  const [viewer, setViewer] = useState(null);
  const [leafletMap, setLeafletMap] = useState(null);
  const [leafletMarker, setLeafletMarker] = useState(null);

  // Sample bathymetry data
  const bathyPoints = [
    {lat: -20.0, lon: 70.0, depth: -4500},
    {lat: -10.0, lon: 60.0, depth: -3800},
    {lat: 0.0, lon: 80.0, depth: -5000},
    {lat: 10.0, lon: 70.0, depth: -2200},
    {lat: -5.0, lon: 95.0, depth: -3000},
    {lat: 15.0, lon: 75.0, depth: -1200}
  ];

  // Indian Ocean GeoJSON
  const indianOceanGeoJSON = {
    "type": "Feature",
    "properties": {"name":"Indian Ocean (approx)"},
    "geometry": { 
      "type": "Polygon", 
      "coordinates": [[[20, -40], [110, -40], [110, 30], [20, 30], [20, -40]]] 
    }
  };

  useEffect(() => {
    let cesiumViewer = null;
    let leafletMapInstance = null;

    // Initialize Cesium
    if (window.Cesium && cesiumContainerRef.current) {
      // Clear container first
      cesiumContainerRef.current.innerHTML = '';
      
      // Set Cesium Ion default access token to avoid warnings
      window.Cesium.Ion.defaultAccessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlYWE1OWUxNy1mMWZiLTQxYWYtYjY3MC1hM2JlYjVkYjQ0YjciLCJpZCI6NTc3MzMsImlhdCI6MTYyODM0NDQ4N30.1iX9veXZqgVF_S0seQyHfQmf8irTneuaoYxZyxJ3B8Y';
      
      try {
        cesiumViewer = new window.Cesium.Viewer(cesiumContainerRef.current, {
          imageryProvider: new window.Cesium.UrlTemplateImageryProvider({ 
            url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
            subdomains: ['a','b','c'] 
          }),
          baseLayerPicker: false, 
          timeline: false, 
          animation: false,
          homeButton: false,
          sceneModePicker: false,
          navigationHelpButton: false,
          fullscreenButton: false,
          vrButton: false,
          creditContainer: document.createElement('div') // Hide credits
        });
      } catch (error) {
        console.error('Cesium initialization error:', error);
        return;
      }

      // Force initial imagery refresh to ensure tiles load
      setTimeout(() => {
        try {
          if (cesiumViewer && cesiumViewer.scene) {
            cesiumViewer.imageryLayers.removeAll();
            cesiumViewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
              url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
              subdomains: ['a','b','c'] 
            }));
          }
        } catch (error) {
          console.error('Cesium imagery refresh error:', error);
        }
      }, 100);

      // Add Indian Ocean polygon
      try {
        cesiumViewer.entities.add({
          name: 'Indian Ocean (approx)',
          polygon: {
            hierarchy: window.Cesium.Cartesian3.fromDegreesArrayHeights([20,-40,0, 110,-40,0, 110,30,0, 20,30,0]),
            material: window.Cesium.Color.BLUE.withAlpha(0.07),
            outline: true,
            outlineColor: window.Cesium.Color.BLUE
          }
        });
      } catch (error) {
        console.error('Error adding Indian Ocean polygon:', error);
      }

      setViewer(cesiumViewer);
    }

    // Initialize Leaflet
    if (leafletMapRef.current) {
      try {
        // Clear any existing map
        if (leafletMapRef.current._leaflet_id) {
          leafletMapRef.current._leaflet_id = null;
        }
        
        leafletMapInstance = L.map(leafletMapRef.current, { worldCopyJump: true }).setView([5,75], 3);
        const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 });
        const satelliteLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 });
        
        satelliteLayer.addTo(leafletMapInstance);
        L.geoJSON(indianOceanGeoJSON, { 
          style: { color: '#0077be', weight: 2, fillOpacity: 0.02 } 
        }).addTo(leafletMapInstance);

        setLeafletMap(leafletMapInstance);
      } catch (error) {
        console.error('Leaflet initialization error:', error);
      }
    }

    // Initialize Plotly
    if (plotlyChartRef.current) {
      try {
        initPlotly();
      } catch (error) {
        console.error('Plotly initialization error:', error);
      }
    }

    return () => {
      if (cesiumViewer && cesiumViewer.scene) {
        cesiumViewer.destroy();
      }
      if (leafletMapInstance) {
        leafletMapInstance.remove();
      }
    };
  }, []);

  const initPlotly = () => {
    try {
      const trace = {
        x: bathyPoints.map(p => p.lon),
        y: bathyPoints.map(p => p.lat),
        z: bathyPoints.map(p => p.depth),
        mode: 'markers',
        marker: { size: 6 },
        type: 'scatter3d',
        name: 'Bathymetry samples'
      };
      
      const layout = {
        margin: {l:0, r:0, b:0, t:30},
        scene: { 
          xaxis: { title: 'Longitude' }, 
          yaxis: { title: 'Latitude' }, 
          zaxis: { title: 'Depth (m)', autorange: 'reversed' } 
        },
        title: 'Sample Bathymetry (Indian Ocean)'
      };
      
      Plotly.newPlot(plotlyChartRef.current, [trace], layout, {responsive: true});
    } catch (error) {
      console.error('Plotly plot creation error:', error);
    }
  };

  const updatePlotlyMarker = (lat, lon) => {
    try {
      const markerTrace = { 
        x: [lon], 
        y: [lat], 
        z: [0], 
        mode: 'markers+text', 
        marker: {size: 8}, 
        type: 'scatter3d', 
        name: 'Selected' 
      };
      
      Plotly.react(plotlyChartRef.current, [
        { 
          x: bathyPoints.map(p => p.lon), 
          y: bathyPoints.map(p => p.lat), 
          z: bathyPoints.map(p => p.depth), 
          mode: 'markers', 
          marker: {size: 6}, 
          type: 'scatter3d' 
        },
        markerTrace
      ], null, {responsive: true});
    } catch (error) {
      console.error('Plotly marker update error:', error);
    }
  };

  const flyToIndianOcean = () => {
    if (viewer) {
      viewer.camera.flyTo({ 
        destination: window.Cesium.Cartesian3.fromDegrees(75, -5, 2500000) 
      });
    }
  };

  const handleBasemapChange = (e) => {
    const value = e.target.value;
    setBasemap(value);
    
    if (viewer && leafletMap && viewer.scene) {
      if (value === 'osm') {
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(new window.Cesium.OpenStreetMapImageryProvider({
          url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          subdomains: ['a', 'b', 'c']
        }));
        
        leafletMap.eachLayer(layer => { 
          if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
        });
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { maxZoom: 19 }).addTo(leafletMap);
      } else {
        viewer.imageryLayers.removeAll();
        viewer.imageryLayers.addImageryProvider(new window.Cesium.UrlTemplateImageryProvider({ 
          url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', 
          subdomains: ['a','b','c'] 
        }));
        
        leafletMap.eachLayer(layer => { 
          if (layer instanceof L.TileLayer) leafletMap.removeLayer(layer); 
        });
        L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', { maxZoom: 17 }).addTo(leafletMap);
      }
    }
  };

  const handleBackClick = () => {
    // Safe and sequential cleanup before navigating
    let cleanupComplete = false;
    try {
      if (viewer) {
        if (viewer.scene) {
          viewer.scene.destroy();
        }
        if (viewer.entities) {
          viewer.entities.removeAll();
        }
        if (viewer.destroy) {
          viewer.destroy();
        }
        setViewer(null); // Explicitly clear the state
      }
      if (leafletMap) {
        leafletMap.remove();
        setLeafletMap(null); // Explicitly clear the state
      }
      cleanupComplete = true;
    } catch (error) {
      console.log('Cleanup error (safe to ignore):', error);
      cleanupComplete = true; // Proceed even if cleanup fails
    }
    // Navigate only after cleanup is attempted
    if (cleanupComplete) {
      setTimeout(() => {
        navigate('/');
      }, 100); // Slight delay to ensure DOM updates
    }
  };

  // Set up click handlers after maps are initialized
  useEffect(() => {
    if (viewer && leafletMap && viewer.scene) {
      // Set up Cesium click handler
      const handler = new window.Cesium.ScreenSpaceEventHandler(viewer.scene.canvas);
      handler.setInputAction(function(click) {
        const pickedPosition = viewer.scene.pickPosition(click.position);
        if (!pickedPosition) return;
        const cartographic = window.Cesium.Cartographic.fromCartesian(pickedPosition);
        const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
        const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
        
        viewer.entities.add({ 
          position: window.Cesium.Cartesian3.fromDegrees(lon, lat), 
          point: { pixelSize:10, color: window.Cesium.Color.RED } 
        });
        
        if (leafletMarker) {
          leafletMap.removeLayer(leafletMarker);
        }
        const newMarker = L.marker([lat, lon]).addTo(leafletMap)
          .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lon.toFixed(4)}`)
          .openPopup();
        setLeafletMarker(newMarker);
        updatePlotlyMarker(lat, lon);
      }, window.Cesium.ScreenSpaceEventType.LEFT_CLICK);

      // Set up Leaflet click handler
      leafletMap.on('click', function(e) {
        const { lat, lng } = e.latlng;
        if (viewer && viewer.scene) {
          viewer.camera.flyTo({ 
            destination: window.Cesium.Cartesian3.fromDegrees(lng, lat, 2000000) 
          });
        }
        if (leafletMarker) {
          leafletMap.removeLayer(leafletMarker);
        }
        const newMarker = L.marker([lat, lng]).addTo(leafletMap)
          .bindPopup(`Lat: ${lat.toFixed(4)}, Lon: ${lng.toFixed(4)}`)
          .openPopup();
        setLeafletMarker(newMarker);
        updatePlotlyMarker(lat, lng);
      });

      // Sync camera
      const syncCamera = () => {
        if (viewer && viewer.scene) {
          const cartographic = window.Cesium.Cartographic.fromCartesian(viewer.camera.position);
          const lon = window.Cesium.Math.toDegrees(cartographic.longitude);
          const lat = window.Cesium.Math.toDegrees(cartographic.latitude);
          leafletMap.setView([lat, lon], 3, { animate: false });
        }
      };

      viewer.camera.changed.addEventListener(syncCamera);

      return () => {
        if (handler) {
          handler.destroy();
        }
        if (leafletMap) {
          leafletMap.off('click');
        }
        if (viewer && viewer.camera) {
          viewer.camera.changed.removeEventListener(syncCamera);
        }
      };
    }
  }, [viewer, leafletMap, leafletMarker]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      try {
        if (viewer) {
          if (viewer.scene) {
            viewer.scene.destroy();
          }
          if (viewer.entities) {
            viewer.entities.removeAll();
          }
          if (viewer.destroy) {
            viewer.destroy();
          }
        }
        if (leafletMap) {
          leafletMap.remove();
        }
      } catch (error) {
        console.log('Cleanup error (safe to ignore):', error);
      }
    };
  }, []);

  return (
    <>
      <div className="header">Indian Ocean Interactive 3D Map</div>
      <div id="app">
        <div id="cesiumContainer" ref={cesiumContainerRef}></div>
        <div id="side">
          <div className="card">
            <div className="header">
              <h3>Controls</h3>
            </div>
            <div className="controls">
              <label htmlFor="basemap">Basemap:</label>
              <select id="basemap" value={basemap} onChange={handleBasemapChange}>
                <option value="osm">OpenStreetMap</option>
                <option value="topo">TopoMap</option>
              </select>
              <button onClick={flyToIndianOcean}>Fly to Indian Ocean</button>
            </div>
          </div>
        <div id="leafletMap" ref={leafletMapRef} style={{height: '100%', width: '100%'}}></div>
        <div id="plotlyChart" ref={plotlyChartRef} style={{height: '100%', width: '100%'}}></div>
        </div>
      </div>
      <button className="back-button" onClick={handleBackClick} style={{position: 'fixed', top: '20px', left: '20px', zIndex: 1000}}>
        Back to Home
      </button>
    </>
  );
};

export default Map3D;