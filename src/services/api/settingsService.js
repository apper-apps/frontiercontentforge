class SettingsService {
  constructor() {
    this.storageKey = 'contentforge_settings';
  }

  async getSettings() {
    await new Promise(resolve => setTimeout(resolve, 200));

    try {
      const settings = localStorage.getItem(this.storageKey);
      return settings ? JSON.parse(settings) : {
        anthropicApiKey: '',
        perplexityApiKey: ''
      };
    } catch (error) {
      throw new Error('Failed to load settings');
    }
  }

  async updateSettings(settings) {
    await new Promise(resolve => setTimeout(resolve, 300));

    try {
      localStorage.setItem(this.storageKey, JSON.stringify(settings));
      return settings;
    } catch (error) {
      throw new Error('Failed to save settings');
    }
  }

  async getApiKey(provider) {
    const settings = await this.getSettings();
    switch (provider) {
      case 'anthropic':
        return settings.anthropicApiKey;
      case 'perplexity':
        return settings.perplexityApiKey;
      default:
        return null;
    }
  }
}

export default new SettingsService();