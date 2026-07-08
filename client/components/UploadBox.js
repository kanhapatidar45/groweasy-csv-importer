'use client';

import { useRef, useState } from 'react';

export default function UploadBox({ file, onFileSelect, onUpload, loading, darkMode }) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.name.endsWith('.csv')) {
      onFileSelect(droppedFile);
    }
  };

  const handleInputChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) onFileSelect(selectedFile);
  };

  return (
    <div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
       className={`rounded-lg shadow p-10 mb-4 border-2 border-dashed cursor-pointer text-center transition-colors ${
            darkMode ? 'bg-gray-800 border-gray-600' : 'bg-white border-gray-300'
          } ${isDragging ? (darkMode ? 'border-blue-400 bg-gray-700' : 'border-blue-500 bg-blue-50') : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleInputChange}
          className="hidden"
        />
      <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          {isDragging ? 'Drop your CSV here' : 'Drag & drop a CSV file here, or click to browse'}
        </p>
        {file && (
          <p className="text-sm text-blue-600 font-medium mt-2">
            Selected: {file.name}
          </p>
        )}
      </div>

      <button
        onClick={onUpload}
        disabled={loading || !file}
        className="bg-blue-600 text-white px-6 py-2 rounded-md
                   hover:bg-blue-700 disabled:bg-gray-400 mb-6"
      >
        {loading ? 'Uploading...' : 'Upload & Preview'}
      </button>
    </div>
  );
}