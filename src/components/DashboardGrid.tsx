import React, { useState, useEffect, useCallback } from 'react';
import { Responsive, WidthProvider, Layout } from 'react-grid-layout';
import { Loader2 } from 'lucide-react';
import DashboardTile from './DashboardTile';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { TileData } from '../types/dashboard';
import { useLayoutPersistence } from '../hooks/useLayoutPersistence';
import { getDefaultTilesForView } from '../data/mockData';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

const ResponsiveGridLayout = WidthProvider(Responsive);

interface DashboardGridProps {
  view: string;
  sidebarCollapsed: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ view, sidebarCollapsed }) => {
  const { saveLayout, loadLayout, resetLayout, isLoading } = useLayoutPersistence();
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [layouts, setLayouts] = useState<{ [key: string]: Layout[] }>({});
  const [tileToDelete, setTileToDelete] = useState<string | null>(null);
  const [deletingTile, setDeletingTile] = useState<string | null>(null);

  // Responsive breakpoints
  const breakpoints = { lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 };
  const cols = { lg: 6, md: 4, sm: 3, xs: 2, xxs: 1 };

  // Generate layout for tiles
  const generateLayout = useCallback((tileList: TileData[]): Layout[] => {
    return tileList.map((tile, index) => ({
      i: tile.id,
      x: (index % cols.lg) * 2,
      y: Math.floor(index / cols.lg) * 2,
      w: 2,
      h: 2,
      minW: 1,
      minH: 1,
      maxW: 4,
      maxH: 4,
    }));
  }, []);

  // Load saved layout or use defaults
  useEffect(() => {
    if (isLoading) return;

    const saved = loadLayout(view);
    const defaultTiles = getDefaultTilesForView(view);
    
    setTiles(defaultTiles);
    
    // Load saved layouts or generate new ones
    if (saved.layouts) {
      setLayouts(saved.layouts);
    } else {
      const newLayouts = {
        lg: generateLayout(defaultTiles),
        md: generateLayout(defaultTiles),
        sm: generateLayout(defaultTiles),
        xs: generateLayout(defaultTiles),
        xxs: generateLayout(defaultTiles),
      };
      setLayouts(newLayouts);
    }
  }, [view, loadLayout, isLoading, generateLayout]);

  const handleLayoutChange = useCallback((layout: Layout[], allLayouts: { [key: string]: Layout[] }) => {
    setLayouts(allLayouts);
    saveLayout(view, [], tiles, allLayouts);
  }, [view, tiles, saveLayout]);

  const handleTileUpdate = useCallback((updatedTile: TileData) => {
    setTiles(prev => prev.map(tile => 
      tile.id === updatedTile.id ? updatedTile : tile
    ));
  }, []);

  const handleDeleteTile = useCallback((tileId: string) => {
    setTileToDelete(tileId);
  }, []);

  const confirmDeleteTile = useCallback(() => {
    if (!tileToDelete) return;

    setDeletingTile(tileToDelete);
    
    setTimeout(() => {
      setTiles(prev => {
        const newTiles = prev.filter(tile => tile.id !== tileToDelete);
        
        // Update layouts to remove the deleted tile
        const newLayouts = Object.keys(layouts).reduce((acc, breakpoint) => {
          acc[breakpoint] = layouts[breakpoint].filter(layout => layout.i !== tileToDelete);
          return acc;
        }, {} as { [key: string]: Layout[] });
        
        setLayouts(newLayouts);
        saveLayout(view, [], newTiles, newLayouts);
        
        return newTiles;
      });
      setDeletingTile(null);
      setTileToDelete(null);
    }, 300);
  }, [tileToDelete, layouts, view, saveLayout]);

  const cancelDeleteTile = useCallback(() => {
    setTileToDelete(null);
  }, []);

  const handleResetLayout = useCallback(async () => {
    resetLayout(view);
    
    const defaultTiles = getDefaultTilesForView(view);
    const newLayouts = {
      lg: generateLayout(defaultTiles),
      md: generateLayout(defaultTiles),
      sm: generateLayout(defaultTiles),
      xs: generateLayout(defaultTiles),
      xxs: generateLayout(defaultTiles),
    };
    
    setTiles(defaultTiles);
    setLayouts(newLayouts);
  }, [view, resetLayout, generateLayout]);

  if (isLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 animate-spin text-spotify-green mx-auto mb-4" />
          <p className="text-spotify-text-gray font-spotify text-sm sm:text-base">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-spotify-black font-spotify">
      <div className="w-full max-w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 mx-auto overflow-x-hidden">
        
        {/* DRAG AND DROP GRID */}
        <div className="w-full">
          <ResponsiveGridLayout
            className="layout"
            layouts={layouts}
            onLayoutChange={handleLayoutChange}
            breakpoints={breakpoints}
            cols={cols}
            rowHeight={120}
            isDraggable={true}
            isResizable={true}
            margin={[16, 16]}
            containerPadding={[0, 0]}
            useCSSTransforms={true}
            preventCollision={false}
            compactType="vertical"
            draggableHandle=".drag-handle"
          >
            {tiles.map((tile) => (
              <div key={tile.id} className="relative">
                <DashboardTile
                  tile={tile}
                  onTileUpdate={handleTileUpdate}
                  onDelete={handleDeleteTile}
                  isDeleting={deletingTile === tile.id}
                  isDraggable={true}
                />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>

        {/* RESPONSIVE INFO */}
        <div className="mt-8 sm:mt-12 lg:mt-16 p-3 sm:p-4 lg:p-6 bg-spotify-dark-gray/30 rounded-xl border border-spotify-light-gray/20 w-full max-w-full">
          <div className="text-center">
            <p className="text-spotify-text-gray font-spotify mb-2 text-xs sm:text-sm lg:text-base">
              🎯 <strong className="text-spotify-white">Drag & Drop:</strong> Drag tiles to rearrange, resize corners to adjust size
            </p>
            <p className="text-spotify-text-gray text-xs sm:text-sm font-spotify">
              Total tiles: <strong className="text-spotify-green">{tiles.length}</strong> • 
              Layout: <strong className="text-spotify-green">Auto-saved</strong>
            </p>
          </div>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={tileToDelete !== null}
        tileName={tiles.find(t => t.id === tileToDelete)?.title || 'this tile'}
        onConfirm={confirmDeleteTile}
        onCancel={cancelDeleteTile}
      />
    </div>
  );
};

export default DashboardGrid;