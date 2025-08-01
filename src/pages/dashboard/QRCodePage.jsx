import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FiSquare, FiDownload, FiCopy, FiCheck, FiSettings } from 'react-icons/fi';
import Card from '../../components/ui/Card';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

const QRCodePage = () => {
  const [qrSettings, setQrSettings] = useState({
    url: 'https://api.level-4u.com/review/12345',
    size: 256,
    errorCorrection: 'M',
    foregroundColor: '#000000',
    backgroundColor: '#FFFFFF',
    includeText: true,
    customText: 'Scan to leave a review',
  });
  
  const [copied, setCopied] = useState(false);

  const handleSettingChange = (key, value) => {
    setQrSettings(prev => ({ ...prev, [key]: value }));
  };

  const generateQRCodeURL = () => {
    // Using a QR code API service (in production, you might want to use a more robust solution)
    const params = new URLSearchParams({
      data: qrSettings.url,
      size: `${qrSettings.size}x${qrSettings.size}`,
      format: 'png',
      ecc: qrSettings.errorCorrection,
      color: qrSettings.foregroundColor.replace('#', ''),
      bgcolor: qrSettings.backgroundColor.replace('#', ''),
    });
    
    return `https://api.qrserver.com/v1/create-qr-code/?${params.toString()}`;
  };

  const copyURL = async () => {
    try {
      await navigator.clipboard.writeText(qrSettings.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const downloadQRCode = () => {
    const link = document.createElement('a');
    link.href = generateQRCodeURL();
    link.download = 'review-qr-code.png';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">QR Code Generator</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Settings */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiSettings className="h-5 w-5 mr-2" />
            QR Code Settings
          </h3>
          
          <div className="space-y-6">
            <Input
              label="Review URL"
              value={qrSettings.url}
              onChange={(e) => handleSettingChange('url', e.target.value)}
              placeholder="https://your-review-link.com"
            />
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Size (pixels)
                </label>
                <select
                  value={qrSettings.size}
                  onChange={(e) => handleSettingChange('size', parseInt(e.target.value))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value={128}>128x128</option>
                  <option value={256}>256x256</option>
                  <option value={512}>512x512</option>
                  <option value={1024}>1024x1024</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Error Correction
                </label>
                <select
                  value={qrSettings.errorCorrection}
                  onChange={(e) => handleSettingChange('errorCorrection', e.target.value)}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="L">Low (7%)</option>
                  <option value="M">Medium (15%)</option>
                  <option value="Q">Quartile (25%)</option>
                  <option value="H">High (30%)</option>
                </select>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Foreground Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={qrSettings.foregroundColor}
                    onChange={(e) => handleSettingChange('foregroundColor', e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <Input
                    value={qrSettings.foregroundColor}
                    onChange={(e) => handleSettingChange('foregroundColor', e.target.value)}
                    placeholder="#000000"
                    className="flex-1"
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Background Color
                </label>
                <div className="flex items-center space-x-3">
                  <input
                    type="color"
                    value={qrSettings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    className="h-10 w-16 border border-gray-300 rounded-md cursor-pointer"
                  />
                  <Input
                    value={qrSettings.backgroundColor}
                    onChange={(e) => handleSettingChange('backgroundColor', e.target.value)}
                    placeholder="#FFFFFF"
                    className="flex-1"
                  />
                </div>
              </div>
            </div>
            
            <div className="flex items-start">
              <div className="flex items-center h-5">
                <input
                  id="includeText"
                  type="checkbox"
                  checked={qrSettings.includeText}
                  onChange={(e) => handleSettingChange('includeText', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              </div>
              <div className="ml-3 flex-1">
                <label htmlFor="includeText" className="text-sm font-medium text-gray-700">
                  Include custom text
                </label>
                {qrSettings.includeText && (
                  <Input
                    value={qrSettings.customText}
                    onChange={(e) => handleSettingChange('customText', e.target.value)}
                    placeholder="Enter custom text"
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </div>
        </Card>

        {/* Preview and Actions */}
        <Card>
          <h3 className="text-lg font-semibold text-gray-900 mb-6 flex items-center">
            <FiSquare className="h-5 w-5 mr-2" />
            QR Code Preview
          </h3>
          
          <div className="text-center space-y-6">
            <motion.div
              key={JSON.stringify(qrSettings)}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="inline-block p-4 bg-white border border-gray-200 rounded-lg shadow-sm"
            >
              <img
                src={generateQRCodeURL()}
                alt="QR Code"
                className="mx-auto"
                style={{ 
                  width: Math.min(qrSettings.size, 300), 
                  height: Math.min(qrSettings.size, 300) 
                }}
              />
              {qrSettings.includeText && (
                <p className="mt-3 text-sm font-medium text-gray-700">
                  {qrSettings.customText}
                </p>
              )}
            </motion.div>
            
            <div className="space-y-3">
              <Button
                onClick={downloadQRCode}
                className="w-full"
              >
                <FiDownload className="h-4 w-4 mr-2" />
                Download QR Code
              </Button>
              
              <Button
                onClick={copyURL}
                variant="outline"
                className="w-full"
              >
                {copied ? <FiCheck className="h-4 w-4 mr-2" /> : <FiCopy className="h-4 w-4 mr-2" />}
                {copied ? 'Copied!' : 'Copy Review URL'}
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Usage Instructions */}
      <Card>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">How to Use Your QR Code</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">1</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Download & Print</h4>
            <p className="text-sm text-gray-600">
              Download the QR code and print it on business cards, flyers, or display materials.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">2</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Place Strategically</h4>
            <p className="text-sm text-gray-600">
              Position QR codes where customers can easily scan them after a positive experience.
            </p>
          </div>
          
          <div className="text-center">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-blue-600 font-bold">3</span>
            </div>
            <h4 className="font-medium text-gray-900 mb-2">Collect Reviews</h4>
            <p className="text-sm text-gray-600">
              Customers scan the code and are taken directly to your review form.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default QRCodePage;