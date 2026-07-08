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
    <main className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          GrowEasy AI CSV Importer
        </h1>
        <p className="text-gray-600 mb-8">
          Upload any CSV format — AI will map it to CRM fields automatically.
        </p>

        <UploadBox
          file={file}
          onFileSelect={handleFileSelect}
          onUpload={handleUpload}
          loading={loading}
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <PreviewTable
          previewData={previewData}
          onConfirm={handleConfirm}
          processing={processing}
        />

        <ResultTable resultData={resultData} />
      </div>
    </main>
  );
}