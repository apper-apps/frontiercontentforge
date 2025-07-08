import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { useDebounce } from "@/utils/debounce";
import ApperIcon from "@/components/ApperIcon";
import Select from "@/components/atoms/Select";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import ProgressRing from "@/components/molecules/ProgressRing";
import FormField from "@/components/molecules/FormField";
import neuronwriterService from "@/services/api/neuronwriterService";
import brandService from "@/services/api/brandService";
import aiService from "@/services/api/aiService";
import documentService from "@/services/api/documentService";

const ContentGenerationForm = ({ onDocumentCreated }) => {
const [formData, setFormData] = useState({
    brandId: '',
    keywords: '',
    contentType: '',
    location: '',
    dbaField: ''
  });
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('');
  const [errors, setErrors] = useState({});
  const [brands, setBrands] = useState([]);
  const [brandsLoading, setBrandsLoading] = useState(false);
  const [brandsError, setBrandsError] = useState('');

  const debouncedKeywords = useDebounce(formData.keywords, 300);

  // Load brands on component mount
  useEffect(() => {
    const loadBrands = async () => {
      setBrandsLoading(true);
      setBrandsError('');
      try {
        const brandsList = await brandService.getAll();
        setBrands(brandsList);
      } catch (error) {
        setBrandsError('Failed to load brands');
        toast.error('Failed to load brands');
      } finally {
        setBrandsLoading(false);
      }
    };

    loadBrands();
  }, []);

const validateForm = () => {
    const newErrors = {};

    if (!formData.brandId) {
      newErrors.brandId = 'Brand selection is required';
    }

    if (!formData.keywords.trim()) {
      newErrors.keywords = 'Keywords are required';
    } else if (formData.keywords.length < 3 || formData.keywords.length > 100) {
      newErrors.keywords = 'Keywords must be between 3 and 100 characters';
    }

    if (!formData.contentType) {
      newErrors.contentType = 'Content type is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    setLoading(true);
    setProgress(0);
    setCurrentStep('Initializing AI content generation...');

    try {
      // Step 1: Initial content generation
      setProgress(20);
      setCurrentStep('Generating initial content with AI...');
      
      const initialContent = await aiService.generateContent(
        `Generate ${formData.contentType} content about ${formData.keywords}`,
        formData
      );

      // Step 2: Get supplementary insights
      setProgress(40);
      setCurrentStep('Gathering supplementary insights...');
      
      const insights = await aiService.getSupplementaryInsights(formData.keywords);

      // Step 3: Refine content
      setProgress(60);
      setCurrentStep('Refining content for SEO optimization...');
      
      const refinedContent = await aiService.refineContent(
        initialContent.content,
        'Optimize for SEO and improve readability'
      );

// Step 4: Create document
      setProgress(80);
      setCurrentStep('Creating document...');
      
      // Get selected brand information
      const selectedBrand = brands.find(brand => brand.Id === parseInt(formData.brandId));
      const companyName = selectedBrand ? selectedBrand.name : '';
      
      const documentData = {
        title: `${formData.contentType}: ${formData.keywords}`,
        content: refinedContent.content,
        contentType: formData.contentType,
        keywords: formData.keywords,
        status: 'Draft',
        googleDocUrl: `https://docs.google.com/document/d/${Date.now()}/edit`,
        companyName: companyName,
        brandId: formData.brandId,
        location: formData.location,
        metadata: {
          ...initialContent.metadata,
          insights: insights.insights,
          refinements: refinedContent.changes
        }
      };

// Step 5: Neuronwriter integration
      setCurrentStep('Generating Neuronwriter query...');
      try {
        // Generate query in Neuronwriter
        const queryResult = await neuronwriterService.generateQuery(
          formData.keywords,
          {
            contentType: formData.contentType,
            location: formData.location,
            projectId: selectedBrand.projectId || 'default_project'
          }
        );
        
        if (queryResult.success) {
          // Create analysis if query generation was successful
          const analysis = await neuronwriterService.createAnalysis(
            formData.keywords,
            'google',
            'en',
            selectedBrand.projectId || 'default_project'
          );
          
          const importResult = await neuronwriterService.importContent(
            analysis.id,
            refinedContent.content,
            documentData.title
          );
          
          documentData.neuronwriterUrl = analysis.shareUrl;
          documentData.analysisId = analysis.id;
          documentData.neuronwriterQuery = queryResult.queryUrl;
          
          toast.success('Neuronwriter query generated successfully!');
        }
      } catch (neuronError) {
        console.warn('Neuronwriter integration failed:', neuronError);
        toast.warn('Content created successfully, but Neuronwriter integration failed');
      }

      const createdDocument = await documentService.create(documentData);
      
      setProgress(100);
      setCurrentStep('Content generation completed!');
      
toast.success('Content generated successfully!');
      
// Reset form
setFormData({
        brandId: '',
        keywords: '',
        contentType: '',
        location: '',
        dbaField: ''
      });
      if (onDocumentCreated) {
        onDocumentCreated(createdDocument);
      }
      
    } catch (error) {
      console.error('Content generation error:', error);
      toast.error(error.message || 'Failed to generate content');
    } finally {
      setLoading(false);
      setProgress(0);
      setCurrentStep('');
    }
  };

const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };
  return (
    <Card className="p-6">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Generate AI Content</h2>
        <p className="text-gray-600">
          Create SEO-optimized content using advanced AI technology
        </p>
      </div>

<form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">
              Brand <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.brandId}
              onChange={(e) => handleInputChange('brandId', e.target.value)}
              disabled={brandsLoading}
              className={errors.brandId ? 'border-red-300' : ''}
            >
              <option value="">
                {brandsLoading ? 'Loading brands...' : 'Select a brand'}
              </option>
              {brands.map((brand) => (
                <option key={brand.Id} value={brand.Id}>
                  {brand.name}
                </option>
              ))}
            </Select>
            {errors.brandId && (
              <p className="text-sm text-red-600">{errors.brandId}</p>
            )}
            {brandsError && !brandsLoading && (
              <p className="text-sm text-red-600">{brandsError}</p>
            )}
            <p className="text-sm text-gray-500">Select your brand from the list</p>
          </div>
          <FormField
            label="Keywords"
            required
            placeholder="e.g., home repair services"
            value={formData.keywords}
            onChange={(e) => handleInputChange('keywords', e.target.value)}
            error={errors.keywords}
            helpText="3-100 characters"
          />

          <FormField
            label="Content Type"
            type="select"
            required
            value={formData.contentType}
            onChange={(e) => handleInputChange('contentType', e.target.value)}
            error={errors.contentType}
          >
            <option value="">Select content type</option>
            <option value="Blog Post">Blog Post</option>
            <option value="Landing Page">Landing Page</option>
            <option value="FAQ">FAQ</option>
            <option value="Service Page">Service Page</option>
<option value="How-to Guide">How-to Guide</option>
            <option value="Product Description">Product Description</option>
          </FormField>

<FormField
            label="Location (Optional)"
            placeholder="e.g., New York, NY"
            value={formData.location}
            onChange={(e) => handleInputChange('location', e.target.value)}
            helpText="Add location for local SEO optimization"
            className="md:col-span-2"
          />

          <FormField
            label="DBA Field (Optional)"
            placeholder="e.g., ABC Construction Services"
            value={formData.dbaField}
            onChange={(e) => handleInputChange('dbaField', e.target.value)}
            helpText="Doing Business As name for your company"
            className="md:col-span-2"
          />
        </div>

        {loading && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            className="bg-gradient-to-r from-primary/5 to-secondary/5 rounded-lg p-6"
          >
            <div className="flex items-center gap-4">
              <ProgressRing progress={progress} size={48}>
                {progress}%
              </ProgressRing>
              <div>
                <p className="font-medium text-gray-900">Processing...</p>
                <p className="text-sm text-gray-600">{currentStep}</p>
              </div>
            </div>
          </motion.div>
        )}

        <div className="flex justify-end">
          <Button
            type="submit"
            size="lg"
            loading={loading}
            disabled={loading}
            icon="Sparkles"
            className="min-w-[200px]"
          >
            Generate Content
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default ContentGenerationForm;