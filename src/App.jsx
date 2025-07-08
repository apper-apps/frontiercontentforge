import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import Layout from '@/components/organisms/Layout';
import ProtectedRoute from '@/components/ProtectedRoute';
import Login from '@/components/pages/Login';
import GenerateContent from '@/components/pages/GenerateContent';
import MyDocuments from '@/components/pages/MyDocuments';
import Team from '@/components/pages/Team';
import Brands from '@/components/pages/Brands';
import Settings from '@/components/pages/Settings';

const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <ProtectedRoute>
          <Routes>
            <Route path="/" element={<GenerateContent />} />
            <Route path="/generate" element={<GenerateContent />} />
            <Route path="/documents" element={<MyDocuments />} />
            <Route path="/brands" element={<Brands />} />
            <Route path="/team" element={<Team />} />
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </ProtectedRoute>
      </Layout>
    </div>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="z-[9999]"
      />
    </AuthProvider>
  );
}

export default App;