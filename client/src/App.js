import React, { useState } from 'react';
import './App.css';

function App() {
  const [medicalData, setMedicalData] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [files, setFiles] = useState([]);
  const [filePreview, setFilePreview] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles(selectedFiles);

    // Show preview for image files
    if (selectedFiles.length > 0 && selectedFiles[0].type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => setFilePreview(e.target.result);
      reader.readAsDataURL(selectedFiles[0]);
    } else {
      setFilePreview(null);
    }

    // If it's a text file, read and add to medical data
    selectedFiles.forEach(file => {
      if (file.type === 'text/plain') {
        const reader = new FileReader();
        reader.onload = (e) => {
          setMedicalData(prev => prev + '\n' + e.target.result);
        };
        reader.readAsText(file);
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setAnalysis('');

    try {
      const formData = new FormData();
      formData.append('medicalData', medicalData);
      files.forEach(file => {
        formData.append('files', file);
      });

      const response = await fetch('http://localhost:5001/api/analyze', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to analyze medical data');
      }

      setAnalysis(data.analysis);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Medical AI Assistant</h1>
        <p>Get AI-powered insights on medical tests and imaging using Gemini</p>
      </header>

      <main className="App-main">
        <form onSubmit={handleSubmit} className="analysis-form">
          <div className="form-group">
            <label htmlFor="files">Upload Files (MRI Images/Test Results):</label>
            <input
              type="file"
              id="files"
              onChange={handleFileChange}
              multiple
              accept="image/*,.txt,.pdf,.doc,.docx"
              className="file-input"
            />
            {filePreview && (
              <div className="image-preview">
                <img src={filePreview} alt="Preview" />
              </div>
            )}
          </div>

          <div className="form-group">
            <label htmlFor="medicalData">Enter Additional Medical Data:</label>
            <textarea
              id="medicalData"
              value={medicalData}
              onChange={(e) => setMedicalData(e.target.value)}
              placeholder="Enter additional medical information or observations..."
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Analyzing...' : 'Analyze'}
          </button>
        </form>

        {error && <div className="error-message">{error}</div>}

        {analysis && (
          <div className="analysis-result">
            <h2>Analysis Results</h2>
            <div className="result-content">
              {analysis.split('\n').map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </div>
          </div>
        )}
      </main>

      <footer className="App-footer">
        <p>Disclaimer: This tool is for medical professionals only. Always verify AI suggestions with clinical judgment.</p>
      </footer>
    </div>
  );
}

export default App; 