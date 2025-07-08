import { fetchWithRetry } from '@/utils/fetchWithRetry';
import settingsService from '@/services/api/settingsService';

class NeuronwriterService {
  constructor() {
    this.baseUrl = 'https://neuronwriter.com/api';
  }

  async newQuery(project, keyword, language = 'English', engine = 'google.com') {
    try {
      // Get Neuronwriter API key from settings
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey) {
        throw new Error('Neuronwriter API key not configured in settings');
      }

      const response = await fetchWithRetry(`${this.baseUrl}/new-query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          project,
          keyword,
          language,
          engine
        })
      });

      if (!response.ok) {
        throw new Error(`Neuronwriter API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        success: true,
        queryId: result.query_id,
        shareUrl: result.share_url,
        queryUrl: result.query_url,
        keyword,
        language,
        engine,
        project,
        status: 'created',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Neuronwriter new-query error:', error);
      throw new Error(`Failed to create Neuronwriter query: ${error.message}`);
    }
  }

  async createAnalysis(keywords, engine = 'google.com', language = 'English', projectId) {
    try {
      // Get Neuronwriter API key from settings
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey) {
        throw new Error('Neuronwriter API key not configured in settings');
      }

      const response = await fetchWithRetry(`${this.baseUrl}/analysis`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          project: projectId,
          keyword: keywords,
          language,
          engine
        })
      });

      if (!response.ok) {
        throw new Error(`Neuronwriter API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        id: result.analysis_id,
        keywords,
        engine,
        language,
        projectId,
        shareUrl: result.share_url,
        queryUrl: result.query_url,
        title: `SEO Analysis: ${keywords}`,
        status: 'created',
        createdAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Neuronwriter analysis error:', error);
      throw new Error(`Failed to create Neuronwriter analysis: ${error.message}`);
    }
  }

  async importContent(analysisId, content, title) {
    try {
      // Get Neuronwriter API key from settings
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey) {
        throw new Error('Neuronwriter API key not configured in settings');
      }

      const response = await fetchWithRetry(`${this.baseUrl}/import-content`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          analysis_id: analysisId,
          content,
          title
        })
      });

      if (!response.ok) {
        throw new Error(`Neuronwriter API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        analysisId,
        title,
        contentLength: content.length,
        status: 'imported',
        seoScore: result.seo_score || 0,
        recommendations: result.recommendations || [],
        importedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Neuronwriter import error:', error);
      throw new Error(`Failed to import content to Neuronwriter: ${error.message}`);
    }
  }

  async getAnalysisStatus(analysisId) {
    try {
      // Get Neuronwriter API key from settings
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey) {
        throw new Error('Neuronwriter API key not configured in settings');
      }

      const response = await fetchWithRetry(`${this.baseUrl}/analysis/${analysisId}/status`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Neuronwriter API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      return {
        analysisId,
        status: result.status,
        progress: result.progress || 0,
        updatedAt: new Date().toISOString()
      };
    } catch (error) {
      console.error('Neuronwriter status error:', error);
      throw new Error(`Failed to check analysis status: ${error.message}`);
    }
  }

  async getAnalysisResults(analysisId) {
    try {
      // Get Neuronwriter API key from settings
      const settings = await settingsService.getSettings();
      const apiKey = settings.neuronwriterApiKey;
      
      if (!apiKey) {
        throw new Error('Neuronwriter API key not configured in settings');
      }

      const response = await fetchWithRetry(`${this.baseUrl}/analysis/${analysisId}/results`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });

      if (!response.ok) {
        throw new Error(`Neuronwriter API error: ${response.status} ${response.statusText}`);
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
      console.error('Neuronwriter results error:', error);
      throw new Error(`Failed to get analysis results: ${error.message}`);
    }
  }
}

export default new NeuronwriterService();