export const APP_NAME = 'Enterprise RAG Framework';
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

export const CHAT_ROLES = {
  USER: 'user',
  AI: 'ai',
};

export const FILE_TYPES = {
  PDF: 'application/pdf',
  DOCX: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  DOC: 'application/msword',
};

export const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export const SUGGESTED_PROMPTS = [
  'Summarize the uploaded documents',
  'What are the key insights?',
  'Extract important data points',
  'Answer questions about the documents',
  'Find relevant information',
];

export const NAVIGATION_ITEMS = [
  { id: 'chat', label: 'Chat', icon: 'FiMessageCircle' },
  { id: 'documents', label: 'Documents', icon: 'FiFile' },
  { id: 'settings', label: 'Settings', icon: 'FiSettings' },
];
