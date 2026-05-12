import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import DocumentUpload from '../components/documents/DocumentUpload';
import DocumentCard from '../components/documents/DocumentCard';
import { motion } from 'framer-motion';
import { FiSearch } from 'react-icons/fi';

const DocumentManagementPage = () => {
  const [documents, setDocuments] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchDocuments();
  }, []);

  const fetchDocuments = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/documents', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await response.json();
      if (response.ok && data.success) {
        setDocuments(data.data.map(doc => ({
          id: doc._id,
          name: doc.originalName,
          size: doc.size,
          uploadedAt: new Date(doc.createdAt),
          progress: 100,
          status: doc.status,
          summary: doc.summary,
          keyPoints: doc.keyPoints,
          topics: doc.topics,
          keywords: doc.keywords,
          insights: doc.insights,
          suggestedQuestions: doc.suggestedQuestions,
          category: doc.category
        })));
      }
    } catch (error) {
      console.error('Error fetching documents', error);
    }
  };

  const handleDocumentsAdded = () => {
    // Refresh the list after upload
    fetchDocuments();
  };

  const handleDeleteDocument = async (docId) => {
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/documents/${docId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        setDocuments(documents.filter(doc => doc.id !== docId));
      }
    } catch (error) {
      console.error('Failed to delete document', error);
    }
  };

  const handleDownloadDocument = (docId) => {
    console.log('Download document:', docId);
  };

  const handleShareDocument = (docId) => {
    console.log('Share document:', docId);
  };

  const filteredDocuments = documents.filter(doc =>
    doc.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar projectTitle="Document Management" />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Document Management
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Upload and manage your documents for AI analysis
              </p>
            </motion.div>

            {/* Upload Section */}
            <motion.section
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-soft-lg p-6"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Upload Documents
              </h2>
              <DocumentUpload onDocumentsAdded={handleDocumentsAdded} />
            </motion.section>

            {/* Documents List Section */}
            {documents.length > 0 && (
              <motion.section
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                    Your Documents ({filteredDocuments.length})
                  </h2>

                  {/* Search */}
                  <div className="flex items-center gap-2">
                    <FiSearch className="text-gray-400" size={20} />
                    <input
                      type="text"
                      placeholder="Search documents..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="px-3 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  {filteredDocuments.map(doc => (
                    <DocumentCard
                      key={doc.id}
                      document={doc}
                      onDelete={handleDeleteDocument}
                      onDownload={handleDownloadDocument}
                      onShare={handleShareDocument}
                    />
                  ))}
                </div>
              </motion.section>
            )}

            {/* Empty State */}
            {documents.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 text-gray-500 dark:text-gray-400"
              >
                <p>No documents uploaded yet. Start by uploading a document above.</p>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentManagementPage;
