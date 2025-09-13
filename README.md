# ARGO Conversational AI - React App

A React-based web application for exploring ARGO ocean data with interactive 3D maps, search functionality, and data visualization.

## Features

- **Home Page**: Interactive dashboard with chatbot interface and ocean trajectory visualization
- **Search Page**: Search ARGO data by location and date parameters
- **Dashboard**: Statistics panel with interactive maps and data gauges
- **3D Map**: Interactive 3D visualization using Cesium with synchronized Leaflet map and Plotly charts

## Getting Started

### Prerequisites

- Node.js (version 14 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm run build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm run eject` - Ejects from Create React App (one-way operation)

## Project Structure

```
src/
├── components/
│   ├── Home.js          # Main dashboard page
│   ├── Dashboard.js     # Statistics and maps
│   ├── Search.js        # Data search interface
│   └── Map3D.js         # 3D interactive map
├── App.js               # Main app component with routing
├── index.js             # App entry point
└── index.css            # Global styles
```

## Technologies Used

- React 18
- React Router DOM
- Leaflet (maps)
- Cesium (3D visualization)
- Plotly.js (charts)
- CSS3 with animations

## Features

### Home Page
- Interactive chatbot interface
- Animated ocean trajectory visualization
- Recent queries list
- Statistics panel
- Smooth page transitions

### Search Page
- Multi-parameter search form
- Results table display
- Map preview
- Responsive design

### Dashboard
- Interactive statistics with animated gauges
- Leaflet map with draggable markers
- Real-time data visualization

### 3D Map
- Cesium 3D globe visualization
- Synchronized Leaflet map
- Interactive Plotly 3D charts
- Basemap switching (OpenStreetMap/TopoMap)
- Click-to-place markers
- Indian Ocean focus area

## Browser Support

This application works best in modern browsers that support:
- ES6+ features
- WebGL (for 3D visualization)
- Canvas API

## Notes

- The 3D map requires WebGL support
- Cesium may require an access token for production use
- All external libraries are loaded via CDN for simplicity
