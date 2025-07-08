import { fetchWithRetry } from '@/utils/fetchWithRetry';

class BrandService {
  constructor() {
    this.baseUrl = '/api/brands';
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      return brands;
    } catch (error) {
      throw new Error('Failed to load brands');
    }
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const brand = brands.find(brand => brand.Id === parseInt(id));
      
      if (!brand) {
        throw new Error('Brand not found');
      }
      
      return brand;
    } catch (error) {
      throw new Error('Failed to load brand');
    }
  }

  async create(brandData) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const maxId = brands.length > 0 ? Math.max(...brands.map(brand => brand.Id)) : 0;
      
      const newBrand = {
        Id: maxId + 1,
        ...brandData,
        createdAt: new Date().toISOString()
      };
      
      brands.push(newBrand);
      localStorage.setItem('brands', JSON.stringify(brands));
      
      return newBrand;
    } catch (error) {
      throw new Error('Failed to create brand');
    }
  }

  async update(id, updateData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const index = brands.findIndex(brand => brand.Id === parseInt(id));
      
      if (index === -1) {
        throw new Error('Brand not found');
      }
      
      brands[index] = {
        ...brands[index],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      localStorage.setItem('brands', JSON.stringify(brands));
      
      return brands[index];
    } catch (error) {
      throw new Error('Failed to update brand');
    }
  }

  async delete(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const filteredBrands = brands.filter(brand => brand.Id !== parseInt(id));
      
      localStorage.setItem('brands', JSON.stringify(filteredBrands));
      
      return true;
    } catch (error) {
      throw new Error('Failed to delete brand');
    }
  }
}

export default new BrandService();