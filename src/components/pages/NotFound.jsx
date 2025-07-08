import React from 'react';
import { Link } from 'react-router-dom';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <ApperIcon name="FileQuestion" size={64} className="mx-auto text-gray-400 mb-4" />
        <h1 className="text-4xl font-bold text-gray-900 mb-2">404</h1>
        <p className="text-gray-600 mb-6">Page not found</p>
        <Link to="/">
          <Button>
            <ApperIcon name="Home" size={16} className="mr-2" />
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;