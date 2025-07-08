import React from 'react';
import { motion } from 'framer-motion';
import TabNavigation from '@/components/molecules/TabNavigation';
import ApperIcon from '@/components/ApperIcon';

const Layout = ({ children }) => {
const tabs = [
    { path: '/generate', label: 'Generate Content', icon: 'Sparkles' },
    { path: '/documents', label: 'My Documents', icon: 'FileText' },
    { path: '/brands', label: 'Brands', icon: 'Building2' },
    { path: '/team', label: 'Team', icon: 'Users' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                <ApperIcon name="Sparkles" size={20} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">ContentForge AI</h1>
                <p className="text-xs text-gray-500">AI-Powered Content Generation</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>AI Systems Online</span>
              </div>
              <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                <ApperIcon name="User" size={16} className="text-white" />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <TabNavigation tabs={tabs} />
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;