import { fetchWithRetry } from '@/utils/fetchWithRetry';

class DocumentService {
  constructor() {
    this.baseUrl = '/api/documents';
  }

  async getAll() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      return documents.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (error) {
      throw new Error('Failed to load documents');
    }
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const document = documents.find(doc => doc.Id === parseInt(id));
      
      if (!document) {
        throw new Error('Document not found');
      }
      
      return document;
    } catch (error) {
      throw new Error('Failed to load document');
    }
  }

  async create(documentData) {
    await new Promise(resolve => setTimeout(resolve, 400));
    
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const maxId = documents.length > 0 ? Math.max(...documents.map(doc => doc.Id)) : 0;
      
      const newDocument = {
        Id: maxId + 1,
        ...documentData,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        userId: 'current-user-id'
      };
      
      documents.push(newDocument);
      localStorage.setItem('documents', JSON.stringify(documents));
      
      return newDocument;
    } catch (error) {
      throw new Error('Failed to create document');
    }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const index = documents.findIndex(doc => doc.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Document not found');
      }
      
      documents[index] = {
        ...documents[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('documents', JSON.stringify(documents));
      
      return documents[index];
    } catch (error) {
      throw new Error('Failed to update document');
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      const documents = JSON.parse(localStorage.getItem('documents') || '[]');
      const filteredDocuments = documents.filter(doc => doc.Id !== parseInt(id));
      
      localStorage.setItem('documents', JSON.stringify(filteredDocuments));
      
      return true;
    } catch (error) {
      throw new Error('Failed to delete document');
    }
  }

  async generateSocialPosts(documentId) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
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
      throw new Error('Failed to generate social posts');
    }
  }
}

export default new DocumentService();