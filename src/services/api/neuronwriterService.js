import { fetchWithRetry } from "@/utils/fetchWithRetry";
import settingsService from "@/services/api/settingsService";

class NeuronwriterService {
  constructor() {
    this.baseURL = 'https://api.neuronwriter.com';
  }
  
  async getApiKey() {
    try {
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey || apiKey.trim() === '') {
        throw new Error('Neuronwriter API key not configured. Please add your API key in Settings.');
      }
      
      return apiKey;
    } catch (error) {
      if (error.message.includes('API key not configured')) {
        throw error;
      }
      throw new Error('Failed to retrieve API configuration. Please check your settings.');
    }
  }
  
  async getHeaders() {
    const apiKey = await this.getApiKey();
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    };
  }

  async newQuery(project, keyword, language = 'English', engine = 'google.com') {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const headers = await this.getHeaders();
      const queryData = {
        project,
        keyword,
        language,
        engine,
        timestamp: Date.now()
      };
      
      const response = await fetchWithRetry(`${this.baseURL}/queries`, {
        method: 'POST',
        headers,
        body: JSON.stringify(queryData)
      });
      
      if (!response.ok) {
        throw new Error(`Query failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to create new query: ${error.message}`);
    }
  }

  async createAnalysis(keywords, engine = 'google.com', language = 'English', projectId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const headers = await this.getHeaders();
      const analysisData = {
        keywords: Array.isArray(keywords) ? keywords : [keywords],
        engine,
        language,
        projectId,
        timestamp: Date.now()
      };
      
      const response = await fetchWithRetry(`${this.baseURL}/analysis`, {
        method: 'POST',
        headers,
        body: JSON.stringify(analysisData)
      });
      
      if (!response.ok) {
        throw new Error(`Analysis creation failed: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        id: result.analysis_id,
        keywords,
        engine,
        language,
        projectId,
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to create analysis: ${error.message}`);
    }
  }

  async importContent(analysisId, content, title) {
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const headers = await this.getHeaders();
      const importData = {
        analysisId,
        content,
        title,
        timestamp: Date.now()
      };
      
      const response = await fetchWithRetry(`${this.baseURL}/content/import`, {
        method: 'POST',
        headers,
        body: JSON.stringify(importData)
      });
      
      if (!response.ok) {
        throw new Error(`Content import failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      throw new Error(`Failed to import content: ${error.message}`);
    }
  }

  async getAnalysisStatus(analysisId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const headers = await this.getHeaders();
      const response = await fetchWithRetry(`${this.baseURL}/analysis/${analysisId}/status`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get analysis status: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        analysisId,
        status: result.status,
        progress: result.progress || 0,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get analysis status: ${error.message}`);
    }
  }

  async getAnalysisResults(analysisId) {
    try {
      await new Promise(resolve => setTimeout(resolve, 600));
      
      const headers = await this.getHeaders();
      const response = await fetchWithRetry(`${this.baseURL}/analysis/${analysisId}/results`, {
        method: 'GET',
        headers
      });
      
      if (!response.ok) {
        throw new Error(`Failed to get analysis results: ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        analysisId,
        overallScore: result.overall_score || 0,
        metrics: result.metrics || {},
        recommendations: result.recommendations || [],
        competitorAnalysis: result.competitor_analysis || {},
        generatedAt: new Date().toISOString()
      };
    } catch (error) {
      throw new Error(`Failed to get analysis results: ${error.message}`);
    }
  }
}

export default new NeuronwriterService();