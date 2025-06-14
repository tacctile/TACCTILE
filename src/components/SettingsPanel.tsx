import React, { useState } from 'react';
import { X, Moon, Sun, Key, RefreshCw, Save } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ isOpen, onClose }) => {
  const { isDark, toggleTheme } = useTheme();
  const [apiKey, setApiKey] = useState('');
  const [refreshInterval, setRefreshInterval] = useState('5');

  const handleSave = () => {
    localStorage.setItem('tacctile_api_key', apiKey);
    localStorage.setItem('tacctile_refresh_interval', refreshInterval);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20">
          <h2 className="text-xl font-bold text-spotify-white font-spotify">Settings</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Theme Toggle */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              Theme
            </label>
            <button
              onClick={toggleTheme}
              className="flex items-center space-x-3 p-3 w-full bg-spotify-medium-gray rounded-lg hover:bg-spotify-light-gray transition-all"
            >
              {isDark ? (
                <>
                  <Moon className="w-5 h-5 text-spotify-green" />
                  <span className="text-spotify-white font-spotify">Dark Mode</span>
                </>
              ) : (
                <>
                  <Sun className="w-5 h-5 text-yellow-400" />
                  <span className="text-spotify-white font-spotify">Light Mode</span>
                </>
              )}
            </button>
          </div>

          {/* API Key */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              API Key
            </label>
            <div className="relative">
              <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text-gray w-5 h-5" />
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Enter your API key"
                className="w-full pl-10 pr-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all font-spotify"
              />
            </div>
          </div>

          {/* Refresh Interval */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              Data Refresh Interval
            </label>
            <div className="relative">
              <RefreshCw className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text-gray w-5 h-5" />
              <select
                value={refreshInterval}
                onChange={(e) => setRefreshInterval(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all appearance-none font-spotify"
              >
                <option value="1">1 minute</option>
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">1 hour</option>
              </select>
            </div>
          </div>

          {/* Layout Settings */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              Layout Options
            </label>
            <div className="space-y-2">
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded bg-spotify-medium-gray border-spotify-light-gray/30 text-spotify-green focus:ring-spotify-green/20"
                  defaultChecked
                />
                <span className="text-spotify-text-gray font-spotify">Auto-save layout changes</span>
              </label>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  className="rounded bg-spotify-medium-gray border-spotify-light-gray/30 text-spotify-green focus:ring-spotify-green/20"
                  defaultChecked
                />
                <span className="text-spotify-text-gray font-spotify">Enable tile animations</span>
              </label>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20">
          <button
            onClick={handleSave}
            className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-bold rounded-full transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsPanel;