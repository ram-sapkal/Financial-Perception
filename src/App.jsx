import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ManualForm from './ManualForm';
import { Layers } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'

  return (
    <div className="app-container">
      <div className="header">
        <h1>
          <Layers style={{ display: 'inline', marginRight: '10px', verticalAlign: '-4px' }} size={36} />
          Financial Perception
        </h1>
        <p>AI-Powered Insurance Bundle Recommendations</p>
      </div>

      <div className="glass-card">
        <div className="toggle-wrapper">
          <div className="toggle-container">
            <div 
              className="toggle-slider" 
              style={{ transform: activeTab === 'upload' ? 'translateX(0)' : 'translateX(100%)' }} 
            />
            <button 
              className={`toggle-btn ${activeTab === 'upload' ? 'active' : ''}`}
              onClick={() => setActiveTab('upload')}
            >
              Bulk Upload
            </button>
            <button 
              className={`toggle-btn ${activeTab === 'manual' ? 'active' : ''}`}
              onClick={() => setActiveTab('manual')}
            >
              Manual Entry
            </button>
          </div>
        </div>

        <div className="tab-content" style={{ minHeight: '300px' }}>
          {activeTab === 'upload' ? <FileUpload /> : <ManualForm />}
        </div>
      </div>
    </div>
  );
}

export default App;
