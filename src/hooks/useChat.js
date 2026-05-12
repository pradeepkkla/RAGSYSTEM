import { useState } from 'react';

export const useChat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: 'Welcome to Enterprise RAG Framework! How can I help you today?',
      sender: 'ai',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [documents, setDocuments] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const sendMessage = async (text, attachments = []) => {
    const userMessage = {
      id: Date.now(),
      text,
      sender: 'user',
      timestamp: new Date(),
      attachments,
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch('http://localhost:5000/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ question: text, chatId: currentChatId })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        if (!currentChatId && data.data.chat) {
          setCurrentChatId(data.data.chat._id);
        }
        
        const aiMessage = {
          id: Date.now() + 1,
          text: data.data.answer,
          sender: 'ai',
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } else {
        throw new Error(data.message || 'Failed to get answer');
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: `Error: ${error.message}. (Please check your backend terminal and ensure MongoDB and Gemini API keys are correct)`,
        sender: 'ai',
        timestamp: new Date(),
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const addDocument = (doc) => {
    setDocuments(prev => [...prev, { id: Date.now(), ...doc }]);
  };

  const removeDocument = (docId) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
  };

  const loadChat = async (chatId) => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem('auth_token');
      const response = await fetch(`http://localhost:5000/api/chat`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        const chat = data.data.find(c => c._id === chatId);
        if (chat) {
          setCurrentChatId(chat._id); // Ensure we set the current chat ID here!
          // Format messages for the UI
          const formattedMessages = chat.messages.map((m, i) => ({
            id: m._id || i,
            text: m.content,
            sender: m.role === 'user' ? 'user' : 'ai',
            timestamp: new Date(m.createdAt || Date.now())
          }));
          setMessages(formattedMessages);
        }
      }
    } catch (err) {
      console.error("Failed to load chat", err);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    isLoading,
    documents,
    sendMessage,
    addDocument,
    removeDocument,
    loadChat
  };
};
