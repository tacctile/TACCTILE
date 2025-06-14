export interface TabContent {
  id: string;
  title: string;
  value: string | number;
  description: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  chart?: number[];
  type: 'metric' | 'chart' | 'list' | 'api' | 'interactive' | 'embedded';
  color: string;
  category: string;
  lastUpdated: string;
}

export interface TileSettings {
  backgroundColor?: string;
  textColor?: string;
}

export interface TileData {
  id: string;
  title: string;
  value: string | number;
  description: string;
  change?: number;
  changeType?: 'increase' | 'decrease';
  chart?: number[];
  type: 'metric' | 'chart' | 'list' | 'api' | 'interactive' | 'embedded';
  color: string;
  category: string;
  lastUpdated: string;
  // Multi-tab support
  tabs?: {
    tab1?: TabContent;
    tab2?: TabContent;
    tab3?: TabContent;
  };
  // Tile customization settings
  settings?: TileSettings;
}

export interface TileLayout {
  i: string;
  x: number;
  y: number;
  w: number;
  h: number;
  minW?: number;
  minH?: number;
  maxW?: number;
  maxH?: number;
}

export const tileColors = [
  { name: 'Default Dark', value: 'bg-spotify-dark-gray' },
  { name: 'Spotify Green', value: 'bg-spotify-green/20' },
  { name: 'Purple', value: 'bg-purple-500/20' },
  { name: 'Blue', value: 'bg-blue-500/20' },
  { name: 'Orange', value: 'bg-orange-500/20' },
  { name: 'Pink', value: 'bg-pink-500/20' },
  { name: 'Red', value: 'bg-red-500/20' },
  { name: 'Teal', value: 'bg-teal-500/20' },
  { name: 'Yellow', value: 'bg-yellow-500/20' },
  { name: 'Indigo', value: 'bg-indigo-500/20' },
  { name: 'Emerald', value: 'bg-emerald-500/20' },
  { name: 'Rose', value: 'bg-rose-500/20' }
];

export const textColors = [
  { name: 'Default White', value: 'text-spotify-white', color: '#ffffff' },
  { name: 'Spotify Green', value: 'text-spotify-green', color: '#1DB954' },
  { name: 'Light Gray', value: 'text-spotify-text-gray', color: '#b3b3b3' },
  { name: 'Yellow', value: 'text-yellow-400', color: '#facc15' },
  { name: 'Blue', value: 'text-blue-400', color: '#60a5fa' },
  { name: 'Purple', value: 'text-purple-400', color: '#c084fc' },
  { name: 'Orange', value: 'text-orange-400', color: '#fb923c' },
  { name: 'Pink', value: 'text-pink-400', color: '#f472b6' },
  { name: 'Cyan', value: 'text-cyan-400', color: '#22d3ee' },
  { name: 'Emerald', value: 'text-emerald-400', color: '#34d399' },
  { name: 'Red', value: 'text-red-400', color: '#f87171' },
  { name: 'Indigo', value: 'text-indigo-400', color: '#818cf8' }
];

export const dataCategories = [
  'Dashboard Metrics',
  'Performance Metrics',
  'Financial Data',
  'User Engagement',
  'System Health',
  'API Monitoring',
  'AI Insights',
  'AI Assistant',
  'AI Performance',
  'Custom Data'
];