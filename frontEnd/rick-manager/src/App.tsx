import React, { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';
import { GlobalStyles } from './styles/GlobalStyles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoginPage } from './components/LoginPage';
import { RegisterPage } from './components/RegisterPage';
import { CharactersPage } from './components/CharacterPage';
import { LoadingSpinner } from './components/LoadingSpinner';

type PageType = 'login' | 'register' | 'characters';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<PageType>('login');
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      setCurrentPage(user ? 'characters' : 'login');
    }
  }, [user, loading]);

  if (loading) {
    return <LoadingSpinner />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />;
      case 'register':
        return <RegisterPage onSwitchToLogin={() => setCurrentPage('login')} />;
      case 'characters':
        return user ? <CharactersPage /> : <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />;
      default:
        return <LoginPage onSwitchToRegister={() => setCurrentPage('register')} />;
    }
  };

  return (
    <>
      <GlobalStyles />
      {renderPage()}
      <Toaster 
        position="top-right"
        toastOptions={{
          style: {
            background: '#363636',
            color: '#fff',
          },
        }}
      />
    </>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
