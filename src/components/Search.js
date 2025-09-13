import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Search = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    lat: '',
    lon: '',
    date: ''
  });

  const handleSearch = (e) => {
    e.preventDefault();
    const { lat, lon, date } = searchParams;
    alert(`Searching: Lat ${lat}, Lon ${lon}, Date ${date}`);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <>
      <div className="header">ARGO Conversational AI – Search Data</div>
      <div className="container">
        <div className="search-box">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              name="lat"
              value={searchParams.lat}
              onChange={handleInputChange}
              placeholder="Latitude"
            />
            <input
              type="text"
              name="lon"
              value={searchParams.lon}
              onChange={handleInputChange}
              placeholder="Longitude"
            />
            <input
              type="text"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              placeholder="Date (YYYY-MM)"
            />
            <button type="submit">Search</button>
          </form>
        </div>
        <div className="results">
          <table>
            <thead>
              <tr>
                <th>Float ID</th>
                <th>Lat</th>
                <th>Lon</th>
                <th>Date</th>
                <th>Depth</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Float001</td>
                <td>5.0</td>
                <td>75.0</td>
                <td>2023-03</td>
                <td>-2000m</td>
              </tr>
              <tr>
                <td>Float002</td>
                <td>10.0</td>
                <td>70.0</td>
                <td>2023-03</td>
                <td>-1500m</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="map-preview"></div>
        <button className="back-button" onClick={handleBackClick}>
          Back to Home
        </button>
      </div>
    </>
  );
};

export default Search;
