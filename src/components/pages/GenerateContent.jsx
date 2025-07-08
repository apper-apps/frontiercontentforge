import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ContentGenerationForm from '@/components/organisms/ContentGenerationForm';
import ApperIcon from '@/components/ApperIcon';

const GenerateContent = () => {
  const [lastGeneratedDocument, setLastGeneratedDocument] = useState(null);

  const handleDocumentCreated = (document) => {
    setLastGeneratedDocument(document);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-full text-sm font-medium mb-4"
        >
          <ApperIcon name="Sparkles" size={16} />
          AI-Powered Content Generation
        </motion.div>
        
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-4xl font-bold text-gray-900 mb-4"
        >
          Create SEO-Optimized Content
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl text-gray-600 max-w-3xl mx-auto"
        >
          Generate high-quality content using advanced AI technology, complete with SEO optimization,
          Google Docs integration, and Neuronwriter analysis.
        </motion.p>
      </div>

      {/* Features */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Brain" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">AI Content Generation</h3>
          <p className="text-gray-600">
            Leverage Claude Sonnet 4 and Perplexity API for intelligent content creation and optimization.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="FileText" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Google Docs Integration</h3>
          <p className="text-gray-600">
            Automatically generate and store your content in Google Docs for easy collaboration.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary to-purple-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="BarChart3" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">SEO Analysis</h3>
          <p className="text-gray-600">
            Comprehensive SEO analysis and optimization through Neuronwriter integration.
          </p>
        </div>
      </motion.div>

      {/* Content Generation Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ContentGenerationForm onDocumentCreated={handleDocumentCreated} />
      </motion.div>

      {/* Success Message */}
      {lastGeneratedDocument && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-success/10 to-green-600/10 border border-success/20 rounded-lg p-6"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-success to-green-600 rounded-full flex items-center justify-center">
              <ApperIcon name="CheckCircle" size={24} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Content Generated Successfully!</h3>
              <p className="text-gray-600 mt-1">
                "{lastGeneratedDocument.title}" has been created and is ready for review.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default GenerateContent;