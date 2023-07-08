import React, { useState } from 'react';
import './App.css';
import Map from './Map';
import Upload from './Upload';

const App = () => {
  const [activeTab, setActiveTab] = useState('visualise');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="container">
      <header className="header">
        <h1 className="header-title">BS-GeoEduNet 1.0</h1>
        <nav className="tabs">
          <div
            className={`tab ${activeTab === 'visualise' ? 'active' : ''}`}
            onClick={() => handleTabClick('visualise')}
          >
            Visualise
          </div>
          <div
            className={`tab ${activeTab === 'upload' ? 'active' : ''}`}
            onClick={() => handleTabClick('upload')}
          >
            Upload
          </div>
        </nav>
      </header>
      <div className="content">
        {activeTab === 'visualise' ? <Map isActive={true} /> : <Upload />}
      </div>
    </div>
  );
};

export default App;
