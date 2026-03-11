import React, { useState } from 'react';
import FileUpload from './FileUpload';
import ManualForm from './ManualForm';
import { Layers } from 'lucide-react';
import './index.css';

function App() {
  const [activeTab, setActiveTab] = useState('upload'); // 'upload' or 'manual'

  return (
    <>
      <div className="sbi-logo-container">
        {/* Using a placeholder text if image is not accessible, but ideally link the source here */}
        <h3 style={{color: '#003399', margin: 0, fontWeight: 800, fontSize: '1.2rem', display: 'flex', alignItems: 'center', gap: '5px'}}>
           <div style={{width: '16px', height: '16px', borderRadius: '50%', border: '4px solid #00a4e4'}}></div>
           SBI Life
        </h3>
      </div>
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
    </>
  );
}

export default App;
