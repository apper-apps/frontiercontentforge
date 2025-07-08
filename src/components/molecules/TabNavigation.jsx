import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/utils/cn';
import ApperIcon from '@/components/ApperIcon';

const TabNavigation = ({ tabs, className }) => {
  return (
    <nav className={cn('border-b border-gray-200', className)}>
      <div className="flex space-x-8">
        {tabs.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            className={({ isActive }) =>
              cn(
                'py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 flex items-center gap-2',
                isActive
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              )
            }
          >
            <ApperIcon name={tab.icon} size={18} />
            {tab.label}
          </NavLink>
        ))}
      </div>
    </nav>
  );
};

export default TabNavigation;