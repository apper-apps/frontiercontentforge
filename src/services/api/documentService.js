class DocumentService {
  constructor() {
    this.tableName = 'document';
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "contentType" } },
          { field: { Name: "keywords" } },
          { field: { Name: "status" } },
          { field: { Name: "googleDocUrl" } },
          { field: { Name: "neuronwriterUrl" } },
          { field: { Name: "analysisId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "userId" } }
        ],
        orderBy: [
          {
            fieldName: "createdAt",
            sorttype: "DESC"
          }
        ]
      };
      
      const response = await apperClient.fetchRecords(this.tableName, params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data || [];
    } catch (error) {
      console.error("Error fetching documents:", error);
      throw new Error('Failed to load documents');
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
          { field: { Name: "title" } },
          { field: { Name: "content" } },
          { field: { Name: "contentType" } },
          { field: { Name: "keywords" } },
          { field: { Name: "status" } },
          { field: { Name: "googleDocUrl" } },
          { field: { Name: "neuronwriterUrl" } },
          { field: { Name: "analysisId" } },
          { field: { Name: "createdAt" } },
          { field: { Name: "updatedAt" } },
          { field: { Name: "userId" } }
        ]
      };
      
      const response = await apperClient.getRecordById(this.tableName, parseInt(id), params);
      
      if (!response.success) {
        console.error(response.message);
        throw new Error(response.message);
      }
      
      return response.data;
    } catch (error) {
      console.error("Error fetching document:", error);
      throw new Error('Failed to load document');
    }
  }

async create(documentData) {
    try {
      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });
      
      // Prepare neuronwriter URL - use shareUrl if available, otherwise empty string
      const neuronwriterUrl = documentData.neuronwriterShareUrl || documentData.neuronwriterUrl || "";
      
      // Only include updateable fields
      const params = {
        records: [{
          Name: documentData.title,
          Tags: documentData.tags || "",
          Owner: documentData.owner || null,
          title: documentData.title,
          content: documentData.content || "",
          contentType: documentData.contentType || "",
          keywords: documentData.keywords || "",
          status: documentData.status || "Draft",
          googleDocUrl: documentData.googleDocUrl || "",
          neuronwriterUrl: neuronwriterUrl,
          analysisId: documentData.analysisId || "",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: documentData.userId || null
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
          throw new Error(failedRecords[0].message || 'Failed to create document');
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error creating document:", error);
      throw new Error('Failed to create document');
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
          Name: updateData.title || updateData.Name,
          Tags: updateData.tags || updateData.Tags || "",
          Owner: updateData.owner || updateData.Owner || null,
          title: updateData.title,
          content: updateData.content,
          contentType: updateData.contentType,
          keywords: updateData.keywords,
          status: updateData.status,
          googleDocUrl: updateData.googleDocUrl,
          neuronwriterUrl: updateData.neuronwriterUrl,
          analysisId: updateData.analysisId,
          updatedAt: new Date().toISOString(),
          userId: updateData.userId
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
          throw new Error(failedRecords[0].message || 'Failed to update document');
        }
        
        return response.results[0].data;
      }
      
      return response.data;
    } catch (error) {
      console.error("Error updating document:", error);
      throw new Error('Failed to update document');
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
          throw new Error(failedRecords[0].message || 'Failed to delete document');
        }
      }
      
      return true;
    } catch (error) {
      console.error("Error deleting document:", error);
      throw new Error('Failed to delete document');
    }
  }

  async generateSocialPosts(documentId) {
    try {
      const document = await this.getById(documentId);
      
      const socialPosts = {
        twitter: `🚀 New content alert! Check out our latest insights on ${document.keywords}. #ContentMarketing #SEO`,
        facebook: `We've just published a comprehensive guide on ${document.keywords}. Perfect for businesses looking to enhance their online presence. What's your biggest content challenge?`,
        linkedin: `📊 Latest industry insights: Our new analysis on ${document.keywords} reveals key trends for ${new Date().getFullYear()}. What strategies are you implementing?`,
        googleBusiness: `New resource available! Learn more about ${document.keywords} and how it can benefit your business. Visit our website for the full article.`
      };
      
      // Save social posts to document
      await this.update(documentId, {
        socialPosts,
        socialPostsGeneratedAt: new Date().toISOString()
      });
      
      return socialPosts;
    } catch (error) {
      console.error("Error generating social posts:", error);
      throw new Error('Failed to generate social posts');
    }
  }
}

export default new DocumentService();