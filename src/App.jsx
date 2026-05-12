import React, { useState, useEffect } from 'react';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import ChatbotPage from './pages/ChatbotPage';
import DocumentManagementPage from './pages/DocumentManagementPage';
import SettingsPage from './pages/SettingsPage';
import { ThemeProvider } from './context/ThemeContext';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [authView, setAuthView] = useState('login');

  useEffect(() => {
    // Check if user is authenticated from localStorage
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return (
      <ThemeProvider>
        {authView === 'login' ? (
          <LoginPage 
            onLoginSuccess={handleLoginSuccess} 
            onGoToSignup={() => setAuthView('signup')} 
          />
        ) : (
          <SignupPage 
            onSignupSuccess={handleLoginSuccess} 
            onGoToLogin={() => setAuthView('login')} 
          />
        )}
      </ThemeProvider>
    );
  }

  return (
    <ThemeProvider>
      <div>
        {currentPage === 'dashboard' && (
          <DashboardPage
            onNavigateToChat={() => handleNavigate('chat')}
            onNavigateToDocuments={() => handleNavigate('documents')}
          />
        )}
        {currentPage === 'chat' && <ChatbotPage />}
        {currentPage === 'documents' && <DocumentManagementPage />}
        {currentPage === 'settings' && <SettingsPage />}
      </div>
    </ThemeProvider>
  );
}

export default App;
