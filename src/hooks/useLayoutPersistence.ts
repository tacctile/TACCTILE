import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { TileData } from '../types/dashboard';
import { Layout } from 'react-grid-layout';

const STORAGE_KEY = 'tacctile_dashboard_config';

interface LayoutConfig {
  deletedTiles: { [key: string]: string[] };
  layouts: { [key: string]: { [key: string]: Layout[] } };
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

  const saveLayout = useCallback((view: string, deletedTiles: string[], tiles: TileData[], layouts?: { [key: string]: Layout[] }) => {
    const existing = loadFromStorage() || { deletedTiles: {}, layouts: {}, lastModified: '' };
    const config: LayoutConfig = {
      deletedTiles: { ...existing.deletedTiles, [view]: deletedTiles },
      layouts: layouts ? { ...existing.layouts, [view]: layouts } : existing.layouts,
      lastModified: new Date().toISOString()
    };
    saveToStorage(config);
  }, [loadFromStorage, saveToStorage]);

  const loadLayout = useCallback((view: string): { deletedTiles: string[], layouts?: { [key: string]: Layout[] } } => {
    const config = loadFromStorage();
    if (config) {
      return {
        deletedTiles: config.deletedTiles?.[view] || [],
        layouts: config.layouts?.[view]
      };
    }
    return { deletedTiles: [] };
  }, [loadFromStorage]);

  const resetLayout = useCallback((view: string) => {
    const config = loadFromStorage() || { deletedTiles: {}, layouts: {}, lastModified: '' };
    const updatedConfig: LayoutConfig = {
      ...config,
      deletedTiles: { ...config.deletedTiles, [view]: [] },
      layouts: { ...config.layouts, [view]: {} },
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
    isLoading
  };
};