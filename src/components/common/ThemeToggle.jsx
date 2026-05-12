import React from 'react';
import { FiSun, FiMoon } from 'react-icons/fi';
import { useTheme } from '../../hooks/useTheme';
import { motion } from 'framer-motion';

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <motion.button
      whileTap={{ scale: 0.95 }}
      onClick={toggleTheme}
      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <FiSun size={20} className="text-yellow-500" />
      ) : (
        <FiMoon size={20} className="text-indigo-600" />
      )}
    </motion.button>
  );
};

export default ThemeToggle;
