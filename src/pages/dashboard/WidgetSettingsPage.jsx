import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSettings, FiCode, FiEye, FiCopy, FiCheck } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const WidgetSettingsPage = () => {
  const [settings, setSettings] = useState({
    title: 'Leave us a review',
    description: 'We value your feedback and would love to hear about your experience.',
    primaryColor: '#3B82F6',
    buttonText: 'Submit Review',
    showLogo: true,
    collectEmail: true,
    collectPhone: false,
    requireComment: false,
  });
  
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState('settings');

  const tabs = [
    { id: 'settings', label: 'Widget Settings', icon: FiSettings },
    { id: 'code', label: 'Embed Code', icon: FiCode },
    { id: 'preview', label: 'Preview', icon: FiEye },
  ];

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateEmbedCode = () => {
    const userId = '12345'; // This would come from user context
    return `<iframe 
  src="${window.location.origin}/widget/${userId}" 
  width="100%" 
  height="600" 
  frameborder="0"
  style="border-radius: 8px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
</iframe>`;
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generateEmbedCode());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const renderSettings = () => (
    <div className="space-y-6">
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Widget Appearance</h3>
        
        <div className="space-y-6">
          <Input
            label="Widget Title"
            value={settings.title}
            onChange={(e) => handleSettingChange('title', e.target.value)}
            placeholder="Enter widget title"
          />
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={settings.description}
              onChange={(e) => handleSettingChange('description', e.target.value)}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter widget description"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Primary Color
              </label>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  className="h-10 w-20 border border-gray-300 rounded-md cursor-pointer"
                />
                <Input
                  value={settings.primaryColor}
                  onChange={(e) => handleSettingChange('primaryColor', e.target.value)}
                  placeholder="#3B82F6"
                  className="flex-1"
                />
              </div>
            </div>
            
            <Input
              label="Button Text"
              value={settings.buttonText}
              onChange={(e) => handleSettingChange('buttonText', e.target.value)}
              placeholder="Submit Review"
            />
          </div>
        </div>
      </Card>

      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Data Collection</h3>
        
        <div className="space-y-4">
          {[
            { key: 'showLogo', label: 'Show company logo', description: 'Display your logo in the widget' },
            { key: 'collectEmail', label: 'Collect email addresses', description: 'Ask customers for their email' },
            { key: 'collectPhone', label: 'Collect phone numbers', description: 'Ask customers for their phone number' },
            { key: 'requireComment', label: 'Require comments', description: 'Make comments mandatory for all reviews' },
          ].map((option) => (
            <div key={option.key} className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id={option.key}
                  type="checkbox"
                  checked={settings[option.key]}
                  onChange={(e) => handleSettingChange(option.key, e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3">
                <label htmlFor={option.key} className="text-sm font-medium text-gray-700">
                  {option.label}
                </label>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="flex justify-end">
        <Button>
          Save Settings
        </Button>
      </div>
    </div>
  );

  const renderEmbedCode = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Embed Code</h3>
      
      <div className="space-y-4">
        <p className="text-gray-600">
          Copy and paste this code into your website where you want the review widget to appear.
        </p>
        
        <div className="relative">
          <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
            <code>{generateEmbedCode()}</code>
          </pre>
          <Button
            onClick={copyToClipboard}
            className="absolute top-2 right-2"
            size="sm"
            variant="outline"
          >
            {copied ? <FiCheck className="h-4 w-4" /> : <FiCopy className="h-4 w-4" />}
            {copied ? 'Copied!' : 'Copy'}
          </Button>
        </div>
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Integration Instructions</h4>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Copy the embed code above</li>
            <li>Paste it into your website's HTML where you want the widget to appear</li>
            <li>The widget will automatically load and be ready to collect reviews</li>
            <li>Customize the appearance using the settings tab</li>
          </ol>
        </div>
      </div>
    </Card>
  );

  const renderPreview = () => (
    <Card>
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Widget Preview</h3>
      
      <div className="border border-gray-200 rounded-lg p-6 bg-gray-50">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-6">
          <div className="text-center mb-6">
            {settings.showLogo && (
              <div className="w-12 h-12 bg-blue-600 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-white font-bold">L</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-900 mb-2">{settings.title}</h3>
            <p className="text-gray-600">{settings.description}</p>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Your Name
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Enter your name"
              />
            </div>
            
            {settings.collectEmail && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your email"
                />
              </div>
            )}
            
            {settings.collectPhone && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Enter your phone"
                />
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Rating
              </label>
              <div className="flex space-x-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} className="text-yellow-400 hover:text-yellow-500">
                    ⭐
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Comment {settings.requireComment && <span className="text-red-500">*</span>}
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                placeholder="Share your experience..."
              />
            </div>
            
            <button
              className="w-full py-2 px-4 rounded-md text-white font-medium"
              style={{ backgroundColor: settings.primaryColor }}
            >
              {settings.buttonText}
            </button>
          </div>
        </div>
      </div>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Widget Settings</h1>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-5 w-5 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {activeTab === 'settings' && renderSettings()}
        {activeTab === 'code' && renderEmbedCode()}
        {activeTab === 'preview' && renderPreview()}
      </motion.div>
    </div>
  );
};

export default WidgetSettingsPage;