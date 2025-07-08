import React from 'react';
import { cn } from '@/utils/cn';

const Card = React.forwardRef(({ 
  className,
  children,
  ...props 
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn(
        'bg-white rounded-xl shadow-sm border border-gray-200 transition-all duration-200 hover:shadow-md',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
});

Card.displayName = 'Card';

export default Card;