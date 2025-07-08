import React from 'react';
import { cn } from '@/utils/cn';
import Input from '@/components/atoms/Input';
import ApperIcon from '@/components/ApperIcon';

const SearchBar = ({ 
  className,
  placeholder = 'Search...',
  value,
  onChange,
  onClear,
  ...props 
}) => {
  return (
    <div className={cn('relative', className)}>
      <ApperIcon 
        name="Search" 
        size={18} 
        className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="pl-10 pr-10"
        {...props}
      />
      {value && onClear && (
        <button
          onClick={onClear}
          className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ApperIcon name="X" size={16} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;