import React, { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { toast } from "react-toastify";
import ApperIcon from "@/components/ApperIcon";
import ConfirmationModal from "@/components/organisms/ConfirmationModal";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Input from "@/components/atoms/Input";
import Empty from "@/components/ui/Empty";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import FormField from "@/components/molecules/FormField";
import SearchBar from "@/components/molecules/SearchBar";
import brandService from "@/services/api/brandService";

const Brands = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState(null);
  const [editingLocation, setEditingLocation] = useState(null);
  const [selectedBrandForLocation, setSelectedBrandForLocation] = useState(null);
  const [expandedBrand, setExpandedBrand] = useState(null);
  const [deleteModal, setDeleteModal] = useState({ show: false, type: null, item: null });
const [formData, setFormData] = useState({
    name: '',
    apiKey: '',
    projectId: '',
    description: '',
    websiteUrl: '',
    searchEngine: 'google.com',
    language: 'English'
  });
  const [locationFormData, setLocationFormData] = useState({
    name: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    phone: ''
  });

  useEffect(() => {
    loadBrands();
  }, []);

  const loadBrands = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await brandService.getAll();
      setBrands(data);
    } catch (err) {
      setError(err.message);
      toast.error('Failed to load brands');
    } finally {
      setLoading(false);
    }
  };

const filteredBrands = brands.filter(brand =>
    brand?.Name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBrand = () => {
    setEditingBrand(null);
setFormData({
      name: '',
      apiKey: '',
      projectId: '',
      description: '',
      websiteUrl: '',
      searchEngine: 'google.com',
      language: 'English'
    });
    setShowModal(true);
  };

const handleEditBrand = (brand) => {
    setEditingBrand(brand);
    setFormData({
      name: brand.Name || '',
      apiKey: brand.apiKey || '',
      projectId: brand.projectId || '',
      description: brand.description || '',
      websiteUrl: brand.websiteURL || '',
      searchEngine: (brand.defaultSearchEngine === 'google.ca') ? 'google.ca' : 'google.com',
      language: brand.language || 'English'
    });
    setShowModal(true);
  };

  const handleSubmitBrand = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Brand name is required');
      return;
    }

    try {
      if (editingBrand) {
        const updatedBrand = await brandService.update(editingBrand.Id, formData);
        setBrands(prev => prev.map(brand => 
          brand.Id === editingBrand.Id ? updatedBrand : brand
        ));
        toast.success('Brand updated successfully');
      } else {
        const newBrand = await brandService.create(formData);
        setBrands(prev => [...prev, newBrand]);
        toast.success('Brand created successfully');
      }
      
      setShowModal(false);
setFormData({
        name: '',
        apiKey: '',
        projectId: '',
        description: '',
        websiteUrl: '',
        searchEngine: 'google.com',
        language: 'English'
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteBrand = async () => {
    try {
      await brandService.delete(deleteModal.item.Id);
      setBrands(prev => prev.filter(brand => brand.Id !== deleteModal.item.Id));
      toast.success('Brand deleted successfully');
      setDeleteModal({ show: false, type: null, item: null });
      if (expandedBrand === deleteModal.item.Id) {
        setExpandedBrand(null);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleCreateLocation = (brand) => {
    setSelectedBrandForLocation(brand);
    setEditingLocation(null);
    setLocationFormData({
      name: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      phone: ''
    });
    setShowLocationModal(true);
  };

  const handleEditLocation = (brand, location) => {
    setSelectedBrandForLocation(brand);
    setEditingLocation(location);
    setLocationFormData({
      name: location.name || '',
      address: location.address || '',
      city: location.city || '',
      state: location.state || '',
      zipCode: location.zipCode || '',
      phone: location.phone || ''
    });
    setShowLocationModal(true);
  };

  const handleSubmitLocation = async (e) => {
    e.preventDefault();
    
    if (!locationFormData.name.trim()) {
      toast.error('Location name is required');
      return;
    }

    try {
      if (editingLocation) {
        await brandService.updateLocation(
          selectedBrandForLocation.Id, 
          editingLocation.Id, 
          locationFormData
        );
        toast.success('Location updated successfully');
      } else {
        await brandService.createLocation(
          selectedBrandForLocation.Id, 
          locationFormData
        );
        toast.success('Location created successfully');
      }
      
      // Reload brands to get updated location data
      await loadBrands();
      setShowLocationModal(false);
      setLocationFormData({
        name: '',
        address: '',
        city: '',
        state: '',
        zipCode: '',
        phone: ''
      });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleDeleteLocation = async () => {
    try {
      await brandService.deleteLocation(
        deleteModal.item.brandId, 
        deleteModal.item.Id
      );
      await loadBrands();
      toast.success('Location deleted successfully');
      setDeleteModal({ show: false, type: null, item: null });
    } catch (error) {
      toast.error(error.message);
    }
  };

  const toggleBrandExpansion = (brandId) => {
    setExpandedBrand(expandedBrand === brandId ? null : brandId);
  };

  if (loading) return <Loading />;
  if (error) return <Error message={error} onRetry={loadBrands} />;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Brand Management</h1>
          <p className="text-gray-600 mt-1">
            Manage your brands, NeuronWriter API settings, and locations
          </p>
        </div>
        <Button onClick={handleCreateBrand} className="w-full sm:w-auto">
          <ApperIcon name="Plus" size={16} className="mr-2" />
          Add Brand
        </Button>
      </div>

      {/* Search */}
      <div className="max-w-md">
        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Search brands..."
        />
      </div>

      {/* Brands List */}
      {filteredBrands.length === 0 ? (
        <Empty 
          title="No brands found"
          description={searchTerm ? "No brands match your search criteria." : "Get started by creating your first brand."}
          action={!searchTerm && (
            <Button onClick={handleCreateBrand}>
              <ApperIcon name="Plus" size={16} className="mr-2" />
              Add Brand
            </Button>
          )}
        />
      ) : (
        <div className="grid gap-4">
          {filteredBrands.map((brand) => (
            <motion.div
              key={brand.Id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                <div className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                          <ApperIcon name="Building2" size={20} className="text-white" />
                        </div>
<div>
                          <h3 className="text-lg font-semibold text-gray-900">{brand.Name}</h3>
                          {brand.description && (
                            <p className="text-sm text-gray-600 mt-1">{brand.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="Key" size={14} />
                          <span className="font-medium">API Key:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {brand.apiKey ? `${brand.apiKey.substring(0, 8)}...` : 'Not set'}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="FolderOpen" size={14} />
                          <span className="font-medium">Project ID:</span>
                          <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                            {brand.projectId || 'Not set'}
                          </span>
                        </div>
                      </div>

                      {brand.locations && brand.locations.length > 0 && (
                        <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
                          <ApperIcon name="MapPin" size={14} />
                          <span>{brand.locations.length} location{brand.locations.length !== 1 ? 's' : ''}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => toggleBrandExpansion(brand.Id)}
                        className="p-2"
                      >
                        <ApperIcon 
                          name={expandedBrand === brand.Id ? "ChevronUp" : "ChevronDown"} 
                          size={16} 
                        />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditBrand(brand)}
                        className="p-2"
                      >
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setDeleteModal({ 
                          show: true, 
                          type: 'brand', 
                          item: brand 
                        })}
                        className="p-2 text-error hover:bg-red-50"
                      >
                        <ApperIcon name="Trash2" size={16} />
                      </Button>
                    </div>
                  </div>

                  {/* Locations Section */}
                  <AnimatePresence>
                    {expandedBrand === brand.Id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="mt-6 pt-6 border-t border-gray-200"
                      >
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="text-md font-medium text-gray-900">Locations</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleCreateLocation(brand)}
                          >
                            <ApperIcon name="Plus" size={14} className="mr-1" />
                            Add Location
                          </Button>
                        </div>

                        {!brand.locations || brand.locations.length === 0 ? (
                          <div className="text-center py-8 text-gray-500">
                            <ApperIcon name="MapPin" size={24} className="mx-auto mb-2 text-gray-400" />
                            <p>No locations added yet</p>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleCreateLocation(brand)}
                              className="mt-2"
                            >
                              Add your first location
                            </Button>
                          </div>
                        ) : (
                          <div className="grid gap-3">
                            {brand.locations.map((location) => (
                              <div
                                key={location.Id}
                                className="bg-gray-50 rounded-lg p-4 flex items-start justify-between"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-2">
                                    <ApperIcon name="MapPin" size={16} className="text-gray-600" />
                                    <h5 className="font-medium text-gray-900">{location.name}</h5>
                                  </div>
                                  {location.address && (
                                    <p className="text-sm text-gray-600 mb-1">
                                      {location.address}
                                      {location.city && `, ${location.city}`}
                                      {location.state && `, ${location.state}`}
                                      {location.zipCode && ` ${location.zipCode}`}
                                    </p>
                                  )}
                                  {location.phone && (
                                    <p className="text-sm text-gray-600">
                                      <ApperIcon name="Phone" size={12} className="inline mr-1" />
                                      {location.phone}
                                    </p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1 ml-4">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleEditLocation(brand, location)}
                                    className="p-1"
                                  >
                                    <ApperIcon name="Edit" size={14} />
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => setDeleteModal({ 
                                      show: true, 
                                      type: 'location', 
                                      item: { ...location, brandId: brand.Id }
                                    })}
                                    className="p-1 text-error hover:bg-red-50"
                                  >
                                    <ApperIcon name="Trash2" size={14} />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Brand Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingBrand ? 'Edit Brand' : 'Create Brand'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowModal(false)}
                    className="p-2"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                <form onSubmit={handleSubmitBrand} className="space-y-4">
                  <FormField
                    label="Brand Name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter brand name"
                  />

                  <FormField
                    label="Description"
                    type="textarea"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description of the brand"
                  />

                  <FormField
                    label="NeuronWriter API Key"
                    type="text"
                    value={formData.apiKey}
                    onChange={(e) => setFormData(prev => ({ ...prev, apiKey: e.target.value }))}
                    placeholder="Enter API key"
                  />

                  <FormField
                    label="NeuronWriter Project ID"
                    type="text"
                    value={formData.projectId}
                    onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                    placeholder="Enter project ID"
/>

                  <FormField
                    label="Website URL"
                    type="url"
                    value={formData.websiteUrl}
                    onChange={(e) => setFormData(prev => ({ ...prev, websiteUrl: e.target.value }))}
                    placeholder="https://example.com"
                  />

<FormField
                    label="Default Search Engine"
                    type="select"
                    value={formData.searchEngine}
                    onChange={(e) => setFormData(prev => ({ ...prev, searchEngine: e.target.value }))}
                  >
                    <option value="google.com">Google.com</option>
                    <option value="google.ca">Google.ca</option>
                  </FormField>

                  <FormField
                    label="Language"
                    type="text"
                    value={formData.language}
                    onChange={(e) => setFormData(prev => ({ ...prev, language: e.target.value }))}
                    placeholder="English"
                  />
                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingBrand ? 'Update' : 'Create'} Brand
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Location Modal */}
      <AnimatePresence>
        {showLocationModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={() => setShowLocationModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-semibold text-gray-900">
                    {editingLocation ? 'Edit Location' : 'Add Location'}
                  </h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowLocationModal(false)}
                    className="p-2"
                  >
                    <ApperIcon name="X" size={16} />
                  </Button>
                </div>

                {selectedBrandForLocation && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
<p className="text-sm text-gray-600">Adding location to:</p>
                    <p className="font-medium text-gray-900">{selectedBrandForLocation.Name}</p>
                  </div>
                )}

                <form onSubmit={handleSubmitLocation} className="space-y-4">
                  <FormField
                    label="Location Name"
                    type="text"
                    required
                    value={locationFormData.name}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter location name"
                  />

                  <FormField
                    label="Address"
                    type="text"
                    value={locationFormData.address}
                    onChange={(e) => setLocationFormData(prev => ({ ...prev, address: e.target.value }))}
                    placeholder="Street address"
                  />

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="City"
                      type="text"
                      value={locationFormData.city}
                      onChange={(e) => setLocationFormData(prev => ({ ...prev, city: e.target.value }))}
                      placeholder="City"
                    />
                    <FormField
                      label="State"
                      type="text"
                      value={locationFormData.state}
                      onChange={(e) => setLocationFormData(prev => ({ ...prev, state: e.target.value }))}
                      placeholder="State"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <FormField
                      label="ZIP Code"
                      type="text"
                      value={locationFormData.zipCode}
                      onChange={(e) => setLocationFormData(prev => ({ ...prev, zipCode: e.target.value }))}
                      placeholder="ZIP"
                    />
                    <FormField
                      label="Phone"
                      type="tel"
                      value={locationFormData.phone}
                      onChange={(e) => setLocationFormData(prev => ({ ...prev, phone: e.target.value }))}
                      placeholder="Phone number"
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowLocationModal(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button type="submit" className="flex-1">
                      {editingLocation ? 'Update' : 'Add'} Location
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={deleteModal.show}
        onClose={() => setDeleteModal({ show: false, type: null, item: null })}
        onConfirm={deleteModal.type === 'brand' ? handleDeleteBrand : handleDeleteLocation}
        type="danger"
        title={`Delete ${deleteModal.type === 'brand' ? 'Brand' : 'Location'}`}
message={`Are you sure you want to delete ${deleteModal.item?.Name || deleteModal.item?.name}? This action cannot be undone.`}
      />
    </div>
  );
};

export default Brands;