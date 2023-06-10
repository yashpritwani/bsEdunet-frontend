import React, { useState, useEffect } from 'react';
import { GoogleMap, Marker, InfoWindow } from '@react-google-maps/api';
import scriptLoader from 'react-async-script-loader';
// import {MAP_KEY} from process.env;

const containerStyle = {
  width: '100%',
  height: '100%',
};

const center = {
  lat: 20.5937,
  lng: 78.9629,
};

const defaultCoordinatePoints = [
  { id: 1, latitude: 28.7041, longitude: 77.1025, name: 'IIT Delhi', description: 'Premier engineering institute in India' },
  { id: 2, latitude: 25.4358, longitude: 81.8463, name: 'IIT Kanpur', description: 'One of the oldest IITs in India' },
  { id: 3, latitude: 10.9510, longitude: 79.4060, name: 'NIT Trichy', description: 'Top National Institute of Technology' },
  { id: 4, latitude: 26.1967, longitude: 78.1971, name: 'IIIT Allahabad', description: 'Renowned institute for IT education' },
];

const Map = ({ isScriptLoaded, isScriptLoadSucceed, isActive }) => {
  const [map, setMap] = useState(null);
  const [coordinatePoints, setCoordinatePoints] = useState([]);
  const [selectedPoint, setSelectedPoint] = useState(null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (isScriptLoaded && isScriptLoadSucceed && isActive) {
      // Fetch coordinate points from the backend API or use default data
      const fetchCoordinatePoints = async () => {
        try {
          // Simulating API response
          const response = await new Promise((resolve) => setTimeout(() => resolve(defaultCoordinatePoints), 1000));
          setCoordinatePoints(response);
        } catch (error) {
          console.error('Error fetching coordinate points:', error);
        }
      };

      const fetchOptions = async () => {
        try {
          // Simulating API response
          const response = await new Promise((resolve) => setTimeout(() => resolve([
            { id: 1, value: 'iits', label: 'IITs' },
            { id: 2, value: 'nits', label: 'NITs' },
            { id: 3, value: 'iiits', label: 'IIITs' },
          ]), 1000));
          setOptions(response);
        } catch (error) {
          console.error('Error fetching options:', error);
        }
      };

      fetchCoordinatePoints();
      fetchOptions();
    }
  }, [isScriptLoaded, isScriptLoadSucceed, isActive]);

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
    <div className={`map-container ${isActive ? 'active' : ''}`}>
      <header className="map-header">Map</header>
      <div className="map-content">
        <div className="map-sidebar">
          <h2>Options</h2>
          {options.map((option) => (
            <div key={option.id}>
              <label>
                <input
                  type="radio"
                  value={option.value}
                  checked={option.value === 'iits'} // Default selection
                  onChange={() => {}}
                />
                {option.label}
              </label>
            </div>
          ))}
        </div>
        {isActive && isScriptLoaded && isScriptLoadSucceed && (
          <div className="map">
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
