import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import LoadingScreen from './LoadingScreen';
import LoginForm from './LoginForm';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;