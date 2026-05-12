import React, { useState, useEffect } from 'react';
import { FiPlus, FiMenu, FiX, FiLogOut, FiSettings, FiMessageSquare, FiFileText, FiTrash2, FiEye, FiClock } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

const Sidebar = ({ onNewChat, onChatSelect }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const { isDark } = useTheme();

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const [chatsRes, docsRes] = await Promise.all([
        fetch('http://localhost:5000/api/chat', { headers: { Authorization: `Bearer ${token}` } }),
        fetch('http://localhost:5000/api/documents', { headers: { Authorization: `Bearer ${token}` } })
      ]);

      const chatsData = await chatsRes.json();
      const docsData = await docsRes.json();

      if (chatsData.success) setChats(chatsData.data);
      if (docsData.success) setDocuments(docsData.data);
    } catch (err) {
      console.error('Error fetching sidebar data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    // Poll every 5 seconds to keep history fresh
    const interval = setInterval(fetchData, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleDeleteChat = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this chat?")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:5000/api/chat/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {}
  };

  const handleClearAllChats = async () => {
    if (!window.confirm("Are you sure you want to delete ALL chat history?")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:5000/api/chat/all`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {}
  };

  const handleDeleteDoc = async (id) => {
    if (!window.confirm("Delete this document?")) return;
    try {
      const token = localStorage.getItem('auth_token');
      await fetch(`http://localhost:5000/api/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {}
  };

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatSize = (bytes) => {
    if (!bytes) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  return (
    <>
      {/* Toggle Button for Mobile */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed left-4 top-4 z-50 lg:hidden p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition"
      >
        {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
      </button>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: isOpen ? 0 : -280 }}
        transition={{ duration: 0.3 }}
        className={`fixed left-0 top-0 h-screen w-80 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-soft z-40 lg:static lg:translate-x-0 flex flex-col`}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">RAG</span>
            </div>
            <div className="hidden md:block">
              <h1 className="font-bold text-gray-900 dark:text-white text-sm">Enterprise</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">RAG Framework</p>
            </div>
          </div>
        </div>

        {/* New Chat Button */}
        <div className="p-4">
          <button
            onClick={() => {
              if (onNewChat) onNewChat();
              else window.location.reload();
            }}
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-2 px-4 rounded-lg font-medium transition duration-200 shadow-sm"
          >
            <FiPlus size={20} />
            <span>New Chat</span>
          </button>
        </div>

        {/* Chat History */}
        <div className="flex-1 overflow-y-auto px-4 custom-scrollbar">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">
              Chat History
            </h2>
            {chats.length > 0 && (
              <button 
                onClick={handleClearAllChats}
                className="text-[10px] text-red-500 hover:text-red-600 underline"
              >
                Clear All
              </button>
            )}
          </div>
          
          <div className="space-y-2">
            {chats.length > 0 ? (
              chats.map((chat) => (
                <div
                  key={chat._id}
                  onClick={() => onChatSelect && onChatSelect(chat._id)}
                  className="w-full text-left p-3 rounded-lg bg-white dark:bg-gray-700/30 hover:bg-blue-50 dark:hover:bg-gray-700 transition border border-gray-100 dark:border-gray-600/50 shadow-sm group cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2 overflow-hidden">
                      <FiMessageSquare className="text-blue-500 shrink-0 mt-0.5" size={14} />
                      <div className="truncate">
                        <p className="text-sm font-medium text-gray-700 dark:text-gray-200 truncate">
                          {chat.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5 flex items-center gap-1">
                          <FiClock size={10}/> {formatDate(chat.updatedAt)}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteChat(chat._id, e)}
                      className="opacity-0 group-hover:opacity-100 p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 rounded transition-all shrink-0"
                    >
                      <FiTrash2 size={14} />
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 dark:from-gray-800/50 dark:to-gray-800/20 border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center text-center space-y-2 mt-2"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <FiMessageSquare className="text-blue-500 dark:text-blue-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No chat history</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Start a new conversation</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Documents Section */}
        <div className="px-4 py-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50">
          <h2 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">
            Recent Documents
          </h2>
          <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-1">
            {documents.length > 0 ? (
              documents.map((doc) => (
                <div key={doc._id} className="p-2 rounded bg-white dark:bg-gray-700 border border-gray-100 dark:border-gray-600 flex flex-col gap-1 shadow-sm group">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 truncate">
                      <FiFileText className="text-purple-500 shrink-0" size={14} />
                      <p className="text-xs font-medium text-gray-700 dark:text-gray-200 truncate">
                        {doc.originalName}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => window.open(`http://localhost:5000/uploads/${doc.filename}`, '_blank')}
                        className="text-gray-400 hover:text-blue-500 p-1"
                        title="Preview Document"
                      >
                        <FiEye size={12} />
                      </button>
                      <button 
                        onClick={() => handleDeleteDoc(doc._id)} 
                        className="text-gray-400 hover:text-red-500 p-1"
                        title="Delete Document"
                      >
                        <FiTrash2 size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-gray-400 px-5">
                    <span>{formatDate(doc.createdAt)}</span>
                    <span>{formatSize(doc.size)}</span>
                  </div>
                  <div className="px-5">
                    <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-medium ${
                      doc.status === 'embedded' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' :
                      doc.status === 'error' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                      'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }}
                className="p-4 rounded-xl bg-gradient-to-br from-purple-50 to-white dark:from-purple-900/10 dark:to-gray-800/20 border border-dashed border-purple-200 dark:border-purple-800/30 flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="w-10 h-10 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                  <FiFileText className="text-purple-500 dark:text-purple-400" size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300">No documents</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Upload files to get started</p>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 space-y-2 bg-white dark:bg-gray-800">
          <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-sm text-gray-700 dark:text-gray-300">
            <FiSettings size={18} />
            <span>Settings</span>
          </button>
          <button 
            onClick={() => {
              localStorage.removeItem('auth_token');
              window.location.reload();
            }}
            className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition text-sm text-gray-700 dark:text-gray-300 font-medium group"
          >
            <FiLogOut className="text-gray-400 group-hover:text-red-500 transition-colors" size={18} />
            <span>Logout Account</span>
          </button>
        </div>
      </motion.aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
        />
      )}
    </>
  );
};

export default Sidebar;
