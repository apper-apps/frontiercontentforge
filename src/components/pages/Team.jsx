import React from 'react';
import { motion } from 'framer-motion';
import TeamMemberList from '@/components/organisms/TeamMemberList';
import ApperIcon from '@/components/ApperIcon';

const Team = () => {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-gray-900"
        >
          Team Management
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-gray-600 mt-2"
        >
          Manage team members and their roles for collaborative content creation
        </motion.p>
      </div>

      {/* Role Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-red-500 to-red-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Shield" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Admin</h3>
          <p className="text-gray-600 text-sm">
            Full access to all features including team management, content generation, and system settings.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Edit" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Editor</h3>
          <p className="text-gray-600 text-sm">
            Can create, edit, and manage content. Access to content generation and document management.
          </p>
        </div>
        
        <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
          <div className="w-12 h-12 bg-gradient-to-r from-secondary to-blue-600 rounded-lg flex items-center justify-center mb-4">
            <ApperIcon name="Eye" size={24} className="text-white" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Viewer</h3>
          <p className="text-gray-600 text-sm">
            Read-only access to view documents and content. Cannot create or modify content.
          </p>
        </div>
      </motion.div>

      {/* Team Member List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <TeamMemberList />
      </motion.div>
    </div>
  );
};

export default Team;