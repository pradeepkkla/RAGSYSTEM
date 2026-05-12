import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FiCopy, FiCheck, FiRefreshCw, FiCpu, FiUser } from 'react-icons/fi';

const MessageBubble = ({ message, isUser, onRegenerate }) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [copiedText, setCopiedText] = useState(false);

  useEffect(() => {
    if (isUser) {
      setDisplayedText(message.text);
      return;
    }

    // Only animate if the message is fresh (less than 5 seconds old)
    const isNew = (new Date() - new Date(message.timestamp)) < 5000;

    if (!isNew) {
      setDisplayedText(message.text);
      return;
    }

    let i = 0;
    setDisplayedText('');
    setIsTyping(true);

    const intervalId = setInterval(() => {
      setDisplayedText(message.text.substring(0, i));
      i += 3; // Type 3 chars at a time for smooth but fast effect

      // Scroll to bottom (assuming a standard structure, though proper implementation should be in ChatArea)
      const chatContainer = document.getElementById('chat-scroll-container');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }

      if (i > message.text.length + 3) {
        clearInterval(intervalId);
        setDisplayedText(message.text);
        setIsTyping(false);
      }
    }, 10);

    return () => clearInterval(intervalId);
  }, [message.text, isUser, message.timestamp]);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.text);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const formattedTime = new Date(message.timestamp).toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={`w-full py-6 ${isUser ? 'bg-transparent' : 'bg-gray-50/50 dark:bg-gray-800/50 border-y border-gray-100 dark:border-gray-800'}`}
    >
      <div className={`max-w-4xl mx-auto px-4 flex gap-5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {/* Avatar */}
        <div className="flex-shrink-0 mt-1">
          {isUser ? (
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
              <FiUser size={18} />
            </div>
          ) : (
            <div className="w-9 h-9 bg-gradient-to-br from-teal-500 to-emerald-600 rounded-full flex items-center justify-center text-white shadow-sm ring-2 ring-white dark:ring-gray-900">
              <FiCpu size={18} />
            </div>
          )}
        </div>

        {/* Content Wrapper */}
        <div className={`flex flex-col min-w-0 flex-1 ${isUser ? 'items-end' : 'items-start'}`}>
          
          <div className="flex items-center gap-2 mb-1.5 px-1">
            <span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
              {isUser ? 'You' : 'AI Assistant'}
            </span>
            <span className="text-[10px] text-gray-400 dark:text-gray-500">{formattedTime}</span>
          </div>

          <div 
            className={`w-full ${isUser ? 'max-w-2xl bg-blue-600 text-white px-5 py-3.5 rounded-2xl rounded-tr-sm shadow-sm' : 'text-gray-800 dark:text-gray-200'}`}
          >
            {isUser ? (
              <p className="whitespace-pre-wrap leading-relaxed">{message.text}</p>
            ) : (
              <div className="prose prose-slate dark:prose-invert max-w-none w-full
                prose-p:leading-relaxed prose-p:mb-4 
                prose-headings:font-bold prose-headings:mb-4 prose-headings:mt-6
                prose-h1:text-2xl prose-h2:text-xl prose-h3:text-lg
                prose-li:my-1 prose-ul:my-4 prose-ol:my-4
                prose-strong:text-emerald-700 dark:prose-strong:text-emerald-400
                prose-table:border-collapse prose-table:w-full prose-table:my-6
                prose-th:border prose-th:border-gray-200 dark:prose-th:border-gray-700 prose-th:px-4 prose-th:py-2 prose-th:bg-gray-100 dark:prose-th:bg-gray-800
                prose-td:border prose-td:border-gray-200 dark:prose-td:border-gray-700 prose-td:px-4 prose-td:py-2
              ">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '')
                      return !inline && match ? (
                        <div className="rounded-xl overflow-hidden my-4 border border-gray-700 bg-[#1e1e1e] shadow-lg">
                          <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                            <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                            <button 
                              onClick={() => navigator.clipboard.writeText(String(children).replace(/\n$/, ''))}
                              className="text-gray-400 hover:text-white transition flex items-center gap-1.5 text-xs"
                            >
                              <FiCopy /> Copy code
                            </button>
                          </div>
                          <SyntaxHighlighter
                            {...props}
                            children={String(children).replace(/\n$/, '')}
                            style={vscDarkPlus}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{ margin: 0, padding: '1rem', background: 'transparent' }}
                          />
                        </div>
                      ) : (
                        <code {...props} className="bg-gray-100 dark:bg-gray-800 text-pink-600 dark:text-pink-400 px-1.5 py-0.5 rounded-md font-mono text-sm border border-gray-200 dark:border-gray-700">
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {displayedText}
                </ReactMarkdown>
                
                {isTyping && (
                  <span className="inline-block w-2 h-4 ml-1 bg-teal-500 animate-pulse"></span>
                )}
              </div>
            )}
          </div>

          {/* User File Attachments */}
          {message.attachments && message.attachments.length > 0 && (
            <div className={`mt-3 flex gap-2 flex-wrap ${isUser ? 'justify-end' : 'justify-start'}`}>
              {message.attachments.map((attachment, idx) => (
                <div key={idx} className="px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-sm rounded-lg text-xs font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2">
                  <span className="text-blue-500">📎</span> {attachment.name}
                </div>
              ))}
            </div>
          )}

          {/* AI Action Buttons */}
          {!isUser && !isTyping && (
            <div className="flex items-center gap-3 mt-4 px-1">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
              >
                {copiedText ? <><FiCheck className="text-green-500" /> Copied</> : <><FiCopy /> Copy</>}
              </button>
              {onRegenerate && (
                <button 
                  onClick={onRegenerate}
                  className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition"
                >
                  <FiRefreshCw /> Regenerate
                </button>
              )}
            </div>
          )}

        </div>
      </div>
    </motion.div>
  );
};

export default MessageBubble;
