import React from 'react';
import { cn } from '@/utils/cn';

const Textarea = React.forwardRef(({ 
  className,
  error = false,
  ...props 
}, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'w-full px-3 py-2 border rounded-lg shadow-sm transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent bg-white resize-vertical',
        error 
          ? 'border-error focus:ring-error' 
          : 'border-gray-300 hover:border-gray-400',
        className
      )}
      {...props}
    />
  );
});

Textarea.displayName = 'Textarea';

export default Textarea;