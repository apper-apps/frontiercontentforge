import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Button = React.forwardRef(({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  children, 
  ...props 
}, ref) => {
  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white shadow-lg hover:shadow-xl',
    secondary: 'bg-white hover:bg-gray-50 text-gray-900 border border-gray-300 shadow-sm hover:shadow-md',
    outline: 'border border-primary text-primary hover:bg-primary hover:text-white',
    ghost: 'text-gray-700 hover:text-gray-900 hover:bg-gray-100',
    success: 'bg-gradient-to-r from-success to-green-600 hover:from-success/90 hover:to-green-600/90 text-white shadow-lg hover:shadow-xl',
    warning: 'bg-gradient-to-r from-warning to-orange-600 hover:from-warning/90 hover:to-orange-600/90 text-white shadow-lg hover:shadow-xl',
    error: 'bg-gradient-to-r from-error to-red-600 hover:from-error/90 hover:to-red-600/90 text-white shadow-lg hover:shadow-xl'
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
    xl: 'px-8 py-4 text-lg'
  };

  const iconSizes = {
    sm: 16,
    md: 18,
    lg: 20,
    xl: 24
  };

  return (
    <motion.button
      ref={ref}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading && (
        <ApperIcon 
          name="Loader2" 
          size={iconSizes[size]} 
          className="animate-spin" 
        />
      )}
      {!loading && icon && iconPosition === 'left' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
        />
      )}
      {children}
      {!loading && icon && iconPosition === 'right' && (
        <ApperIcon 
          name={icon} 
          size={iconSizes[size]} 
        />
      )}
    </motion.button>
  );
});

Button.displayName = 'Button';

export default Button;