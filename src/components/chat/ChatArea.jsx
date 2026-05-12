import React, { useEffect, useRef } from 'react';
import MessageBubble from './MessageBubble';
import TypingAnimation from './TypingAnimation';
import { motion } from 'framer-motion';

const ChatArea = ({ messages = [], isLoading = false }) => {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  return (
    <motion.div
      id="chat-scroll-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex-1 overflow-y-auto py-6"
    >
      {messages.length === 0 ? (
        <div className="h-full flex items-center justify-center">
          <div className="text-center max-w-md">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">✨</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Welcome to Enterprise RAG
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Start a conversation by asking me anything about your documents. I'll provide insights powered by advanced AI.
            </p>
          </div>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isUser={message.sender === 'user'}
            />
          ))}
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="w-full py-6 bg-gray-50/50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800"
            >
              <div className="max-w-4xl mx-auto px-4 flex gap-5">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
                    <span className="animate-pulse">✨</span>
                  </div>
                </div>
                <div className="flex flex-col min-w-0 flex-1 items-start justify-center">
                  <TypingAnimation />
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </>
      )}
    </motion.div>
  );
};

export default ChatArea;
