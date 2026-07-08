'use client';

import { useState } from 'react';
import UploadBox from '../components/UploadBox';
import PreviewTable from '../components/PreviewTable';
import ResultTable from '../components/ResultTable';
const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5000/api/upload';

export default function Home() {
  const [file, setFile] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [resultData, setResultData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [darkMode, setDarkMode] = useState(false);
  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
    setError('');
    setPreviewData(null);
    setResultData(null);
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a CSV file first');
      return;
    }

    setLoading(true);
    setError('');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch(`${API_BASE_URL}/preview`, {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      setPreviewData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!previewData?.data) return;

    setProcessing(true);
    setError('');

    try {
      const res = await fetch(`${API_BASE_URL}/process`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rows: previewData.data }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI processing failed');
      setResultData(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setProcessing(false);
    }
  };

  return (
   <main className={`min-h-screen p-8 transition-colors ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-800'}`}>
              GrowEasy AI CSV Importer
            </h1>
            <p className={darkMode ? 'text-gray-400' : 'text-gray-600'}>
              Upload any CSV format — AI will map it to CRM fields automatically.
            </p>
          </div>
          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              darkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            }`}
          >
            {darkMode ? '☀️ Light Mode' : '🌙 Dark Mode'}
          </button>
        </div>
        <UploadBox
          file={file}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          loading={loading}
          darkMode={darkMode}
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <PreviewTable
          previewData={previewData}
          onConfirm={handleConfirm}
          processing={processing}
          darkMode={darkMode}
        />

       <ResultTable resultData={resultData} darkMode={darkMode} />
      </div>
    </main>
  );
}