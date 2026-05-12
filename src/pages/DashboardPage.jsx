import React, { useState, useEffect } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import { FiFile, FiMessageCircle, FiActivity, FiClock, FiChevronRight } from 'react-icons/fi';
import { motion } from 'framer-motion';

const DashboardPage = ({ onNavigateToChat, onNavigateToDocuments }) => {
  const [chats, setChats] = useState([]);
  const [documents, setDocuments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
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
        console.error('Error fetching dashboard data:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Calculate real dynamic stats
  const totalChats = chats.length;
  const totalDocs = documents.length;
  
  // Count all messages sent by 'assistant' across all chats
  const totalAIResponses = chats.reduce((acc, chat) => {
    const aiMessages = chat.messages ? chat.messages.filter(m => m.role === 'assistant').length : 0;
    return acc + aiMessages;
  }, 0);

  const stats = [
    {
      icon: FiMessageCircle,
      label: 'Total Chats',
      value: isLoading ? '...' : totalChats,
      color: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      borderColor: 'border-blue-100 dark:border-blue-800'
    },
    {
      icon: FiFile,
      label: 'Documents',
      value: isLoading ? '...' : totalDocs,
      color: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50 dark:bg-purple-900/20',
      borderColor: 'border-purple-100 dark:border-purple-800'
    },
    {
      icon: FiActivity,
      label: 'AI Responses',
      value: isLoading ? '...' : totalAIResponses,
      color: 'from-green-500 to-emerald-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-100 dark:border-green-800'
    },
  ];

  const recentChats = chats.slice(0, 3); // Get top 3 latest chats

  const formatDate = (dateString) => {
    const d = new Date(dateString);
    const today = new Date();
    if (d.toDateString() === today.toDateString()) return 'Today, ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const StatCard = ({ icon: Icon, label, value, color, bgColor, borderColor }) => (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      className={`${bgColor} rounded-2xl p-6 shadow-sm border ${borderColor} relative overflow-hidden group`}
    >
      <div className={`absolute -right-6 -top-6 w-24 h-24 bg-gradient-to-br ${color} rounded-full opacity-10 group-hover:opacity-20 transition-opacity blur-xl`}></div>
      <div className="flex items-center justify-between relative z-10">
        <div>
          <p className="text-sm font-semibold text-gray-600 dark:text-gray-400 mb-1 uppercase tracking-wider">
            {label}
          </p>
          <p className="text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
            {value}
          </p>
        </div>
        <div className={`bg-gradient-to-br ${color} p-4 rounded-xl shadow-lg transform group-hover:rotate-12 transition-transform`}>
          <Icon className="text-white" size={28} />
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar onNewChat={onNavigateToChat} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar projectTitle="Dashboard" />

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto p-6 lg:p-10 custom-scrollbar">
          <div className="max-w-6xl mx-auto space-y-10">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex flex-col md:flex-row md:items-end justify-between gap-4 bg-white dark:bg-gray-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl"></div>
              <div className="relative z-10">
                <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 mb-3">
                  Welcome Back!
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl">
                  Here is the real-time activity of your Enterprise RAG system today. Everything is looking great.
                </p>
              </div>
              <button 
                onClick={onNavigateToChat}
                className="relative z-10 px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-xl font-bold shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all flex items-center gap-2"
              >
                <FiMessageCircle /> New Chat
              </button>
            </motion.div>

            {/* Stats Grid */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ staggerChildren: 0.1, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <StatCard {...stat} />
                </motion.div>
              ))}
            </motion.div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Recent Chats */}
              <motion.section
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <FiMessageCircle className="text-blue-600 dark:text-blue-400" size={16} />
                    </div>
                    Recent Conversations
                  </h2>
                  <button onClick={onNavigateToChat} className="text-sm font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1">
                    View all <FiChevronRight />
                  </button>
                </div>

                <div className="space-y-4">
                  {isLoading ? (
                    <div className="animate-pulse space-y-4">
                      {[1,2,3].map(i => <div key={i} className="h-16 bg-gray-100 dark:bg-gray-700 rounded-xl"></div>)}
                    </div>
                  ) : recentChats.length > 0 ? (
                    recentChats.map((chat, index) => (
                      <motion.button
                        key={chat._id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + (index * 0.1) }}
                        onClick={onNavigateToChat}
                        className="w-full text-left p-4 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/50 transition border border-gray-100 dark:border-gray-700 group flex items-center justify-between"
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded-lg group-hover:bg-white dark:group-hover:bg-gray-600 transition">
                            <FiMessageCircle className="text-gray-500 dark:text-gray-400" size={20} />
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 dark:text-white text-base">
                              {chat.title}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center gap-1">
                              <FiClock size={12}/> {formatDate(chat.updatedAt)}
                            </p>
                          </div>
                        </div>
                        <FiChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors transform group-hover:translate-x-1" size={20} />
                      </motion.button>
                    ))
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-500 dark:text-gray-400">No chats yet. Start asking questions!</p>
                    </div>
                  )}
                </div>
              </motion.section>

              {/* Quick Actions */}
              <motion.section
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 flex flex-col justify-between"
              >
                <div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2 mb-6">
                    <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                      <FiActivity className="text-purple-600 dark:text-purple-400" size={16} />
                    </div>
                    System Actions
                  </h2>
                  <div className="grid grid-cols-1 gap-4">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onNavigateToChat}
                      className="p-5 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-4"
                    >
                      <div className="p-3 bg-white/20 rounded-xl"><FiMessageCircle size={24} /></div>
                      <div className="text-left">
                        <div className="text-lg">Ask AI Assistant</div>
                        <div className="text-sm text-blue-100 font-normal">Start a new conversation</div>
                      </div>
                    </motion.button>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onNavigateToDocuments}
                      className="p-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold shadow-md hover:shadow-lg transition flex items-center gap-4"
                    >
                      <div className="p-3 bg-white/20 rounded-xl"><FiFile size={24} /></div>
                      <div className="text-left">
                        <div className="text-lg">Upload Documents</div>
                        <div className="text-sm text-purple-100 font-normal">Feed data to your AI</div>
                      </div>
                    </motion.button>
                  </div>
                </div>

                {/* System Status */}
                <div className="mt-8 bg-green-50 dark:bg-green-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800/50 flex items-center gap-4">
                  <div className="relative flex h-4 w-4">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
                  </div>
                  <div>
                    <p className="font-bold text-green-900 dark:text-green-300">
                      All Systems Operational
                    </p>
                    <p className="text-xs text-green-700 dark:text-green-400 mt-1">
                      Vector database and AI models are fully synced.
                    </p>
                  </div>
                </div>
              </motion.section>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
