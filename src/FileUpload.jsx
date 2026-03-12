import React, { useState, useRef } from 'react';
import axios from 'axios';
import { UploadCloud, File, X, Download, AlertCircle, CheckCircle } from 'lucide-react';

export default function FileUpload() {
  const [file, setFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (selectedFile) => {
    setError(null);
    setResult(null);
    const validTypes = ['text/csv', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel', '.csv', '.xlsx'];
    const isCsvOrXlsx = validTypes.some(type => selectedFile.type === type || selectedFile.name.endsWith(type));
    
    if (!isCsvOrXlsx && !selectedFile.name.endsWith('.csv') && !selectedFile.name.endsWith('.xlsx')) {
      setError('Please upload a valid .csv or .xlsx file.');
      return;
    }
    setFile(selectedFile);
  };

  const clearFile = () => {
    setFile(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleProcess = async () => {
    if (!file) return;
    
    setIsProcessing(true);
    setError(null);
    setResult(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      // Request binary (arraybuffer) — server streams Excel directly, no disk storage
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        responseType: 'arraybuffer'
      });
      
      // Build a client-side Blob URL from the binary Excel response
      const blob = new Blob([response.data], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      });
      const blobUrl = URL.createObjectURL(blob);
      const rowCount = parseInt(response.headers['x-row-count'] || '0', 10);
      const downloadName = file.name.replace(/\.[^/.]+$/, '') + '_processed.xlsx';

      setResult({ count: rowCount, url: blobUrl, fileName: downloadName });

      // Auto-trigger download immediately
      triggerDownload(blobUrl, downloadName);
      
    } catch (err) {
      // Decode arraybuffer error response back to text
      let backendError = 'A network error occurred during processing.';
      if (err.response?.data instanceof ArrayBuffer) {
        try {
          const text = new TextDecoder().decode(err.response.data);
          backendError = JSON.parse(text)?.error || text;
        } catch (_) {}
      } else {
        backendError = err.response?.data?.error || err.response?.data?.message || backendError;
      }
      setError(backendError);
      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } finally {
      setIsProcessing(false);
    }
  };

  const triggerDownload = (url, filename) => {
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'processed_data.xlsx';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
  };

  return (
    <div className="upload-container">
      {!file && !isProcessing && !result && (
        <div 
          className={`upload-area ${isDragging ? 'drag-active' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <UploadCloud className="upload-icon" />
          <h3 className="upload-text">Drag & Drop your dataset here</h3>
          <p className="upload-subtext">Supports .csv and .xlsx files containing Age, Persona, Income & Products</p>
        </div>
      )}

      {/* Hidden file input lives outside the clickable area to prevent double-dialog bug */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept=".csv, .xlsx, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, text/csv"
        className="file-input"
        style={{ display: 'none' }}
      />

      {file && !isProcessing && !result && (
        <>
          <div className="file-preview">
            <div className="file-info">
              <File className="text-accent-indigo" size={24} />
              <div>
                <p className="font-medium">{file.name}</p>
                <p className="upload-subtext">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button className="remove-file" onClick={clearFile}>
              <X size={20} />
            </button>
          </div>
          
          <div style={{ marginTop: '2rem' }}>
            <button className="btn btn-primary" onClick={handleProcess}>
              Process & Download
            </button>
          </div>
        </>
      )}

      {isProcessing && (
        <div className="loader-container">
          <div className="spinner"></div>
          <p className="loading-text">AI is processing your data...</p>
          <p className="upload-subtext mt-2 text-center" style={{marginTop:'1rem'}}>Applying insurance recommendation rules via Gemini API.</p>
        </div>
      )}

      {result && !isProcessing && (
        <div className="result-card">
          <div className="result-success">
            <CheckCircle size={24} />
            <h3>Processing Complete!</h3>
          </div>
          <p className="mb-4" style={{marginBottom:'1rem'}}>Successfully analyzed {result.count} customer profiles.</p>
          
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => triggerDownload(result.url, result.fileName)}>
              <Download size={18} /> Download Excel
            </button>
            <button className="btn" style={{background: 'rgba(255,255,255,0.1)', color: 'white'}} onClick={clearFile}>
              Process Another
            </button>
          </div>
        </div>
      )}

      {error && !isProcessing && (
        <div className="error-message" style={{position: 'relative', marginTop:'1.5rem'}}>
          <AlertCircle size={20} style={{minWidth: '20px'}}/>
          <span style={{flex: 1}}>{error}</span>
          <button className="remove-file" onClick={() => setError(null)} style={{margin: 0}}>
             <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
