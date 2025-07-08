import React from 'react';
import { cn } from '@/utils/cn';

const Badge = React.forwardRef(({ 
  className,
  variant = 'default',
  size = 'md',
  children,
  ...props 
}, ref) => {
  const variants = {
    default: 'bg-gray-100 text-gray-800',
    primary: 'bg-primary/10 text-primary',
    secondary: 'bg-secondary/10 text-secondary',
    success: 'bg-success/10 text-success',
    warning: 'bg-warning/10 text-warning',
    error: 'bg-error/10 text-error',
    info: 'bg-info/10 text-info',
    draft: 'bg-gray-100 text-gray-800',
    ready: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-green-100 text-green-800',
    processing: 'bg-blue-100 text-blue-800'
  };

  const sizes = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-0.5 text-xs',
    lg: 'px-3 py-1 text-sm'
  };

  return (
    <span
      ref={ref}
      className={cn(
        'inline-flex items-center rounded-full font-medium',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
});

Badge.displayName = 'Badge';

export default Badge;