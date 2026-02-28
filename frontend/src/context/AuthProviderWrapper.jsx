import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider } from './AuthContext';

const AuthProviderWrapper = ({ children }) => {
  const navigate = useNavigate();
  console.log(' AuthProviderWrapper - navigate available:', !!navigate);
  
  // IMPORTANT: navigate function ko prop ke through pass karo
  return (
    <AuthProvider navigate={navigate}>
      {children}
    </AuthProvider>
  );
};

export default AuthProviderWrapper;