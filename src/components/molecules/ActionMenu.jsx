import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/utils/cn';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const ActionMenu = ({ 
  trigger,
  items,
  className,
  align = 'right'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={cn('relative', className)} ref={menuRef}>
      <div onClick={() => setIsOpen(!isOpen)}>
        {trigger || (
          <Button variant="ghost" size="sm" icon="MoreHorizontal" />
        )}
      </div>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={cn(
              'absolute z-50 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1',
              align === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {items.map((item, index) => (
              <button
                key={index}
                onClick={() => {
                  item.onClick();
                  setIsOpen(false);
                }}
                className={cn(
                  'w-full px-4 py-2 text-left text-sm hover:bg-gray-50 flex items-center gap-3 transition-colors',
                  item.destructive && 'text-error hover:bg-error/5'
                )}
              >
                {item.icon && <ApperIcon name={item.icon} size={16} />}
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ActionMenu;