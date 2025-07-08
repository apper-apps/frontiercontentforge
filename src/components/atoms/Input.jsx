import React from 'react';
import { cn } from '@/utils/cn';

const Input = React.forwardRef(({ 
  className,
  type = 'text',
  error = false,
  ...props 
}, ref) => {
  return (
    <input
      type={type}
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white',
        error 
          ? 'border-error focus:ring-error' 
          : 'border-gray-300 hover:border-gray-400',
        className
      )}
      {...props}
    />
  );
});

Input.displayName = 'Input';

export default Input;