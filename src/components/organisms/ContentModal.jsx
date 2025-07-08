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
            
            <div className="p-6 overflow-y-auto custom-scrollbar" style={{ maxHeight: 'calc(90vh - 140px)' }}>
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
                {document.neuronwriterUrl && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon="BarChart3"
                    onClick={() => window.open(document.neuronwriterUrl, '_blank')}
                  >
                    View SEO Analysis
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