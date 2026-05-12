import React, { useState } from 'react';
import { FiFile, FiTrash2, FiDownload, FiShare2, FiChevronDown, FiChevronUp, FiTag, FiZap, FiMessageCircle, FiList } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const DocumentCard = ({ document, onDelete, onDownload, onShare }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getFileTypeIcon = (fileName) => {
    if (fileName.endsWith('.pdf')) return '📄';
    if (fileName.endsWith('.docx') || fileName.endsWith('.doc')) return '📝';
    return '📎';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl hover:shadow-soft transition overflow-hidden"
    >
      <div className="p-4 flex gap-4 items-center">
        {/* Icon */}
        <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center text-2xl flex-shrink-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          {getFileTypeIcon(document.name)}
        </div>

        {/* Document Info */}
        <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-900 dark:text-white truncate">
              {document.name}
            </h3>
            {document.category && (
              <span className="text-[10px] px-2 py-0.5 bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 rounded-full font-medium border border-blue-100 dark:border-blue-800">
                {document.category}
              </span>
            )}
          </div>
          <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-1">
            <span>{(document.size / 1024).toFixed(2)} KB</span>
            <span>{formatDate(document.uploadedAt || new Date())}</span>
            <span className={`capitalize ${document.status === 'embedded' ? 'text-green-500' : 'text-yellow-500'}`}>
              {document.status === 'embedded' ? 'AI Ready' : document.status}
            </span>
          </div>

          {/* Progress Bar */}
          {document.progress !== undefined && document.status === 'processing' && (
            <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${document.progress}%` }}
                className="h-full bg-blue-500 rounded-full"
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 flex-shrink-0">
          {document.summary && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setIsExpanded(!isExpanded)}
              className={`p-2 rounded-lg transition ${isExpanded ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400' : 'hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400'}`}
              title="View AI Insights"
            >
              {isExpanded ? <FiChevronUp size={18} /> : <FiChevronDown size={18} />}
            </motion.button>
          )}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDownload?.(document.id)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
            title="Download"
          >
            <FiDownload size={18} />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onDelete?.(document.id)}
            className="p-2 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition text-gray-400 hover:text-red-600"
            title="Delete"
          >
            <FiTrash2 size={18} />
          </motion.button>
        </div>
      </div>

      {/* Expandable AI Insights Section */}
      <AnimatePresence>
        {isExpanded && document.summary && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-gray-100 dark:border-gray-700 bg-gradient-to-br from-gray-50 to-white dark:from-gray-800/50 dark:to-gray-800 p-5"
          >
            <div className="space-y-4 max-w-4xl">
              {/* Summary & Insights */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-700/50 p-4 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-gray-900 dark:text-white mb-2">
                    <FiList className="text-blue-500" /> Document Summary
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                    {document.summary}
                  </p>
                </div>
                
                <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 p-4 rounded-xl border border-purple-100 dark:border-purple-800/50 shadow-sm">
                  <h4 className="flex items-center gap-2 text-sm font-bold text-purple-700 dark:text-purple-300 mb-2">
                    <FiZap /> Smart AI Insight
                  </h4>
                  <p className="text-sm text-purple-900/80 dark:text-purple-200/80 leading-relaxed italic">
                    "{document.insights}"
                  </p>
                </div>
              </div>

              {/* Keywords & Topics */}
              {document.keywords && document.keywords.length > 0 && (
                <div>
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <FiTag size={12} /> Keywords & Topics
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {document.keywords.slice(0, 8).map((kw, i) => (
                      <span key={i} className="text-xs px-2.5 py-1 bg-gray-200/50 dark:bg-gray-600/50 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Suggested Questions */}
              {document.suggestedQuestions && document.suggestedQuestions.length > 0 && (
                <div className="pt-2">
                  <h4 className="flex items-center gap-2 text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
                    <FiMessageCircle size={12} /> Suggested Questions
                  </h4>
                  <div className="space-y-2">
                    {document.suggestedQuestions.slice(0, 3).map((q, i) => (
                      <div key={i} className="text-sm text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-900/20 px-3 py-2 rounded-lg border border-blue-100/50 dark:border-blue-800/30 hover:bg-blue-50 dark:hover:bg-blue-900/40 transition cursor-pointer">
                        "{q}"
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default DocumentCard;
