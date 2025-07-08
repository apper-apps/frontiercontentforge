class SettingsService {
  constructor() {
    this.storageKey = 'contentforge_settings';
  }

async getSettings() {
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const settings = localStorage.getItem(this.storageKey);
      const defaultSettings = {
        anthropicApiKey: '',
        perplexityApiKey: '',
        neuronwriterApiKey: ''
      };
      
      if (!settings) {
        return defaultSettings;
      }
      
      const parsed = JSON.parse(settings);
      // Ensure all required keys exist
      return {
        ...defaultSettings,
        ...parsed
      };
    } catch (error) {
      console.error('Settings parsing error:', error);
      throw new Error('Failed to load settings. Please check your configuration.');
    }
  }

async updateSettings(settings) {
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      // Validate settings object
      if (!settings || typeof settings !== 'object') {
        throw new Error('Invalid settings format');
      }
      
      // Get current settings to preserve any existing values
      const currentSettings = await this.getSettings();
      const updatedSettings = {
        ...currentSettings,
        ...settings
      };
      
      localStorage.setItem(this.storageKey, JSON.stringify(updatedSettings));
      return updatedSettings;
    } catch (error) {
      console.error('Settings save error:', error);
      throw new Error('Failed to save settings. Please try again.');
    }
  }

async getApiKey(provider) {
    try {
      const settings = await this.getSettings();
      
      switch (provider) {
        case 'anthropic':
          return settings.anthropicApiKey?.trim() || null;
        case 'perplexity':
          return settings.perplexityApiKey?.trim() || null;
        case 'neuronwriter':
          return settings.neuronwriterApiKey?.trim() || null;
        default:
          throw new Error(`Unknown API provider: ${provider}`);
      }
    } catch (error) {
      console.error(`Failed to get API key for ${provider}:`, error);
      throw new Error(`Failed to retrieve ${provider} API key`);
    }
  }
  
  async validateApiKey(provider, apiKey) {
    if (!apiKey || typeof apiKey !== 'string' || apiKey.trim() === '') {
      return false;
    }
    
    // Basic validation - can be enhanced with provider-specific validation
    switch (provider) {
      case 'anthropic':
        return apiKey.startsWith('sk-ant-');
      case 'perplexity':
        return apiKey.length > 10; // Basic length check
      case 'neuronwriter':
        return apiKey.length > 10; // Basic length check
      default:
        return false;
    }
  }
}

export default new SettingsService();