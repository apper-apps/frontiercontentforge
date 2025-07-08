import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import Card from '@/components/atoms/Card';
import Button from '@/components/atoms/Button';
import ApperIcon from '@/components/ApperIcon';
import FormField from '@/components/molecules/FormField';
import settingsService from '@/services/api/settingsService';

const Settings = () => {
const [settings, setSettings] = useState({
    anthropicApiKey: '',
    perplexityApiKey: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const data = await settingsService.getSettings();
      setSettings(data);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

const handleSave = async () => {
if (!settings.anthropicApiKey.trim() && !settings.perplexityApiKey.trim()) {
      toast.error('Please provide at least one API key');
      return;
    }

    setSaving(true);
    try {
      await settingsService.updateSettings(settings);
      toast.success('Settings saved successfully!');
    } catch (error) {
      toast.error('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const maskApiKey = (key) => {
    if (!key) return '';
    if (key.length <= 8) return key;
    return `${key.substring(0, 4)}${'*'.repeat(key.length - 8)}${key.substring(key.length - 4)}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center gap-3">
          <ApperIcon name="Loader2" size={20} className="animate-spin text-primary" />
          <span>Loading settings...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">
          Configure your API keys and application preferences
        </p>
      </div>

      {/* API Keys Section */}
      <Card className="p-6">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-2">API Keys</h2>
          <p className="text-gray-600">
            Configure your API keys for enhanced content generation
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Brain" size={16} className="text-purple-600" />
                <h3 className="font-medium text-gray-900">Anthropic Claude</h3>
              </div>
              <FormField
                label="API Key"
                type="password"
                value={settings.anthropicApiKey}
                onChange={(e) => handleInputChange('anthropicApiKey', e.target.value)}
                placeholder="sk-ant-..."
                helpText="Used for advanced content generation and analysis"
              />
              {settings.anthropicApiKey && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Current:</span> {maskApiKey(settings.anthropicApiKey)}
                </div>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <ApperIcon name="Search" size={16} className="text-blue-600" />
                <h3 className="font-medium text-gray-900">Perplexity AI</h3>
              </div>
              <FormField
                label="API Key"
                type="password"
                value={settings.perplexityApiKey}
                onChange={(e) => handleInputChange('perplexityApiKey', e.target.value)}
                placeholder="pplx-..."
                helpText="Used for research and supplementary insights"
              />
              {settings.perplexityApiKey && (
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Current:</span> {maskApiKey(settings.perplexityApiKey)}
                </div>
              )}
</div>
          </div>

<div className="pt-4 border-t border-gray-200">
            <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
              <ApperIcon name="Building2" size={16} className="text-amber-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-amber-900 mb-1">Neuronwriter API Key</p>
                <p className="text-amber-700">
                  The Neuronwriter API key is configured in your brand settings. 
                  Each brand can have its own Neuronwriter configuration for SEO content analysis.
                </p>
              </div>
            </div>
          </div>

          <div className="pt-4">
            <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg">
              <ApperIcon name="Info" size={16} className="text-blue-600 mt-0.5" />
              <div className="text-sm">
                <p className="font-medium text-blue-900 mb-1">API Key Security</p>
                <p className="text-blue-700">
                  Your API keys are stored securely in your browser's local storage. 
                  They are only used for content generation and are never shared with third parties.
                </p>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4">
            <Button
              onClick={handleSave}
              loading={saving}
              disabled={saving}
              icon="Save"
            >
              Save Settings
            </Button>
          </div>
        </div>
      </Card>

      {/* Neuronwriter Integration Info */}
      <Card className="p-6">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-600 rounded-lg flex items-center justify-center">
            <ApperIcon name="Zap" size={20} className="text-white" />
          </div>
          <div className="flex-1">
<h3 className="font-semibold text-gray-900 mb-1">Neuronwriter Integration</h3>
            <p className="text-gray-600 mb-3">
              Configure your Neuronwriter API key in your brand settings to enable SEO content analysis and optimization. 
              When you generate content, queries will be created in Neuronwriter for comprehensive SEO insights.
            </p>
            <div className="text-sm text-gray-500">
              <p>• Automatic query generation during content creation</p>
              <p>• SEO analysis and recommendations</p>
              <p>• Competitor analysis integration</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Settings;