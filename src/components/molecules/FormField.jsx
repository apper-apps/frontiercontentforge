import React from 'react';
import { cn } from '@/utils/cn';
import Label from '@/components/atoms/Label';
import Input from '@/components/atoms/Input';
import Select from '@/components/atoms/Select';
import Textarea from '@/components/atoms/Textarea';

const FormField = ({ 
  label,
  type = 'text',
  required = false,
  error,
  helpText,
  className,
  children,
  ...props 
}) => {
  const renderInput = () => {
    if (children) {
      return children;
    }

    switch (type) {
      case 'select':
        return <Select error={!!error} {...props} />;
      case 'textarea':
        return <Textarea error={!!error} {...props} />;
      default:
        return <Input type={type} error={!!error} {...props} />;
    }
  };

  return (
    <div className={cn('form-field', className)}>
      {label && (
        <Label required={required}>
          {label}
        </Label>
      )}
      {renderInput()}
      {error && (
        <p className="mt-1 text-sm text-error">{error}</p>
      )}
      {helpText && !error && (
        <p className="mt-1 text-sm text-gray-500">{helpText}</p>
      )}
    </div>
  );
};

export default FormField;