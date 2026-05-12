import React, { useState, useRef } from 'react';
import { FiSend, FiPaperclip, FiMic } from 'react-icons/fi';
import { motion } from 'framer-motion';

const InputArea = ({ onSendMessage, isLoading = false, onFilesSelected }) => {
  const [message, setMessage] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const fileInputRef = useRef(null);

  const handleSendMessage = () => {
    if (message.trim()) {
      onSendMessage(message, selectedFiles);
      setMessage('');
      setSelectedFiles([]);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey && !isLoading) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleFileSelect = (e) => {
    const files = Array.from(e.target.files || []);
    setSelectedFiles([...selectedFiles, ...files]);
    if (onFilesSelected) {
      onFilesSelected(files);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(selectedFiles.filter((_, i) => i !== index));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-4 sm:p-6"
    >
      {/* File Preview */}
      {selectedFiles.length > 0 && (
        <div className="mb-4 flex gap-2 flex-wrap">
          {selectedFiles.map((file, index) => (
            <div
              key={index}
              className="px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-between gap-2 text-xs"
            >
              <span className="text-gray-700 dark:text-gray-300 truncate max-w-xs">
                📎 {file.name}
              </span>
              <button
                onClick={() => removeFile(index)}
                className="text-gray-400 hover:text-red-500 transition"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Input Container */}
      <div className="flex gap-3 items-end">
        {/* File Upload Button */}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx"
          onChange={handleFileSelect}
          className="hidden"
        />
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => fileInputRef.current?.click()}
          className="p-2 lg:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
          title="Attach files"
        >
          <FiPaperclip size={20} />
        </motion.button>

        {/* Voice Input Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          className="p-2 lg:p-3 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition text-gray-600 dark:text-gray-400"
          title="Voice input"
        >
          <FiMic size={20} />
        </motion.button>

        {/* Message Input */}
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message here or ask a question..."
          rows="1"
          className="flex-1 px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          style={{ minHeight: '44px', maxHeight: '120px' }}
        />

        {/* Send Button */}
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleSendMessage}
          disabled={isLoading || !message.trim()}
          className="p-2 lg:p-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition font-medium flex items-center justify-center"
          title="Send message"
        >
          <FiSend size={20} />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default InputArea;
