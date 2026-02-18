import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthProvider as OriginalAuthProvider } from './AuthContext';

// Wrapper component that provides navigate to AuthProvider
const AuthProviderWithRouter = ({ children }) => {
  const navigate = useNavigate();
  
  return (
    <OriginalAuthProvider navigate={navigate}>
      {children}
    </OriginalAuthProvider>
  );
};

export default AuthProviderWithRouter;