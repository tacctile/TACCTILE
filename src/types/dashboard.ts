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
  { name: 'Purple', value: 'from-purple-500 to-pink-500', border: 'border-purple-500/30' },
  { name: 'Blue', value: 'from-blue-500 to-cyan-500', border: 'border-blue-500/30' },
  { name: 'Green', value: 'from-green-500 to-emerald-500', border: 'border-green-500/30' },
  { name: 'Orange', value: 'from-orange-500 to-red-500', border: 'border-orange-500/30' },
  { name: 'Pink', value: 'from-pink-500 to-rose-500', border: 'border-pink-500/30' },
  { name: 'Indigo', value: 'from-indigo-500 to-purple-500', border: 'border-indigo-500/30' },
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