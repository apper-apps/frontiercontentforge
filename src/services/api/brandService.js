class BrandService {
  constructor() {
    this.tableName = 'brand';
  }

async getAll() {
    try {
      // Check if SDK is available before making API calls
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "apiKey" } },
          { field: { Name: "projectId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "description" } },
          { field: { Name: "websiteURL" } },
          { field: { Name: "defaultSearchEngine" } }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching brands:", error);
      
      // Enhanced network error handling
      if (error.message && (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      throw new Error(error.message || 'Failed to load brands');
    }
  }

async getById(id) {
    try {
      // Validate connection before API call
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        fields: [
          { field: { Name: "Name" } },
          { field: { Name: "Tags" } },
          { field: { Name: "Owner" } },
          { field: { Name: "apiKey" } },
          { field: { Name: "projectId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "description" } },
          { field: { Name: "websiteURL" } },
          { field: { Name: "defaultSearchEngine" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching brand:", error);
      
      // Enhanced network error handling
      if (error.message && (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))) {
        throw new Error('Network connection failed. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('timeout')) {
        throw new Error('Request timed out. Please check your connection and try again.');
      }
      
      throw new Error(error.message || 'Failed to load brand');
    }
  }

async create(brandData) {
    try {
      // Validate SDK availability before creating
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Validate and ensure exact picklist value match
      const validSearchEngines = ["google.com", "google.ca"];
      let searchEngine = "google.com"; // Default value
      
      if (brandData.searchEngine && validSearchEngines.includes(brandData.searchEngine)) {
        searchEngine = brandData.searchEngine;
      }
      
      // Only include updateable fields with validated picklist values
      const params = {
        records: [{
          Name: brandData.name,
          Tags: brandData.tags || "",
          Owner: brandData.owner || null,
          apiKey: brandData.apiKey || "",
          projectId: brandData.projectId || "",
          createdAt: new Date().toISOString(),
          description: brandData.description || "",
          websiteURL: brandData.websiteUrl || "",
          // Ensure exact picklist value match - must be "google.com" or "google.ca"
          defaultSearchEngine: searchEngine
        }]
      };
      
      const response = await apperClient.createRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to create ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to create brand');
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating brand:", error);
      
      // Enhanced network error detection and messaging
      if (error.message && (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))) {
        throw new Error('Network connection failed while creating brand. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('timeout')) {
        throw new Error('Request timed out while creating brand. Please check your connection and try again.');
      } else if (error.message && error.message.includes('SDK not loaded')) {
        throw new Error('System not ready. Please refresh the page and try again.');
      }
      
      throw new Error(error.message || 'Failed to create brand');
    }
  }

async update(id, updateData) {
    try {
      // Validate SDK availability and connectivity before updating
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Validate and ensure exact picklist value match
      const validSearchEngines = ["google.com", "google.ca"];
      let searchEngine = "google.com"; // Default value
      
      if (updateData.searchEngine && validSearchEngines.includes(updateData.searchEngine)) {
        searchEngine = updateData.searchEngine;
      }
      
      // Only include updateable fields with validated picklist values
      const params = {
        records: [{
          Id: parseInt(id),
          Name: updateData.name,
          Tags: updateData.tags || "",
          Owner: updateData.owner || null,
          apiKey: updateData.apiKey || "",
          projectId: updateData.projectId || "",
          description: updateData.description || "",
          websiteURL: updateData.websiteUrl || "",
          // Ensure exact picklist value match - must be "google.com" or "google.ca"
          defaultSearchEngine: searchEngine
        }]
      };
      
      const response = await apperClient.updateRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to update ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to update brand');
        }
        
        return response.results[0].data;
      }
      
      return response.data;
} catch (error) {
      console.error("Error updating brand:", error);
      
      // Enhanced network error handling for update operations
      if (error.message && (
        error.message.includes('Network Error') || 
        error.message.includes('Failed to fetch') ||
        error.message.includes('net::') ||
        error.message.includes('CONNECTION_ERROR') ||
        error.message.includes('NETWORK_FAILURE')
      )) {
        throw new Error('Network connection failed while updating brand. Please check your internet connection and try again.');
      } else if (error.message && (
        error.message.includes('timeout') ||
        error.message.includes('TIMEOUT') ||
        error.message.includes('Request timeout')
      )) {
        throw new Error('Request timed out while updating brand. Please check your connection and try again.');
      } else if (error.message && (
        error.message.includes('SDK not loaded') ||
        error.message.includes('ApperSDK') ||
        error.message.includes('SDK initialization')
      )) {
        throw new Error('System not ready. Please refresh the page and try again.');
      } else if (error.message && (
        error.message.includes('abort') ||
        error.message.includes('cancelled') ||
        error.message.includes('AbortError')
      )) {
        throw new Error('Update operation was cancelled. Please try again.');
      } else if (error.name === 'NetworkError' || error.name === 'TypeError') {
        throw new Error('Network connection issue detected. Please verify your internet connection and try again.');
      }
      
      throw new Error(error.message || 'Failed to update brand');
    }
  }

async delete(id) {
    try {
      // Ensure SDK is ready before attempting deletion
      if (!window.ApperSDK || !window.ApperSDK.ApperClient) {
        throw new Error('Apper SDK not loaded. Please refresh the page and try again.');
      }

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      const params = {
        RecordIds: [parseInt(id)]
      };
      
      const response = await apperClient.deleteRecord(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      if (response.results) {
        const failedRecords = response.results.filter(result => !result.success);
        
        if (failedRecords.length > 0) {
          console.error(`Failed to delete ${failedRecords.length} records:${JSON.stringify(failedRecords)}`);
          throw new Error(failedRecords[0].message || 'Failed to delete brand');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting brand:", error);
      
      // Enhanced error handling for delete operations
      if (error.message && (error.message.includes('Network Error') || error.message.includes('Failed to fetch'))) {
        throw new Error('Network connection failed while deleting brand. Please check your internet connection and try again.');
      } else if (error.message && error.message.includes('timeout')) {
        throw new Error('Request timed out while deleting brand. Please check your connection and try again.');
      } else if (error.message && error.message.includes('SDK not loaded')) {
        throw new Error('System not ready. Please refresh the page and try again.');
      }
      
      throw new Error(error.message || 'Failed to delete brand');
    }
  }
}

export default new BrandService();