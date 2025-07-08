import React from 'react';
import { motion } from 'framer-motion';
import Card from '@/components/atoms/Card';

const Loading = ({ type = 'default' }) => {
  if (type === 'table') {
    return (
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="loading-shimmer h-6 w-48 rounded"></div>
            <div className="loading-shimmer h-10 w-32 rounded"></div>
          </div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="loading-shimmer h-4 w-64 rounded"></div>
                <div className="loading-shimmer h-4 w-24 rounded"></div>
                <div className="loading-shimmer h-4 w-32 rounded"></div>
                <div className="loading-shimmer h-4 w-20 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  if (type === 'form') {
    return (
      <Card className="p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <div className="loading-shimmer h-8 w-64 rounded"></div>
            <div className="loading-shimmer h-4 w-96 rounded"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="loading-shimmer h-4 w-24 rounded"></div>
                <div className="loading-shimmer h-10 w-full rounded"></div>
              </div>
            ))}
          </div>
          <div className="flex justify-end">
            <div className="loading-shimmer h-10 w-32 rounded"></div>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="loading-shimmer h-8 w-64 rounded"></div>
        <div className="loading-shimmer h-4 w-96 rounded"></div>
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="loading-shimmer h-4 w-full rounded"></div>
          ))}
        </div>
      </div>
    </Card>
  );
};

export default Loading;