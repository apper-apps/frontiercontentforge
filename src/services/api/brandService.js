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
        locations: brandData.locations || [],
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

  // Location management methods
  async getLocationsByBrandId(brandId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const brand = brands.find(brand => brand.Id === parseInt(brandId));
      
      if (!brand) {
        throw new Error('Brand not found');
      }
      
      return brand.locations || [];
    } catch (error) {
      throw new Error('Failed to load locations');
    }
  }

  async createLocation(brandId, locationData) {
    await new Promise(resolve => setTimeout(resolve, 250));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const brandIndex = brands.findIndex(brand => brand.Id === parseInt(brandId));
      
      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }
      
      if (!brands[brandIndex].locations) {
        brands[brandIndex].locations = [];
      }
      
      const maxId = brands[brandIndex].locations.length > 0 
        ? Math.max(...brands[brandIndex].locations.map(loc => loc.Id)) 
        : 0;
      
      const newLocation = {
        Id: maxId + 1,
        ...locationData,
        brandId: parseInt(brandId),
        createdAt: new Date().toISOString()
      };
      
      brands[brandIndex].locations.push(newLocation);
      brands[brandIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('brands', JSON.stringify(brands));
      
      return newLocation;
    } catch (error) {
      throw new Error('Failed to create location');
    }
  }

  async updateLocation(brandId, locationId, updateData) {
    await new Promise(resolve => setTimeout(resolve, 200));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const brandIndex = brands.findIndex(brand => brand.Id === parseInt(brandId));
      
      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }
      
      if (!brands[brandIndex].locations) {
        throw new Error('No locations found for this brand');
      }
      
      const locationIndex = brands[brandIndex].locations.findIndex(
        loc => loc.Id === parseInt(locationId)
      );
      
      if (locationIndex === -1) {
        throw new Error('Location not found');
      }
      
      brands[brandIndex].locations[locationIndex] = {
        ...brands[brandIndex].locations[locationIndex],
        ...updateData,
        updatedAt: new Date().toISOString()
      };
      
      brands[brandIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('brands', JSON.stringify(brands));
      
      return brands[brandIndex].locations[locationIndex];
    } catch (error) {
      throw new Error('Failed to update location');
    }
  }

  async deleteLocation(brandId, locationId) {
    await new Promise(resolve => setTimeout(resolve, 150));
    
    try {
      const brands = JSON.parse(localStorage.getItem('brands') || '[]');
      const brandIndex = brands.findIndex(brand => brand.Id === parseInt(brandId));
      
      if (brandIndex === -1) {
        throw new Error('Brand not found');
      }
      
      if (!brands[brandIndex].locations) {
        throw new Error('No locations found for this brand');
      }
      
      brands[brandIndex].locations = brands[brandIndex].locations.filter(
        loc => loc.Id !== parseInt(locationId)
      );
      
      brands[brandIndex].updatedAt = new Date().toISOString();
      
      localStorage.setItem('brands', JSON.stringify(brands));
      
      return true;
    } catch (error) {
      throw new Error('Failed to delete location');
    }
  }
}

export default new BrandService();