import { TileData, TileLayout } from '../types/dashboard';

export const getDefaultTilesForView = (view: string): TileData[] => {
  const now = new Date().toLocaleString();
  
  // Create 20 tiles for testing scroll behavior and pinning
  const generateTestTiles = (prefix: string, baseCategory: string): TileData[] => {
    const tileTemplates = [
      { title: 'Total Revenue', value: '$89,203', change: 12.4, changeType: 'increase', type: 'metric', color: 'from-green-500 to-emerald-500' },
      { title: 'Active Users', value: '24,891', change: 8.7, changeType: 'increase', type: 'metric', color: 'from-blue-500 to-cyan-500' },
      { title: 'Conversion Rate', value: '3.21%', change: -2.1, changeType: 'decrease', type: 'metric', color: 'from-orange-500 to-red-500' },
      { title: 'Monthly Growth', value: '156%', change: 23.8, changeType: 'increase', type: 'chart', color: 'from-purple-500 to-pink-500' },
      { title: 'API Calls', value: '2.4M', change: 15.2, changeType: 'increase', type: 'api', color: 'from-indigo-500 to-purple-500' },
      { title: 'Server Uptime', value: '99.9%', change: 0.1, changeType: 'increase', type: 'metric', color: 'from-green-500 to-emerald-500' },
      { title: 'Page Views', value: '847K', change: 19.3, changeType: 'increase', type: 'chart', color: 'from-pink-500 to-rose-500' },
      { title: 'Bounce Rate', value: '2.34%', change: -5.6, changeType: 'decrease', type: 'metric', color: 'from-blue-500 to-cyan-500' },
      { title: 'Sales Volume', value: '$42.1K', change: 7.8, changeType: 'increase', type: 'metric', color: 'from-orange-500 to-red-500' },
      { title: 'Customer Satisfaction', value: '4.8/5', change: 3.2, changeType: 'increase', type: 'metric', color: 'from-purple-500 to-pink-500' },
      { title: 'Support Tickets', value: '127', change: -12.5, changeType: 'decrease', type: 'metric', color: 'from-green-500 to-emerald-500' },
      { title: 'Database Size', value: '1.2TB', change: 4.7, changeType: 'increase', type: 'chart', color: 'from-indigo-500 to-purple-500' },
      { title: 'Team Members', value: '45', change: 11.1, changeType: 'increase', type: 'metric', color: 'from-pink-500 to-rose-500' },
      { title: 'Projects Completed', value: '89', change: 22.4, changeType: 'increase', type: 'metric', color: 'from-blue-500 to-cyan-500' },
      { title: 'Response Time', value: '142ms', change: -8.3, changeType: 'decrease', type: 'chart', color: 'from-orange-500 to-red-500' },
      { title: 'Cache Hit Rate', value: '94.7%', change: 1.9, changeType: 'increase', type: 'metric', color: 'from-purple-500 to-pink-500' },
      { title: 'Error Rate', value: '0.03%', change: -15.7, changeType: 'decrease', type: 'metric', color: 'from-green-500 to-emerald-500' },
      { title: 'Feature Adoption', value: '78.2%', change: 9.4, changeType: 'increase', type: 'chart', color: 'from-indigo-500 to-purple-500' },
      { title: 'Load Time', value: '1.23s', change: -6.8, changeType: 'decrease', type: 'metric', color: 'from-pink-500 to-rose-500' },
      { title: 'Session Duration', value: '4m 32s', change: 14.6, changeType: 'increase', type: 'chart', color: 'from-blue-500 to-cyan-500' }
    ];

    return tileTemplates.map((template, index) => ({
      id: `${prefix}-${index + 1}`,
      title: template.title,
      description: `Real-time ${template.title.toLowerCase()} tracking with detailed metrics`,
      value: template.value,
      change: template.change,
      changeType: template.changeType as 'increase' | 'decrease',
      chart: template.type === 'chart' ? [45, 52, 48, 61, 58, 67, 73, 69] : undefined,
      type: template.type as 'metric' | 'chart' | 'api',
      color: template.color,
      category: baseCategory,
      lastUpdated: now
    }));
  };
  
  switch (view) {
    case 'ai-tools':
      return [
        {
          id: 'ai-insights',
          title: 'AI Sports Insights',
          description: 'Ask questions about sports, fantasy, and betting',
          value: 'Ask AI',
          type: 'interactive',
          color: 'from-purple-500 to-pink-500',
          category: 'AI Assistant',
          lastUpdated: now
        },
        {
          id: 'smart-suggestions',
          title: 'Smart Suggestions',
          description: 'AI-generated recommendations for your interests',
          value: 'Live Feed',
          type: 'embedded',
          color: 'from-indigo-500 to-purple-500',
          category: 'AI Insights',
          lastUpdated: now
        },
        ...generateTestTiles('ai', 'AI Performance').slice(0, 18)
      ];

    case 'api-feeds':
      return generateTestTiles('api', 'API Monitoring');

    case 'alerts':
      return generateTestTiles('alert', 'System Health');

    default: // dashboard
      return generateTestTiles('dash', 'Dashboard Metrics');
  }
};

export const getDefaultLayoutForView = (view: string, tiles: TileData[]): TileLayout[] => {
  // Not used anymore - using CSS Grid instead
  return [];
};