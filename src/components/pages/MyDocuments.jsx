import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import documentService from '@/services/api/documentService';
import DocumentList from '@/components/organisms/DocumentList';
import ApperIcon from '@/components/ApperIcon';

const DocumentStats = () => {
  const [stats, setStats] = useState({
    total: 0,
    inReview: 0,
    completed: 0,
    seoOptimized: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const documents = await documentService.getAll();
      const total = documents.length;
      const inReview = documents.filter(doc => doc.status === 'Ready to Review').length;
      const completed = documents.filter(doc => doc.status === 'Completed').length;
      const seoOptimized = documents.filter(doc => doc.neuronwriterUrl).length;
      
      setStats({ total, inReview, completed, seoOptimized });
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm border border-gray-200 animate-pulse">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-8 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
            <ApperIcon name="FileText" size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Documents</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg flex items-center justify-center">
            <ApperIcon name="Clock" size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">In Review</p>
            <p className="text-2xl font-bold text-gray-900">{stats.inReview}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-success to-green-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="CheckCircle" size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-gray-900">{stats.completed}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-secondary to-purple-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="BarChart3" size={20} className="text-white" />
          </div>
          <div>
            <p className="text-sm text-gray-600">SEO Optimized</p>
            <p className="text-2xl font-bold text-gray-900">{stats.seoOptimized}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const MyDocuments = () => {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleRefresh = () => {
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold text-gray-900"
          >
            My Documents
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-gray-600 mt-2"
          >
            Manage, view, and optimize your AI-generated content
          </motion.p>
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <button
            onClick={handleRefresh}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <ApperIcon name="RefreshCw" size={16} />
            Refresh
          </button>
        </motion.div>
      </div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
      >
<DocumentStats />
      </motion.div>

      {/* Document List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <DocumentList refreshTrigger={refreshTrigger} />
      </motion.div>
    </div>
  );
};

export default MyDocuments;