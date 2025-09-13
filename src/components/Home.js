import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [queries, setQueries] = useState([
    'Salinity profiles near equator, March 2023',
    'Temperature data for Pacific Ocean, Jan 2023',
    'Depth profiles near Atlantic, Feb 2023'
  ]);
  const [showModal, setShowModal] = useState(false);
  const [modalText, setModalText] = useState('Processing your query...');
  const canvasRef = useRef(null);

  const handleQuery = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setQueries(prev => [...prev, query]);
      setQuery('');
      setModalText(`Processing: ${query}...`);
      setShowModal(true);
      setTimeout(() => {
        setModalText('Response: Query submitted! (Awaiting backend)');
        setTimeout(() => setShowModal(false), 2000);
      }, 2000);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationId;

    const drawDataPreview = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.beginPath();
      ctx.strokeStyle = '#4aa3cc';
      ctx.lineWidth = 3;
      for (let i = 0; i < 60; i++) {
        const x = i * 6.5 + (canvas.width < 400 ? Math.sin(Date.now() * 0.001) * 20 : 0);
        const y = canvas.height - (Math.sin(i * 0.2 + Date.now() * 0.002) * 100 + 150);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
      animationId = requestAnimationFrame(drawDataPreview);
    };

    drawDataPreview();

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, []);

  const createParticle = () => {
    const particle = document.createElement('div');
    particle.className = 'particle';
    const size = Math.random() * 5 + 2;
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${Math.random() * 100}%`;
    particle.style.top = `${Math.random() * 100}%`;
    const mapPlaceholder = document.querySelector('.map-placeholder');
    if (mapPlaceholder) {
      mapPlaceholder.appendChild(particle);
      setTimeout(() => particle.remove(), 3000);
    }
  };

  const handleMapHover = () => {
    for (let i = 0; i < 5; i++) {
      setTimeout(createParticle, i * 500);
    }
  };

  return (
    <>
      <div className="header">ARGO Conversational AI – Smart Ocean Data Explorer</div>
      <div className="container">
        <div className="sidebar">
          <button onClick={() => handleNavigation('/search')}>🌊 Search ARGO Data</button>
          <button onClick={() => handleNavigation('/search')}>Compare Profiles</button>
          <button onClick={() => handleNavigation('/map')}>View Map</button>
          <button onClick={() => handleNavigation('/dashboard')}>View Dashboard</button>
        </div>
        <div className="main">
          <div className="chatbot-box">
            <form onSubmit={handleQuery}>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask me: Show me salinity profiles near the equator in March 2023"
                list="query-suggestions"
              />
              <datalist id="query-suggestions">
                <option value="Show me salinity profiles near the equator in March 2023" />
                <option value="Compare BGC parameters in the Arabian Sea" />
                <option value="What are the nearest ARGO floats to this location?" />
              </datalist>
              <button type="submit">Send</button>
            </form>
          </div>
          <div className="map-placeholder" onClick={() => handleNavigation('/map')} onMouseOver={handleMapHover}>
            Click to View Ocean Trajectories
            <div className="data-preview">
              <canvas ref={canvasRef} width={400} height={400}></canvas>
            </div>
          </div>
          <div className="stats-panel">
            <div className="stat-item">
              <h4>Active Floats</h4>
              <p>3,800</p>
            </div>
            <div className="stat-item">
              <h4>Data Coverage</h4>
              <p>85%</p>
            </div>
            <div className="stat-item">
              <h4>Profiles/Day</h4>
              <p>12,000</p>
            </div>
          </div>
          <div className="recent-queries">
            <h3>Recent Queries</h3>
            <ul>
              {queries.map((q, index) => (
                <li key={index} onClick={() => handleNavigation('/search')}>
                  {q}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <div className="footer">
        Acronyms: NetCDF - Network Common Data Format | CTD - Conductivity Temperature and Depth | BGC - Bio-Geo-Chemical Floats
      </div>
      {showModal && (
        <div className="modal show">
          <div className="modal-content">
            <div className="spinner"></div>
            <p>{modalText}</p>
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
