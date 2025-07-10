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
    contentType: 'Service Page',
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
        neuronwriterUrl: "", // Initialize as empty string, will be updated if neuronwriter succeeds
        companyName: companyName,
        brandId: formData.brandId,
        location: formData.location,
        metadata: {
          ...initialContent.metadata,
          insights: insights.insights,
          refinements: refinedContent.changes
        }
      };

// Step 5: Neuronwriter integration with full workflow
      setCurrentStep('Creating Neuronwriter query...');
      let neuronwriterData = {};
      
try {
        // Validate brand credentials
        if (!selectedBrand.projectId) {
          throw new Error(`Brand "${selectedBrand.name}" is missing Project ID. Please update brand settings.`);
        }
        if (!selectedBrand.apiKey) {
          throw new Error(`Brand "${selectedBrand.name}" is missing API key. Please update brand settings.`);
        }
        if (!selectedBrand.defaultSearchEngine) {
          console.warn(`Brand "${selectedBrand.name}" has no search engine configured, defaulting to google.com`);
        }
// Create new query using brand-specific credentials
        const searchEngine = selectedBrand.defaultSearchEngine || 'google.com';
        const queryResult = await neuronwriterService.newQuery(
          selectedBrand.projectId,
          formData.keywords,
          'English',
          searchEngine,
          selectedBrand.apiKey
        );
        
        // Log full response for debugging
        console.log('Neuron Writer API Response:', queryResult);
        
        if (queryResult.success || queryResult.id) {
          const queryId = queryResult.queryId || queryResult.id;
          
          // Step 5a: Wait 1 minute for processing as specified
          setProgress(85);
          setCurrentStep('Waiting for Neuronwriter processing (1 minute)...');
          
          // Wait exactly 1 minute as requested
          await new Promise(resolve => setTimeout(resolve, 60000));
          
          // Step 5b: Fetch analysis data
          setProgress(90);
          setCurrentStep('Fetching Neuronwriter analysis data...');
          
          try {
// Create analysis for the query
            const analysisResult = await neuronwriterService.createAnalysis(
              formData.keywords,
              searchEngine,
              'English',
              selectedBrand.projectId
            );
            
            // Wait for analysis to complete
            let analysisStatus = { status: 'processing', progress: 0 };
            const maxAttempts = 10;
            let attempts = 0;
            
            while (analysisStatus.status !== 'completed' && attempts < maxAttempts) {
              await new Promise(resolve => setTimeout(resolve, 3000));
              analysisStatus = await neuronwriterService.getAnalysisStatus(analysisResult.id);
              attempts++;
            }
            
            if (analysisStatus.status === 'completed') {
              // Get the analysis results with terms_txt, metrics, and competitors
              const analysisData = await neuronwriterService.getAnalysisResults(analysisResult.id);
              
              // Structure the data as specified in the request
              neuronwriterData = {
                query: queryId,
                terms_txt: analysisData.recommendations || [],
                metrics: {
                  target_word_count: analysisData.metrics?.content_quality ? Math.round(analysisData.metrics.content_quality * 10) : 800,
                  readability_score: analysisData.metrics?.readability || 85,
                  seo_score: analysisData.metrics?.seo_score || 78
                },
                competitors: analysisData.competitorAnalysis?.top_competitors || []
              };
              
              console.log('Neuronwriter data fetched successfully:', neuronwriterData);
              
              toast.success(
                `Neuronwriter analysis completed! 
                Query ID: ${queryId}
                Target Score: ${neuronwriterData.metrics.seo_score}
                Competitors Found: ${neuronwriterData.competitors.length}`,
                { autoClose: 8000 }
              );
            } else {
              throw new Error('Analysis did not complete within expected timeframe');
            }
            
          } catch (analysisError) {
            console.warn('Analysis failed, using basic query data:', analysisError);
            // Fallback to basic query data structure
            neuronwriterData = {
              query: queryId,
              terms_txt: [formData.keywords],
              metrics: {
                target_word_count: 800,
                readability_score: 85,
                seo_score: 75
              },
              competitors: []
            };
          }
          
          // Add comprehensive data to document metadata
          documentData.neuronwriterShareUrl = queryResult.shareUrl;
          documentData.neuronwriterQueryId = queryId;
          documentData.neuronwriterQueryUrl = queryResult.queryUrl;
          // Update the neuronwriterUrl field with the shareUrl for database storage
          documentData.neuronwriterUrl = queryResult.shareUrl || "";
          
          // Update metadata to include Neuronwriter integration details and fetched data
          documentData.metadata = {
            ...documentData.metadata,
            neuronwriter: {
              queryId: queryId,
              shareUrl: queryResult.shareUrl,
              queryUrl: queryResult.queryUrl,
project: selectedBrand.projectId || 'default_project',
              keyword: formData.keywords,
              language: 'English',
              engine: searchEngine,
              createdAt: queryResult.createdAt,
              // Add the fetched data for content task enhancement
              analysisData: neuronwriterData
            }
          };
          
        } else {
          // Show response even if success is false
          console.log('Neuron Writer returned success: false', queryResult);
          toast.warn(
            `Neuronwriter query creation returned success: false. 
            Response: ${JSON.stringify(queryResult)}`,
            { autoClose: 8000 }
          );
        }
        
      } catch (neuronError) {
        console.error('Neuronwriter integration failed:', neuronError);
        // Show detailed error information
        toast.warn(
          `Content created successfully, but Neuronwriter integration failed: 
          ${neuronError.message || neuronError.toString()}
          Check console for full error details.`,
          { autoClose: 8000 }
        );
      }
      const createdDocument = await documentService.create(documentData);
      
      setProgress(100);
      setCurrentStep('Content generation completed!');
      
toast.success('Content generated successfully!');
      
// Reset form
setFormData({
        brandId: '',
        keywords: '',
        contentType: 'Service Page',
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
            <option value="Geo Service Page">Geo Service Page</option>
            <option value="How-to Guide">How-to Guide</option>
            <option value="Service Page">Service Page</option>
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