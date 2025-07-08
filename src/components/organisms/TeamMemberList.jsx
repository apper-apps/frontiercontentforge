import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import FormField from '@/components/molecules/FormField';
import SearchBar from '@/components/molecules/SearchBar';
import ActionMenu from '@/components/molecules/ActionMenu';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ConfirmationModal from '@/components/organisms/ConfirmationModal';
import teamService from '@/services/api/teamService';

const TeamMemberList = () => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [memberToDelete, setMemberToDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    role: 'Viewer'
  });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMembers();
  }, []);

  const loadMembers = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await teamService.getAll();
      setMembers(data);
    } catch (err) {
      setError(err.message || 'Failed to load team members');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) {
      errors.name = 'Name is required';
    } else if (!/^[a-zA-Z\s]+$/.test(formData.name)) {
      errors.name = 'Name can only contain letters and spaces';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.role) {
      errors.role = 'Role is required';
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setSubmitting(true);
    
    try {
      const newMember = await teamService.create(formData);
      setMembers(prev => [newMember, ...prev]);
      setFormData({ name: '', email: '', role: 'Viewer' });
      setShowAddForm(false);
      toast.success('Team member added successfully');
    } catch (error) {
      toast.error('Failed to add team member');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRoleChange = async (memberId, newRole) => {
    try {
      await teamService.update(memberId, { role: newRole });
      setMembers(prev => 
        prev.map(member => 
          member.Id === memberId ? { ...member, role: newRole } : member
        )
      );
      toast.success('Role updated successfully');
    } catch (error) {
      toast.error('Failed to update role');
    }
  };

  const handleDeleteMember = async () => {
    if (!memberToDelete) return;
    
    try {
      await teamService.delete(memberToDelete.Id);
      setMembers(prev => prev.filter(member => member.Id !== memberToDelete.Id));
      toast.success('Team member removed successfully');
      setShowDeleteModal(false);
      setMemberToDelete(null);
    } catch (error) {
      toast.error('Failed to remove team member');
    }
  };

  const confirmDelete = (member) => {
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const getRoleBadgeVariant = (role) => {
    switch (role) {
      case 'Admin':
        return 'error';
      case 'Editor':
        return 'primary';
      case 'Viewer':
        return 'secondary';
      default:
        return 'default';
    }
  };

  const filteredMembers = members.filter(member =>
    member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    member.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadMembers} />;

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Team Members</h2>
            <p className="text-gray-600 mt-1">
              {members.length} member{members.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <div className="flex items-center gap-3">
            <SearchBar
              placeholder="Search members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClear={() => setSearchTerm('')}
              className="sm:w-80"
            />
            <Button
              onClick={() => setShowAddForm(!showAddForm)}
              icon="Plus"
              variant={showAddForm ? 'secondary' : 'primary'}
            >
              {showAddForm ? 'Cancel' : 'Add Member'}
            </Button>
          </div>
        </div>

        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-gray-50 rounded-lg p-6 mb-6"
          >
            <h3 className="text-lg font-medium text-gray-900 mb-4">Add New Team Member</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Full Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  error={formErrors.name}
                  placeholder="Enter full name"
                />
                <FormField
                  label="Email Address"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  error={formErrors.email}
                  placeholder="Enter email address"
                />
              </div>
              <FormField
                label="Role"
                type="select"
                required
                value={formData.role}
                onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
                error={formErrors.role}
              >
                <option value="Viewer">Viewer</option>
                <option value="Editor">Editor</option>
                <option value="Admin">Admin</option>
              </FormField>
              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowAddForm(false)}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={submitting}
                  disabled={submitting}
                  icon="Plus"
                >
                  Add Member
                </Button>
              </div>
            </form>
          </motion.div>
        )}

        {filteredMembers.length === 0 ? (
          <Empty 
            icon="Users"
            title="No team members found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Start by adding your first team member'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Name</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Email</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Role</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Added</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member, index) => (
                  <motion.tr
                    key={member.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {member.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <span className="font-medium text-gray-900">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-gray-600">{member.email}</span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={member.role}
                        onChange={(e) => handleRoleChange(member.Id, e.target.value)}
                        className="text-sm border-none bg-transparent focus:outline-none"
                      >
                        <option value="Viewer">Viewer</option>
                        <option value="Editor">Editor</option>
                        <option value="Admin">Admin</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {format(new Date(member.addedAt), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <ActionMenu
                        items={[
                          {
                            label: 'Change Role',
                            icon: 'Shield',
                            onClick: () => {
                              // Could open a role change modal here
                              toast.info('Use the role dropdown to change roles');
                            }
                          },
                          {
                            label: 'Remove Member',
                            icon: 'Trash2',
                            onClick: () => confirmDelete(member),
                            destructive: true
                          }
                        ]}
                      />
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteMember}
        title="Remove Team Member"
        description={`Are you sure you want to remove ${memberToDelete?.name} from the team? This action cannot be undone.`}
        confirmText="Remove"
        variant="error"
      />
    </>
  );
};

export default TeamMemberList;