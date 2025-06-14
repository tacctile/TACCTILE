import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TileData } from '../types/dashboard';
import { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'tacctile_dashboard_config';

interface LayoutConfig {
  deletedTiles: { [key: string]: string[] };
  layouts: { [key: string]: { [key: string]: Layout[] } };
  castTiles: string[]; // Global cast tiles across all views
  castTileData: { [key: string]: TileData }; // Store the actual tile data
  lastModified: string;
}

export const useLayoutPersistence = () => {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  const saveToStorage = useCallback((config: LayoutConfig) => {
    if (user) {
      const userKey = `${STORAGE_KEY}_user_${user.id}`;
      localStorage.setItem(userKey, JSON.stringify(config));
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(config));
    }
  }, [user]);

  const loadFromStorage = useCallback((): LayoutConfig | null => {
    try {
      const key = user ? `${STORAGE_KEY}_user_${user.id}` : STORAGE_KEY;
      const stored = localStorage.getItem(key);
      return stored ? JSON.parse(stored) : null;
    } catch (error) {
      console.error('Failed to load dashboard config:', error);
      return null;
    }
  }, [user]);

  const saveLayout = useCallback((
    view: string, 
    deletedTiles: string[], 
    tiles: TileData[], 
    layouts?: { [key: string]: Layout[] },
    castTiles?: string[],
    castTileData?: { [key: string]: TileData }
  ) => {
    const existing = loadFromStorage() || { 
      deletedTiles: {}, 
      layouts: {}, 
      castTiles: [], 
      castTileData: {},
      lastModified: '' 
    };
    
    const config: LayoutConfig = {
      deletedTiles: { ...existing.deletedTiles, [view]: deletedTiles },
      layouts: layouts ? { ...existing.layouts, [view]: layouts } : existing.layouts,
      castTiles: castTiles !== undefined ? castTiles : existing.castTiles,
      castTileData: castTileData !== undefined ? castTileData : existing.castTileData,
      lastModified: new Date().toISOString()
    };
    saveToStorage(config);
  }, [loadFromStorage, saveToStorage]);

  const loadLayout = useCallback((view: string): { 
    deletedTiles: string[], 
    layouts?: { [key: string]: Layout[] },
    castTiles: string[],
    castTileData: { [key: string]: TileData }
  } => {
    const config = loadFromStorage();
    if (config) {
      return {
        deletedTiles: config.deletedTiles?.[view] || [],
        layouts: config.layouts?.[view],
        castTiles: config.castTiles || [],
        castTileData: config.castTileData || {}
      };
    }
    return { 
      deletedTiles: [], 
      castTiles: [],
      castTileData: {}
    };
  }, [loadFromStorage]);

  const resetLayout = useCallback((view: string) => {
    const config = loadFromStorage() || { 
      deletedTiles: {}, 
      layouts: {}, 
      castTiles: [], 
      castTileData: {},
      lastModified: '' 
    };
    
    const updatedConfig: LayoutConfig = {
      ...config,
      deletedTiles: { ...config.deletedTiles, [view]: [] },
      layouts: { ...config.layouts, [view]: {} },
      lastModified: new Date().toISOString()
    };
    
    saveToStorage(updatedConfig);
  }, [loadFromStorage, saveToStorage]);

  const resetAllCastTiles = useCallback(() => {
    const config = loadFromStorage() || { 
      deletedTiles: {}, 
      layouts: {}, 
      castTiles: [], 
      castTileData: {},
      lastModified: '' 
    };
    
    const updatedConfig: LayoutConfig = {
      ...config,
      castTiles: [],
      castTileData: {},
      lastModified: new Date().toISOString()
    };
    
    saveToStorage(updatedConfig);
  }, [loadFromStorage, saveToStorage]);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 200);
    return () => clearTimeout(timer);
  }, [user]);

  return {
    saveLayout,
    loadLayout,
    resetLayout,
    resetAllCastTiles,
    isLoading
  };
};