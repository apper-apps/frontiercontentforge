class BrandService {
  constructor() {
    this.tableName = 'brand';
  }

  async getAll() {
    try {
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
      throw new Error('Failed to load brands');
    }
  }

  async getById(id) {
    try {
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
      throw new Error('Failed to load brand');
    }
  }

  async create(brandData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
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
          defaultSearchEngine: brandData.searchEngine === "google.ca" ? "google.ca" : "google.com"
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
      throw new Error('Failed to create brand');
    }
  }

  async update(id, updateData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Only include updateable fields
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
          defaultSearchEngine: updateData.searchEngine === "google.ca" ? "google.ca" : "google.com"
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
      throw new Error('Failed to update brand');
    }
  }

  async delete(id) {
    try {
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
      throw new Error('Failed to delete brand');
    }
  }
}

export default new BrandService();