import React from 'react';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './components/Dashboard';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <div className="min-h-screen">
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        </div>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;