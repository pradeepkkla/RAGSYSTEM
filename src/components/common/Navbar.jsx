import React from 'react';
import { FiSearch, FiBell, FiUser } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import ThemeToggle from './ThemeToggle';
import { motion } from 'framer-motion';

const Navbar = ({ projectTitle = 'Enterprise RAG Framework' }) => {
  const { isDark } = useTheme();

  return (
    <motion.nav
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="sticky top-0 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-soft"
    >
      <div className="px-6 py-4 flex items-center justify-between gap-4">
        {/* Project Title */}
        <h1 className="hidden md:block text-lg font-semibold text-gray-900 dark:text-white">
          {projectTitle}
        </h1>

        {/* Search Bar */}
        <div className="flex-1 max-w-md">
          <div className="relative">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search documents..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Right Side Actions */}
        <div className="flex items-center gap-4">
          {/* Notification Bell */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition relative">
            <FiBell size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Theme Toggle */}
          <ThemeToggle />

          {/* User Avatar */}
          <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
              U
            </div>
          </button>
        </div>
      </div>

      {/* AI Status Indicator */}
      <div className="px-6 py-2 bg-blue-50 dark:bg-blue-900/20 border-t border-blue-200 dark:border-blue-800 flex items-center gap-2">
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
        <span className="text-sm text-blue-700 dark:text-blue-300">AI Assistant Ready</span>
      </div>
    </motion.nav>
  );
};

export default Navbar;
