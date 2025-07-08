import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import Badge from '@/components/atoms/Badge';
import SearchBar from '@/components/molecules/SearchBar';
import StatusBadge from '@/components/molecules/StatusBadge';
import ActionMenu from '@/components/molecules/ActionMenu';
import ApperIcon from '@/components/ApperIcon';
import Loading from '@/components/ui/Loading';
import Error from '@/components/ui/Error';
import Empty from '@/components/ui/Empty';
import ContentModal from '@/components/organisms/ContentModal';
import SocialPostsModal from '@/components/organisms/SocialPostsModal';
import ConfirmationModal from '@/components/organisms/ConfirmationModal';
import documentService from '@/services/api/documentService';

const DocumentList = ({ refreshTrigger }) => {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);
  const [showSocialModal, setShowSocialModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);
  const [socialPosts, setSocialPosts] = useState(null);
  const [generatingSocial, setGeneratingSocial] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [refreshTrigger]);

  const loadDocuments = async () => {
    setLoading(true);
    setError('');
    
    try {
      const data = await documentService.getAll();
      setDocuments(data);
    } catch (err) {
      setError(err.message || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (documentId, newStatus) => {
    try {
      await documentService.update(documentId, { status: newStatus });
      setDocuments(prev => 
        prev.map(doc => 
          doc.Id === documentId ? { ...doc, status: newStatus } : doc
        )
      );
      toast.success('Document status updated successfully');
    } catch (error) {
      toast.error('Failed to update document status');
    }
  };

  const handleViewContent = (document) => {
    setSelectedDocument(document);
    setShowContentModal(true);
  };

  const handleGenerateSocial = async (document) => {
    setGeneratingSocial(true);
    setSelectedDocument(document);
    
    try {
      const posts = await documentService.generateSocialPosts(document.Id);
      setSocialPosts(posts);
      setShowSocialModal(true);
    } catch (error) {
      toast.error('Failed to generate social posts');
    } finally {
      setGeneratingSocial(false);
    }
  };

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;
    
    try {
      await documentService.delete(documentToDelete.Id);
      setDocuments(prev => prev.filter(doc => doc.Id !== documentToDelete.Id));
      toast.success('Document deleted successfully');
      setShowDeleteModal(false);
      setDocumentToDelete(null);
    } catch (error) {
      toast.error('Failed to delete document');
    }
  };

  const confirmDelete = (document) => {
    setDocumentToDelete(document);
    setShowDeleteModal(true);
  };

  const openNeuronwriter = (document) => {
    if (document.neuronwriterUrl) {
      window.open(document.neuronwriterUrl, '_blank');
    } else {
      toast.info('Neuronwriter analysis not available for this document');
    }
  };

  const filteredDocuments = documents.filter(doc =>
    doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.keywords.toLowerCase().includes(searchTerm.toLowerCase()) ||
    doc.contentType.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadDocuments} />;

  return (
    <>
      <Card className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Documents</h2>
            <p className="text-gray-600 mt-1">
              {documents.length} document{documents.length !== 1 ? 's' : ''} total
            </p>
          </div>
          <SearchBar
            placeholder="Search documents..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onClear={() => setSearchTerm('')}
            className="sm:w-80"
          />
        </div>

        {filteredDocuments.length === 0 ? (
          <Empty 
            icon="FileText"
            title="No documents found"
            description={searchTerm ? 'Try adjusting your search terms' : 'Start by generating your first AI-powered content'}
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Keywords</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredDocuments.map((document, index) => (
                  <motion.tr
                    key={document.Id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-4 px-4">
                      <div className="font-medium text-gray-900 line-clamp-2">
                        {document.title}
                      </div>
                    </td>
                    <td className="py-4 px-4">
                      <Badge variant="secondary" size="sm">
                        {document.contentType}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {document.keywords}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <select
                        value={document.status}
                        onChange={(e) => handleStatusChange(document.Id, e.target.value)}
                        className="text-sm border-none bg-transparent focus:outline-none"
                      >
                        <option value="Draft">Draft</option>
                        <option value="Ready to Review">Ready to Review</option>
                        <option value="Completed">Completed</option>
                      </select>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-600">
                        {format(new Date(document.createdAt), 'MMM d, yyyy')}
                      </span>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          icon="Eye"
                          onClick={() => handleViewContent(document)}
                        />
                        <ActionMenu
                          items={[
                            {
                              label: 'View Content',
                              icon: 'Eye',
                              onClick: () => handleViewContent(document)
                            },
                            {
                              label: 'Generate Social Posts',
                              icon: 'Share2',
                              onClick: () => handleGenerateSocial(document)
                            },
                            {
                              label: 'Open in Google Docs',
                              icon: 'ExternalLink',
                              onClick: () => window.open(document.googleDocUrl, '_blank')
                            },
                            ...(document.neuronwriterUrl ? [{
                              label: 'View Neuronwriter Analysis',
                              icon: 'BarChart3',
                              onClick: () => openNeuronwriter(document)
                            }] : []),
                            {
                              label: 'Delete',
                              icon: 'Trash2',
                              onClick: () => confirmDelete(document),
                              destructive: true
                            }
                          ]}
                        />
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Content Modal */}
      <ContentModal
        isOpen={showContentModal}
        onClose={() => setShowContentModal(false)}
        document={selectedDocument}
      />

      {/* Social Posts Modal */}
      <SocialPostsModal
        isOpen={showSocialModal}
        onClose={() => setShowSocialModal(false)}
        document={selectedDocument}
        socialPosts={socialPosts}
        loading={generatingSocial}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteDocument}
        title="Delete Document"
        description={`Are you sure you want to delete "${documentToDelete?.title}"? This action cannot be undone.`}
        confirmText="Delete"
        variant="error"
      />
    </>
  );
};

export default DocumentList;