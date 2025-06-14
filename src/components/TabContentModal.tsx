import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { X, Plus, TrendingUp, BarChart3, Rss, Target, DollarSign, Activity, Clock, Layers } from 'lucide-react';
import { TabContent } from '../types/dashboard';

interface TabTemplate {
  id: string;
  title: string;
  description: string;
  type: 'metric' | 'chart' | 'api';
  icon: React.ReactNode;
  color: string;
  category: string;
  preview: {
    value: string;
    change?: number;
    changeType?: 'increase' | 'decrease';
  };
}

interface TabContentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectContent: (template: TabTemplate) => void;
  tabNumber: number;
  tileName: string;
}

const tabTemplates: TabTemplate[] = [
  {
    id: 'custom-metric',
    title: 'Custom Metric',
    description: 'Track any numeric value with trend indicators',
    type: 'metric',
    icon: <TrendingUp className="w-4 h-4" />,
    color: 'from-blue-500 to-cyan-500',
    category: 'Custom Data',
    preview: { value: '1,234', change: 5.7, changeType: 'increase' }
  },
  {
    id: 'performance-chart',
    title: 'Performance Chart',
    description: 'Visualize data trends with sparkline charts',
    type: 'chart',
    icon: <BarChart3 className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Performance Metrics',
    preview: { value: '89.2%', change: 12.3, changeType: 'increase' }
  },
  {
    id: 'api-monitor',
    title: 'API Monitor',
    description: 'Real-time API endpoint monitoring',
    type: 'api',
    icon: <Rss className="w-4 h-4" />,
    color: 'from-purple-500 to-pink-500',
    category: 'API Monitoring',
    preview: { value: '99.9%' }
  },
  {
    id: 'engagement-metric',
    title: 'User Engagement',
    description: 'Track user interaction metrics',
    type: 'metric',
    icon: <Target className="w-4 h-4" />,
    color: 'from-orange-500 to-red-500',
    category: 'User Engagement',
    preview: { value: '4.8k', change: 18.2, changeType: 'increase' }
  },
  {
    id: 'revenue-tracker',
    title: 'Revenue Tracker',
    description: 'Monitor financial metrics',
    type: 'metric',
    icon: <DollarSign className="w-4 h-4" />,
    color: 'from-green-500 to-emerald-500',
    category: 'Financial Data',
    preview: { value: '$42.1K', change: 7.8, changeType: 'increase' }
  },
  {
    id: 'response-time',
    title: 'Response Time',
    description: 'Track system response times',
    type: 'metric',
    icon: <Clock className="w-4 h-4" />,
    color: 'from-pink-500 to-rose-500',
    category: 'Performance Metrics',
    preview: { value: '142ms', change: -8.3, changeType: 'decrease' }
  }
];

const TabContentModal: React.FC<TabContentModalProps> = ({
  isOpen,
  onClose,
  onSelectContent,
  tabNumber,
  tileName
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredTemplates = tabTemplates.filter(template => 
    template.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSelectContent = (template: TabTemplate) => {
    onSelectContent(template);
    onClose();
  };

  const handleBackdropClick = (e: React.MouseEvent) => {
    // Only close if clicking the backdrop, not the modal content
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  if (!isOpen) return null;

  // Use React Portal to render modal at document.body level - fixes z-index issues
  return createPortal(
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4" 
      style={{ zIndex: 10001 }}
      onClick={handleBackdropClick}
    >
      <div 
        className="w-full max-w-3xl max-h-[85vh] bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl overflow-hidden relative" 
        style={{ zIndex: 10002 }}
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20 bg-spotify-green/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-spotify-green rounded-lg flex items-center justify-center">
              <Layers className="w-5 h-5 text-spotify-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-spotify-white font-spotify">Add Tab Content</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">
                Adding content to <span className="text-spotify-green font-medium">Tab {tabNumber}</span> in "{tileName}"
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b border-spotify-light-gray/20">
          <input
            type="text"
            placeholder="Search content types..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all font-spotify"
          />
        </div>

        {/* Content Templates Grid */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredTemplates.map((template) => (
              <button
                key={template.id}
                onClick={() => handleSelectContent(template)}
                className="p-4 bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-xl hover:border-spotify-green/40 hover:bg-spotify-light-gray/50 transition-all duration-300 text-left group"
              >
                {/* Template Header */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center text-white`}>
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-spotify-white group-hover:text-spotify-green transition-colors font-spotify truncate">
                      {template.title}
                    </h3>
                    <p className="text-xs text-spotify-text-gray font-spotify">
                      {template.category}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-spotify-text-gray mb-3 line-clamp-2 font-spotify">
                  {template.description}
                </p>

                {/* Mini Preview */}
                <div className="bg-spotify-dark-gray/50 rounded-lg p-2">
                  <div className="text-center">
                    <div className="text-sm font-bold text-spotify-white mb-1 font-spotify">
                      {template.preview.value}
                    </div>
                    {template.preview.change !== undefined && (
                      <div className={`flex items-center justify-center space-x-1 text-xs ${
                        template.preview.changeType === 'increase' ? 'text-spotify-green' : 'text-red-400'
                      }`}>
                        <TrendingUp className={`w-2 h-2 ${
                          template.preview.changeType === 'decrease' ? 'rotate-180' : ''
                        }`} />
                        <span className="font-spotify">{Math.abs(template.preview.change)}%</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Hover Indicator */}
                <div className="mt-2 text-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="text-xs text-spotify-green font-medium font-spotify">Click to add to tab</span>
                </div>
              </button>
            ))}
          </div>

          {/* No Results */}
          {filteredTemplates.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 bg-spotify-medium-gray rounded-full flex items-center justify-center mx-auto mb-3">
                <Plus className="w-6 h-6 text-spotify-text-gray" />
              </div>
              <h3 className="text-lg font-semibold text-spotify-white mb-2 font-spotify">No content found</h3>
              <p className="text-spotify-text-gray font-spotify">Try adjusting your search</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20 bg-spotify-medium-gray/30">
          <div className="flex items-center justify-between">
            <div className="text-sm text-spotify-text-gray font-spotify">
              {filteredTemplates.length} content type{filteredTemplates.length !== 1 ? 's' : ''} available for Tab {tabNumber}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2 bg-spotify-light-gray text-spotify-white rounded-full hover:bg-spotify-medium-gray transition-all font-spotify"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default TabContentModal;