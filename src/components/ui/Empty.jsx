import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const Empty = ({ 
  icon = 'FileText',
  title = 'No data available',
  description = 'Get started by creating your first item',
  actionText,
  onAction
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-center py-12"
    >
      <div className="w-16 h-16 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
        <ApperIcon name={icon} size={32} className="text-primary" />
      </div>
      
      <h3 className="text-lg font-medium text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto">{description}</p>
      
      {actionText && onAction && (
        <Button
          onClick={onAction}
          variant="primary"
          icon="Plus"
        >
          {actionText}
        </Button>
      )}
    </motion.div>
  );
};

export default Empty;