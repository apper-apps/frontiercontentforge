import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ContentModal = ({ isOpen, onClose, document }) => {
  if (!document) return null;

  const renderContent = () => {
    try {
      const htmlContent = marked(document.content);
      const sanitizedContent = DOMPurify.sanitize(htmlContent);
      return { __html: sanitizedContent };
    } catch (error) {
      return { __html: '<p>Error rendering content</p>' };
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden"
          >
<div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div>
                <h2 className="text-xl font-bold text-gray-900">{document.title}</h2>
                <p className="text-sm text-gray-600 mt-1">
                  {document.contentType} • {document.keywords}
                </p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                icon="X"
                onClick={onClose}
                className="flex-shrink-0"
              />
            </div>

            {/* NeuronWriter Information Section */}
            {(document.neuronwriterUrl || document.neuronwriterquerylink || document.neuronwriterscore || document.keyworddensity || document.readabilityscore) && (
              <div className="mx-6 mt-4 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg border border-purple-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="BarChart3" size={20} className="text-purple-600" />
                    <h3 className="text-lg font-semibold text-gray-900">NeuronWriter Analysis</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {document.neuronwriterUrl && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon="ExternalLink"
                        onClick={() => window.open(document.neuronwriterUrl, '_blank')}
                        className="text-xs"
                      >
                        View Analysis
                      </Button>
                    )}
                    {document.neuronwriterquerylink && (
                      <Button
                        variant="outline"
                        size="sm"
                        icon="Search"
                        onClick={() => window.open(document.neuronwriterquerylink, '_blank')}
                        className="text-xs"
                      >
                        View Query
                      </Button>
                    )}
                  </div>
                </div>
                
                {(document.neuronwriterscore || document.keyworddensity || document.readabilityscore) && (
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {document.neuronwriterscore && (
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">NeuronWriter Score</div>
                        <div className="text-2xl font-bold text-purple-600">{document.neuronwriterscore}%</div>
                      </div>
                    )}
                    {document.keyworddensity && (
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Keyword Density</div>
                        <div className="text-2xl font-bold text-blue-600">{document.keyworddensity}%</div>
                      </div>
                    )}
                    {document.readabilityscore && (
                      <div className="bg-white p-3 rounded-md shadow-sm">
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Readability Score</div>
                        <div className="text-2xl font-bold text-green-600">{document.readabilityscore}%</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
            
            <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              <div 
                className="markdown-content"
                dangerouslySetInnerHTML={renderContent()}
              />
            </div>
            
            <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center gap-4">
                {document.googleDocUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="ExternalLink"
                    onClick={() => window.open(document.googleDocUrl, '_blank')}
                  >
                    Open in Google Docs
                  </Button>
                )}
              </div>
              
              <Button
                variant="secondary"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ContentModal;