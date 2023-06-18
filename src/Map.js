import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import scriptLoader from 'react-async-script-loader';
import axios from 'axios';

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const Map = ({ isScriptLoaded, isScriptLoadSucceed, isActive }) => {
  const [map, setMap] = useState(null);
  const [coordinatePoints, setCoordinatePoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [options, setOptions] = useState([]);
  const [selectedOptions, setSelectedOptions] = useState([]);

  useEffect(() => {
    if (isScriptLoaded && isScriptLoadSucceed && isActive) {
      const fetchCoordinatePoints = async () => {
        try {
          const points = [];

          for (const option of selectedOptions) {
            const response = await axios.get(`${process.env.REACT_APP_HOST_BACKEND}/fetchCoordinates?category=${option}`);
            points.push(...response.data);
          }

          setCoordinatePoints(points);
        } catch (error) {
          console.error('Error fetching coordinate points:', error);
        }
      };

      const fetchOptions = async () => {
        try {
          const response = await axios.get(`${process.env.REACT_APP_HOST_BACKEND}/fetchOptions`);
          setOptions(response.data);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };

      fetchCoordinatePoints();
      if (options.length === 0) fetchOptions();
    }
  }, [isScriptLoaded, isScriptLoadSucceed, isActive, selectedOptions]);

  const handleRadio = (e) => {
    const optionValue = e.target.value;
    const selectedOptionIndex = selectedOptions.indexOf(optionValue);

    if (selectedOptionIndex === -1) {
      setSelectedOptions((prevSelectedOptions) => [...prevSelectedOptions, optionValue]);
    } else {
      setSelectedOptions((prevSelectedOptions) =>
        prevSelectedOptions.filter((option) => option !== optionValue)
      );
    }
  };

  const handleReset = () => {
    setSelectedOptions([]);
    setCoordinatePoints([]);
    setSelectedPoint(null);
  };

  const handleMapLoad = (map) => {
    setMap(map);
  };

  const handleMarkerClick = (point) => {
    setSelectedPoint(point);
  };

  const handleInfoWindowClose = () => {
    setSelectedPoint(null);
  };

  return (
    <div className={`map-container ${isActive ? 'active' : ''}`} style={{ height: '100vh' }}>
      <header className="map-header" style={{ fontSize: '20px', padding: '10px' }}>
        Map
      </header>
      <div className="map-content" style={{ display: 'flex' }}>
        <div className="map-sidebar" style={{ backgroundColor: '#f5f5f5', padding: '20px' }}>
          <h2>Options</h2>
          {options.map((opt) => (
            <div key={opt.id} style={{ marginBottom: '10px' }}>
              <label>
                <input
                  type="checkbox"
                  value={opt.value}
                  checked={selectedOptions.includes(opt.value)}
                  onChange={handleRadio}
                  disabled={selectedOptions.includes(opt.value)}
                  style={{ marginRight: '5px' }}
                />
                {opt.label}
              </label>
            </div>
          ))}
          <button
            type="button"
            onClick={handleReset}
            style={{
              padding: '10px',
              backgroundColor: '#f44336',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              marginTop: '20px',
              cursor: 'pointer',
            }}
          >
            Reset
          </button>
        </div>
        {isActive && isScriptLoaded && isScriptLoadSucceed && (
          <div className="map" style={{ height: '100%', width: '100%', position: 'relative' }}>
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={5}
              onLoad={handleMapLoad}
            >
              {coordinatePoints.map((point) => (
                <Marker
                  key={point.id}
                  position={{ lat: point.latitude, lng: point.longitude }}
                  icon={{
                    path: window.google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
                    scale: 6,
                    fillColor: 'red',
                    fillOpacity: 1,
                    strokeWeight: 1,
                  }}
                  onClick={() => handleMarkerClick(point)}
                />
              ))}

              {selectedPoint && (
                <InfoWindow
                  position={{ lat: selectedPoint.latitude, lng: selectedPoint.longitude }}
                  onCloseClick={handleInfoWindowClose}
                >
                  <div className="info-window">
                    <h3>{selectedPoint.name}</h3>
                    <p>{selectedPoint.description}</p>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          </div>
        )}
      </div>
    </div>
  );
};

export default scriptLoader([
  `https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_KEY}&libraries=places`,
])(Map);