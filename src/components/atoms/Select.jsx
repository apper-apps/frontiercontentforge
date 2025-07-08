import React from 'react';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const Select = React.forwardRef(({ 
  className,
  error = false,
  children,
  ...props 
}, ref) => {
  return (
    <div className="relative">
      <select
        ref={ref}
        className={cn(
          'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white appearance-none pr-10',
          error 
            ? 'border-error focus:ring-error' 
            : 'border-gray-300 hover:border-gray-400',
          className
        )}
        {...props}
      >
        {children}
      </select>
      <ApperIcon 
        name="ChevronDown" 
        size={16} 
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
      />
    </div>
  );
});

Select.displayName = 'Select';

export default Select;