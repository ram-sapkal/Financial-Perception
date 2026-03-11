import React, { useState } from 'react';
import axios from 'axios';
import { User, DollarSign, Briefcase, Activity, AlertCircle, Package } from 'lucide-react';

export default function ManualForm() {
  const [formData, setFormData] = useState({
    Age: '',
    Persona: 'Term Renewer',
    'Annual income range': '750000',
    'Current Products': ''
  });
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const personas = ["Term Renewer", "Savings Renewer", "ULIP Renewer", "Maturity Approacher", "Other"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.Age || !formData['Annual income range']) {
        setError("Please fill out at least Age and Income");
        return;
    }

    setIsProcessing(true);
    setError(null);
    setResult(null);

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-single', formData);
      setResult(response.data.data);
    } catch (err) {
      setError(err.response?.data?.error || err.response?.data?.message || 'Failed to analyze criteria.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isProcessing) {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
        <p className="loading-text">AI is running rules for this profile...</p>
      </div>
    );
  }

  if (result) {
    return (
      <div className="result-card" style={{borderLeft: '4px solid var(--color-accent-blue)'}}>
        <h3 style={{marginBottom: '1rem', color: 'var(--color-text-primary)'}}>Bundle Recommendation</h3>
        
        <div className="result-data">
            <span style={{color: 'var(--color-text-secondary)', fontSize: '0.9rem'}}>Suggested Package for {formData.Persona}</span>
            <div className="suggestion-highlight">{result.Bundle_Suggestion}</div>
        </div>

        <button 
          className="btn btn-primary" 
          style={{marginTop: '2rem'}} 
          onClick={() => {setResult(null); setFormData({Age:'', Persona:'Term Renewer', 'Annual income range':'', 'Current Products':''})}}>
          Analyze Another Profile
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        
        <div className="form-group">
          <label><User size={14} style={{display:'inline', marginRight:'6px', verticalAlign:'-2px'}}/> Age</label>
          <input 
            type="number" 
            name="Age" 
            value={formData.Age} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="e.g. 35"
            required
          />
        </div>

        <div className="form-group">
          <label><Activity size={14} style={{display:'inline', marginRight:'6px', verticalAlign:'-2px'}}/> Persona</label>
          <select 
            name="Persona" 
            value={formData.Persona} 
            onChange={handleChange} 
            className="form-control"
          >
            {personas.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label><DollarSign size={14} style={{display:'inline', marginRight:'6px', verticalAlign:'-2px'}}/> Annual Income</label>
          <select 
            name="Annual income range" 
            value={formData['Annual income range']} 
            onChange={handleChange} 
            className="form-control"
          >
            <option value="250000">₹ 0 - ₹ 3,00,000 (Very Low)</option>
            <option value="450000">₹ 3,00,000 - ₹ 5,00,000 (Low)</option>
            <option value="750000">₹ 5,00,000 - ₹ 8,00,000 (Mid-Low)</option>
            <option value="950000">₹ 8,00,000 - ₹ 10,00,000 (Mid-High)</option>
            <option value="1500000">₹ 10,00,000 - ₹ 20,00,000 (High)</option>
            <option value="2500000">₹ 20,00,000+ (Very High)</option>
          </select>
        </div>

        <div className="form-group">
          <label><Briefcase size={14} style={{display:'inline', marginRight:'6px', verticalAlign:'-2px'}}/> Current Products</label>
          <input 
            type="text" 
            name="Current Products" 
            value={formData['Current Products']} 
            onChange={handleChange} 
            className="form-control" 
            placeholder="e.g. Smart Wealth"
          />
        </div>

      </div>

      {error && (
        <div className="error-message">
          <AlertCircle size={20} />
          <span>{error}</span>
        </div>
      )}

      <div style={{ marginTop: '1.5rem' }}>
        <button type="submit" className="btn btn-primary">
          <Package size={18} /> Analyze Customer
        </button>
      </div>
    </form>
  );
}
