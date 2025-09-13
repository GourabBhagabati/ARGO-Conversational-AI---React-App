import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import L from 'leaflet';

const Dashboard = () => {
  const navigate = useNavigate();
  const mapRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      // Clear any existing map completely
      if (mapRef.current._leaflet_id) {
        mapRef.current._leaflet_id = null;
      }
      
      // Clear the container content
      mapRef.current.innerHTML = '';
      
      // Wait for the container to be ready
      setTimeout(() => {
        if (mapRef.current && !mapRef.current._leaflet_id) {
          try {
            // Initialize Leaflet map
            const map = L.map(mapRef.current).setView([5, 75], 3);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', { 
              maxZoom: 19 
            }).addTo(map);
            
            // Add sample markers
            L.marker([5, 75]).addTo(map).bindPopup('Sample Float').openPopup();
            L.marker([10, 70]).addTo(map).bindPopup('Sample Float').openPopup();

            // Draggable marker
            const draggableMarker = L.marker([0, 80], { draggable: true }).addTo(map);
            draggableMarker.on('dragend', function(e) {
              const latlng = e.target.getLatLng();
              alert(`Moved to: Lat ${latlng.lat.toFixed(2)}, Lon ${latlng.lng.toFixed(2)}`);
            });

            mapInstanceRef.current = map;
          } catch (error) {
            console.error('Leaflet map initialization error:', error);
          }
        }
      }, 200);
    }

    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Leaflet map cleanup error:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Additional cleanup effect
  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        try {
          mapInstanceRef.current.remove();
        } catch (error) {
          console.error('Map cleanup error on unmount:', error);
        }
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const handleBackClick = () => {
    // Clean up map before navigating
    if (mapInstanceRef.current) {
      try {
        mapInstanceRef.current.remove();
      } catch (error) {
        console.error('Map cleanup error:', error);
      }
      mapInstanceRef.current = null;
    }
    navigate('/');
  };

  return (
    <>
      <div className="header">ARGO Conversational AI – Dashboard</div>
      <div className="container">
        <div className="stats-panel">
          <div className="stat-item">
            <h4>Active Floats</h4>
            <div className="gauge">
              <div className="gauge-fill" style={{width: '75%'}}></div>
            </div>
            <p>3,800</p>
          </div>
          <div className="stat-item">
            <h4>Data Coverage</h4>
            <div className="gauge">
              <div className="gauge-fill" style={{width: '85%'}}></div>
            </div>
            <p>85%</p>
          </div>
          <div className="stat-item">
            <h4>Profiles/Day</h4>
            <div className="gauge">
              <div className="gauge-fill" style={{width: '60%'}}></div>
            </div>
            <p>12,000</p>
          </div>
        </div>
        <div className="mini-map">
          <div ref={mapRef}></div>
        </div>
        <button className="back-button" onClick={handleBackClick}>
          Back to Home
        </button>
      </div>
      <div className="footer">
        Acronyms: NetCDF - Network Common Data Format | CTD - Conductivity Temperature and Depth | BGC - Bio-Geo-Chemical Floats
      </div>
    </>
  );
};

export default Dashboard;
