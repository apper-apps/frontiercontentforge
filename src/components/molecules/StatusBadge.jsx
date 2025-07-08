import React from 'react';
import Badge from '@/components/atoms/Badge';
import ApperIcon from '@/components/ApperIcon';

const StatusBadge = ({ status, showIcon = true }) => {
  const getStatusConfig = (status) => {
    switch (status?.toLowerCase()) {
      case 'draft':
        return { variant: 'draft', icon: 'FileText', text: 'Draft' };
      case 'ready to review':
        return { variant: 'ready', icon: 'Clock', text: 'Ready to Review' };
      case 'completed':
        return { variant: 'completed', icon: 'CheckCircle', text: 'Completed' };
      case 'processing':
        return { variant: 'processing', icon: 'Loader2', text: 'Processing' };
      default:
        return { variant: 'default', icon: 'FileText', text: status || 'Unknown' };
    }
  };

  const { variant, icon, text } = getStatusConfig(status);

  return (
    <Badge variant={variant} className="inline-flex items-center gap-1">
      {showIcon && (
        <ApperIcon 
          name={icon} 
          size={12} 
          className={icon === 'Loader2' ? 'animate-spin' : ''}
        />
      )}
      {text}
    </Badge>
  );
};

export default StatusBadge;