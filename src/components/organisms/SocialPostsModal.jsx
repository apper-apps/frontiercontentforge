import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import Button from '@/components/atoms/Button';
import Card from '@/components/atoms/Card';
import ApperIcon from '@/components/ApperIcon';

const SocialPostsModal = ({ isOpen, onClose, document, socialPosts, loading }) => {
  if (!document) return null;

  const copyToClipboard = (text, platform) => {
    navigator.clipboard.writeText(text);
    toast.success(`${platform} post copied to clipboard`);
  };

  const platforms = [
    { key: 'twitter', name: 'Twitter', icon: 'Twitter', color: 'text-blue-500' },
    { key: 'facebook', name: 'Facebook', icon: 'Facebook', color: 'text-blue-600' },
    { key: 'linkedin', name: 'LinkedIn', icon: 'Linkedin', color: 'text-blue-700' },
    { key: 'googleBusiness', name: 'Google Business', icon: 'MapPin', color: 'text-green-600' }
  ];

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
                <h2 className="text-xl font-bold text-gray-900">Social Media Posts</h2>
                <p className="text-sm text-gray-600 mt-1">
                  Generated for: {document.title}
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
              {loading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <ApperIcon name="Loader2" size={32} className="animate-spin text-primary mx-auto mb-4" />
                    <p className="text-gray-600">Generating social media posts...</p>
                  </div>
                </div>
              ) : socialPosts ? (
                <div className="space-y-6">
                  {platforms.map((platform) => (
                    <Card key={platform.key} className="p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <ApperIcon 
                          name={platform.icon} 
                          size={20} 
                          className={platform.color}
                        />
                        <h3 className="font-medium text-gray-900">{platform.name}</h3>
                      </div>
                      
                      <div className="bg-gray-50 rounded-lg p-4 mb-3">
                        <p className="text-gray-700 leading-relaxed">
                          {socialPosts[platform.key]}
                        </p>
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          variant="outline"
                          size="sm"
                          icon="Copy"
                          onClick={() => copyToClipboard(socialPosts[platform.key], platform.name)}
                        >
                          Copy
                        </Button>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <ApperIcon name="AlertCircle" size={48} className="text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600">No social posts available</p>
                </div>
              )}
            </div>
            
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
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

export default SocialPostsModal;