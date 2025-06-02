import React from 'react';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { AuthWrapper } from '@/components/auth/AuthWrapper';
import { Dashboard } from '@/components/Dashboard';

const AppContent: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-radial-[at_25%_25%] from-white to-sky-500 to-75% flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <Dashboard /> : <AuthWrapper />;
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
};

export default App;
