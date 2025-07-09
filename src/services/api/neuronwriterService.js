import React from "react";
import { fetchWithRetry } from "@/utils/fetchWithRetry";
import Error from "@/components/ui/Error";
import settingsService from "@/services/api/settingsService";

class NeuronwriterService {
  constructor() {
    this.baseURL = 'https://api.neuronwriter.com/v1'
    this.isDevelopment = import.meta.env.MODE === 'development'
  }

  async getApiKey(brandApiKey = null) {
    try {
      if (brandApiKey) {
        return brandApiKey;
      }

      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriter?.apiKey;

      if (!apiKey) {
        throw new Error('Neuronwriter API key not found in settings');
      }

      return apiKey;
    } catch (error) {
      throw new Error(`Failed to get API key: ${error.message}`);
    }
  }

  async getHeaders(brandApiKey = null) {
    try {
      const apiKey = await this.getApiKey(brandApiKey);
      
      return {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'X-Client': 'ContentForge-AI',
        'X-Version': '1.0.0'
      };
    } catch (error) {
      throw new Error(`Failed to get headers: ${error.message}`);
    }
  }

  async checkNetworkConnection() {
    if (!navigator.onLine) {
      throw new Error('No internet connection available');
    }
  }

  async handleNetworkError(error, operation) {
    console.error(`Network error in ${operation}:`, {
      message: error.message,
      stack: error.stack,
      timestamp: new Date().toISOString()
    });

    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error(`Network connection failed during ${operation}. Please check your internet connection and try again.`);
    }

    if (error.message.includes('Failed to fetch')) {
      throw new Error(`Unable to reach Neuronwriter API during ${operation}. The service may be temporarily unavailable.`);
    }

throw error;
  }

  // Utility method to sanitize URLs by removing protocol and www prefixes
  sanitizeUrl(url) {
    if (!url || typeof url !== 'string') {
      return url;
    }
    
    // Remove protocol (https://, http://) and www. prefix
    return url
      .replace(/^https?:\/\//, '')
      .replace(/^www\./, '')
      .trim();
  }

  generateMockResponse(operation, data = {}) {
    const mockResponses = {
      newQuery: {
        id: `query_${Date.now()}`,
        project: data.project || 'test-project',
        keyword: data.keyword || 'test-keyword',
        status: 'created',
        createdAt: new Date().toISOString()
      },
      createAnalysis: {
        analysis_id: `analysis_${Date.now()}`,
        status: 'processing',
        progress: 0,
        keywords: data.keywords || ['test-keyword'],
        createdAt: new Date().toISOString()
      },
      importContent: {
        id: `import_${Date.now()}`,
        analysisId: data.analysisId || 'test-analysis',
        status: 'imported',
        createdAt: new Date().toISOString()
      },
      getAnalysisStatus: {
        status: 'completed',
        progress: 100,
        updatedAt: new Date().toISOString()
      },
      getAnalysisResults: {
        overall_score: 85,
        metrics: {
          readability: 92,
          seo_score: 78,
          content_quality: 88
        },
        recommendations: [
          'Add more relevant keywords',
          'Improve content structure',
          'Optimize meta descriptions'
        ],
        competitor_analysis: {
          top_competitors: ['competitor1.com', 'competitor2.com'],
          average_score: 75
        }
      }
    };

    return mockResponses[operation] || {};
  }
async newQuery(project, keyword, language = 'English', engine = 'google.com', brandApiKey = null) {
    try {
      await this.checkNetworkConnection();
      
      // Development mode fallback
      if (this.isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        return this.generateMockResponse('newQuery', { project, keyword, language, engine });
      }
      
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const headers = await this.getHeaders(brandApiKey);
      const queryData = {
        project,
        keyword,
        language,
        engine,
        timestamp: Date.now()
      };
      
      console.log('Creating new query:', { project, keyword, language, engine });
      
      const response = await fetchWithRetry(`${this.baseURL}/queries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(queryData),
        timeout: 30000
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Query failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Query created successfully:', result);
      return result;
      
    } catch (error) {
      await this.handleNetworkError(error, 'newQuery');
    }
  }

async createAnalysis(keywords, engine = 'google.com', language = 'English', projectId) {
    try {
      await this.checkNetworkConnection();
      
      // Development mode fallback
      if (this.isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 1500));
        const mockResult = this.generateMockResponse('createAnalysis', { keywords, engine, language, projectId });
        return {
          id: mockResult.analysis_id,
          keywords: Array.isArray(keywords) ? keywords : [keywords],
          engine,
          language,
          projectId,
          createdAt: new Date().toISOString()
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const headers = await this.getHeaders();
      const analysisData = {
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        engine,
        language,
        projectId,
        timestamp: Date.now()
      };
      
      console.log('Creating analysis:', analysisData);
      
      const response = await fetchWithRetry(`${this.baseURL}/analysis`, {
        method: 'POST',
        headers,
        body: JSON.stringify(analysisData),
        timeout: 45000
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Analysis creation failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Analysis created successfully:', result);
      
      return {
        id: result.analysis_id,
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        engine,
        language,
        projectId,
        createdAt: new Date().toISOString()
      };
      
    } catch (error) {
      await this.handleNetworkError(error, 'createAnalysis');
    }
  }

async importContent(analysisId, content, title) {
    try {
      await this.checkNetworkConnection();
      
      // Development mode fallback
      if (this.isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 800));
        return this.generateMockResponse('importContent', { analysisId, content, title });
      }
      
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const headers = await this.getHeaders();
      const importData = {
        analysisId,
        content,
        title,
        timestamp: Date.now()
      };
      
      console.log('Importing content:', { analysisId, title, contentLength: content?.length });
      
      const response = await fetchWithRetry(`${this.baseURL}/content/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify(importData),
        timeout: 60000
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Content import failed with status ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Content imported successfully:', result);
      return result;
      
    } catch (error) {
      await this.handleNetworkError(error, 'importContent');
    }
  }

async getAnalysisStatus(analysisId) {
    try {
      await this.checkNetworkConnection();
      
      // Development mode fallback
      if (this.isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 500));
        const mockResult = this.generateMockResponse('getAnalysisStatus');
        return {
          analysisId,
          status: mockResult.status,
          progress: mockResult.progress,
          updatedAt: new Date().toISOString()
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const headers = await this.getHeaders();
      
      console.log('Getting analysis status:', analysisId);
      
      const response = await fetchWithRetry(`${this.baseURL}/analysis/${analysisId}/status`, {
        method: 'GET',
        headers,
        timeout: 15000
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to get analysis status with code ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Analysis status retrieved:', result);
      
      return {
        analysisId,
        status: result.status,
        progress: result.progress || 0,
        updatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      await this.handleNetworkError(error, 'getAnalysisStatus');
    }
  }

async getAnalysisResults(analysisId) {
    try {
      await this.checkNetworkConnection();
      
      // Development mode fallback
      if (this.isDevelopment) {
        await new Promise(resolve => setTimeout(resolve, 600));
        const mockResult = this.generateMockResponse('getAnalysisResults');
        return {
          analysisId,
          overallScore: mockResult.overall_score,
          metrics: mockResult.metrics,
          recommendations: mockResult.recommendations,
          competitorAnalysis: mockResult.competitor_analysis,
          generatedAt: new Date().toISOString()
        };
      }
      
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const headers = await this.getHeaders();
      
      console.log('Getting analysis results:', analysisId);
      
      const response = await fetchWithRetry(`${this.baseURL}/analysis/${analysisId}/results`, {
        method: 'GET',
        headers,
        timeout: 30000
      });
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new Error(`Failed to get analysis results with code ${response.status}: ${errorText}`);
      }
      
      const result = await response.json();
      console.log('Analysis results retrieved:', result);
      
      return {
        analysisId,
        overallScore: result.overall_score || 0,
        metrics: result.metrics || {},
        recommendations: result.recommendations || [],
        competitorAnalysis: result.competitor_analysis || {},
        generatedAt: new Date().toISOString()
      };
      
    } catch (error) {
      await this.handleNetworkError(error, 'getAnalysisResults');
    }
  }
}

const neuronwriterService = new NeuronwriterService();
export default neuronwriterService;