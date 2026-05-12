import React, { useState } from 'react';
import Sidebar from '../components/common/Sidebar';
import Navbar from '../components/common/Navbar';
import ChatArea from '../components/chat/ChatArea';
import InputArea from '../components/chat/InputArea';
import SuggestedPrompts from '../components/chat/SuggestedPrompts';
import { useChat } from '../hooks/useChat';
import { motion } from 'framer-motion';

const ChatbotPage = () => {
  const { messages, isLoading, sendMessage, loadChat } = useChat();
  const [showSuggestions, setShowSuggestions] = useState(messages.length === 1);

  const handleSendMessage = (text, attachments) => {
    sendMessage(text, attachments);
    setShowSuggestions(false);
  };

  const handleSuggestedPrompt = (prompt) => {
    handleSendMessage(prompt);
  };

  const handleNewChat = () => {
    window.location.reload();
  };

  return (
    <div className="flex h-screen bg-white dark:bg-gray-900">
      {/* Sidebar */}
      <Sidebar onNewChat={handleNewChat} onChatSelect={loadChat} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Navbar */}
        <Navbar />

        {/* Chat Container */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Messages Area */}
          <ChatArea messages={messages} isLoading={isLoading} />

          {/* Suggested Prompts */}
          {showSuggestions && messages.length <= 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="px-4 sm:px-6 py-6 border-t border-gray-200 dark:border-gray-700"
            >
              <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">
                Try asking:
              </h3>
              <SuggestedPrompts onPromptSelect={handleSuggestedPrompt} />
            </motion.div>
          )}

          {/* Input Area */}
          <InputArea
            onSendMessage={handleSendMessage}
            isLoading={isLoading}
            onFilesSelected={(files) => {
              // Handle file selection
              console.log('Files selected:', files);
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default ChatbotPage;
