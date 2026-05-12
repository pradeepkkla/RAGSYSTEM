import React, { useState } from 'react';
import { FiUpload, FiFile } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DocumentUpload = ({ onDocumentsAdded }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);

  const handleDragEnter = (e) => {
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
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  };

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files || []);
    processFiles(selectedFiles);
  };

  const processFiles = async (newFiles) => {
    const validFiles = newFiles.filter(file =>
      file.type === 'application/pdf' ||
      file.name.endsWith('.docx') ||
      file.name.endsWith('.doc') ||
      file.name.endsWith('.txt')
    );
    
    if (validFiles.length === 0) return;

    setFiles([...files, ...validFiles]);
    
    // Upload files sequentially to backend
    for (const file of validFiles) {
      try {
        const token = localStorage.getItem('auth_token');
        const formData = new FormData();
        formData.append('file', file);
        
        await fetch('http://localhost:5000/api/documents/upload', {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` },
          body: formData
        });
      } catch (err) {
        console.error('Error uploading file:', file.name, err);
      }
    }

    if (onDocumentsAdded) {
      onDocumentsAdded();
    }
  };

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <motion.div
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        animate={{ borderColor: isDragging ? '#3b82f6' : '#e5e7eb' }}
        className="border-2 border-dashed border-gray-200 dark:border-gray-700 rounded-lg p-8 text-center transition"
      >
        <label className="cursor-pointer">
          <div className="flex flex-col items-center gap-3">
            <motion.div
              animate={{ scale: isDragging ? 1.1 : 1 }}
              className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center"
            >
              <FiUpload className="text-blue-600 dark:text-blue-400" size={24} />
            </motion.div>
            <div>
              <p className="font-semibold text-gray-900 dark:text-white">
                {isDragging ? 'Drop files here' : 'Drag and drop your files'}
              </p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                or click to select (PDF, DOCX, DOC)
              </p>
            </div>
          </div>
          <input
            type="file"
            multiple
            accept=".pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
        </label>
      </motion.div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-900 dark:text-white">
            Uploaded Files ({files.length})
          </h3>
          <div className="space-y-2">
            {files.map((file, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
              >
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <FiFile className="text-gray-400 flex-shrink-0" size={18} />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {(file.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setFiles(files.filter((_, i) => i !== index))}
                  className="ml-2 text-gray-400 hover:text-red-500 transition font-semibold"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentUpload;
