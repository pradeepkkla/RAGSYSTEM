import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiMessageCircle, FiZap } from 'react-icons/fi';
import { SUGGESTED_PROMPTS } from '../../utils/constants';

const SuggestedPrompts = ({ onPromptSelect }) => {
  const [prompts, setPrompts] = useState([]);

  useEffect(() => {
    const fetchDynamicPrompts = async () => {
      try {
        const token = localStorage.getItem('auth_token');
        if (!token) return;
        
        const response = await fetch('http://localhost:5000/api/documents', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await response.json();
        
        if (data.success && data.data.length > 0) {
          // Extract suggested questions from all documents
          let dynamicPrompts = [];
          data.data.forEach(doc => {
            if (doc.suggestedQuestions && Array.isArray(doc.suggestedQuestions)) {
              dynamicPrompts.push(...doc.suggestedQuestions);
            }
          });
          
          // Shuffle and take top 6 unique prompts
          dynamicPrompts = [...new Set(dynamicPrompts)].sort(() => 0.5 - Math.random()).slice(0, 6);
          
          // If we found dynamic prompts from the documents, use them. Otherwise fallback to static ones.
          if (dynamicPrompts.length > 0) {
            setPrompts(dynamicPrompts);
          } else {
            setPrompts(SUGGESTED_PROMPTS);
          }
        } else {
          setPrompts(SUGGESTED_PROMPTS);
        }
      } catch (err) {
        console.error('Failed to fetch dynamic prompts', err);
        setPrompts(SUGGESTED_PROMPTS);
      }
    };

    fetchDynamicPrompts();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="w-full overflow-hidden">
      <div className="flex items-center gap-2 mb-3 px-4 sm:px-6">
        <FiZap className="text-yellow-500" />
        <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
          Try asking about your documents:
        </h3>
      </div>
      
      <div className="overflow-x-auto pb-4 hide-scrollbar px-4 sm:px-6">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="flex gap-3 min-w-max"
        >
          {prompts.map((prompt, index) => (
            <motion.button
              key={index}
              variants={itemVariants}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onPromptSelect(prompt)}
              className="flex items-center gap-2 py-2.5 px-4 rounded-full border border-blue-200 dark:border-blue-800 bg-blue-50/50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-800 text-sm font-medium text-blue-700 dark:text-blue-300 shadow-sm transition duration-200 whitespace-nowrap group"
            >
              <FiMessageCircle className="text-blue-400 group-hover:text-blue-600 dark:group-hover:text-blue-300" size={14} />
              {prompt}
            </motion.button>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default SuggestedPrompts;
