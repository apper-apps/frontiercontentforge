import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import Layout from '@/components/organisms/Layout';
import GenerateContent from '@/components/pages/GenerateContent';
import MyDocuments from '@/components/pages/MyDocuments';
import Team from '@/components/pages/Team';
import Brands from '@/components/pages/Brands';

function App() {
  return (
    <div className="min-h-screen bg-white">
      <Layout>
        <Routes>
<Route path="/" element={<GenerateContent />} />
          <Route path="/generate" element={<GenerateContent />} />
          <Route path="/documents" element={<MyDocuments />} />
          <Route path="/brands" element={<Brands />} />
          <Route path="/team" element={<Team />} />
        </Routes>
      </Layout>
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
    </div>
  );
}

export default App;