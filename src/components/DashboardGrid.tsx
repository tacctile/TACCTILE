import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Cast, RotateCcw } from 'lucide-react';
import DashboardTile from './DashboardTile';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import WarningModal from './WarningModal';
import { TileData } from '../types/dashboard';
import { useLayoutPersistence } from '../hooks/useLayoutPersistence';
import { getDefaultTilesForView } from '../data/mockData';

interface DashboardGridProps {
  view: string;
  sidebarCollapsed: boolean;
}

const DashboardGrid: React.FC<DashboardGridProps> = ({ view, sidebarCollapsed }) => {
  const { saveLayout, loadLayout, resetLayout, resetAllCastTiles, isLoading } = useLayoutPersistence();
  const [tiles, setTiles] = useState<TileData[]>([]);
  const [tileToDelete, setTileToDelete] = useState<string | null>(null);
  const [deletingTile, setDeletingTile] = useState<string | null>(null);
  const [castTiles, setCastTiles] = useState<Set<string>>(new Set());
  const [castTileData, setCastTileData] = useState<{ [key: string]: TileData }>({});
  const [isResetting, setIsResetting] = useState(false);
  const [draggedTile, setDraggedTile] = useState<string | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);
  
  // Warning modal states
  const [showClearAllWarning, setShowClearAllWarning] = useState(false);

  // Load saved layout or use defaults
  useEffect(() => {
    if (isLoading) return;

    const saved = loadLayout(view);
    
    // Load global cast tiles data with safety check
    setCastTiles(new Set(Array.isArray(saved.castTiles) ? saved.castTiles : []));
    setCastTileData(saved.castTileData || {});
    
    let tilesToShow: TileData[] = [];
    
    if (view === 'ai-tools') {
      // For Stacc Cast view, show all cast tiles
      const safeCastTiles = Array.isArray(saved.castTiles) ? saved.castTiles : [];
      const safeCastTileData = saved.castTileData || {};
      tilesToShow = safeCastTiles.map(tileId => safeCastTileData[tileId]).filter(Boolean);
    } else {
      // For other views, show default tiles
      tilesToShow = getDefaultTilesForView(view);
    }
    
    setTiles(tilesToShow);
  }, [view, loadLayout, isLoading]);

  // Simple drag and drop handlers for all views
  const handleDragStart = useCallback((e: React.DragEvent, tileId: string) => {
    e.dataTransfer.setData('text/plain', tileId);
    setDraggedTile(tileId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, index: number) => {
    e.preventDefault();
    setDragOverIndex(index);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverIndex(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    const draggedTileId = e.dataTransfer.getData('text/plain');
    
    if (!draggedTileId) return;

    setTiles(prevTiles => {
      const newTiles = [...prevTiles];
      const draggedIndex = newTiles.findIndex(tile => tile.id === draggedTileId);
      
      if (draggedIndex === -1) return prevTiles;
      
      // Remove the dragged tile from its current position
      const [draggedTile] = newTiles.splice(draggedIndex, 1);
      
      // Insert it at the target position
      newTiles.splice(targetIndex, 0, draggedTile);
      
      // Save the new order
      if (view === 'ai-tools') {
        // For Stacc Cast, update cast tile data
        const newCastTileData = { ...castTileData };
        const newCastTileIds = newTiles.map(tile => tile.id);
        saveLayout(view, [], newTiles, undefined, newCastTileIds, newCastTileData);
      } else {
        // For other views, just save the tile order
        saveLayout(view, [], newTiles, undefined, Array.from(castTiles), castTileData);
      }
      
      return newTiles;
    });

    setDraggedTile(null);
    setDragOverIndex(null);
  }, [view, castTileData, castTiles, saveLayout]);

  const handleTileUpdate = useCallback((updatedTile: TileData) => {
    setTiles(prev => prev.map(tile => 
      tile.id === updatedTile.id ? updatedTile : tile
    ));
    
    // Update cast tile data if this tile is cast
    if (castTiles.has(updatedTile.id)) {
      const newCastTileData = { ...castTileData, [updatedTile.id]: updatedTile };
      setCastTileData(newCastTileData);
      saveLayout(view, [], tiles, undefined, Array.from(castTiles), newCastTileData);
    }
  }, [castTiles, castTileData, view, tiles, saveLayout]);

  const handleDeleteTile = useCallback((tileId: string) => {
    setTileToDelete(tileId);
  }, []);

  const handleCastTile = useCallback((tileId: string) => {
    const tileToToggle = tiles.find(t => t.id === tileId);
    if (!tileToToggle) return;

    setCastTiles(prev => {
      const newCastTiles = new Set(prev);
      let newCastTileData = { ...castTileData };
      
      if (newCastTiles.has(tileId)) {
        // Remove from cast
        newCastTiles.delete(tileId);
        delete newCastTileData[tileId];
      } else {
        // Add to cast
        newCastTiles.add(tileId);
        newCastTileData[tileId] = tileToToggle;
      }
      
      setCastTileData(newCastTileData);
      
      // Save the global cast state
      saveLayout(view, [], tiles, undefined, Array.from(newCastTiles), newCastTileData);
      
      return newCastTiles;
    });
  }, [tiles, castTileData, view, saveLayout]);

  const confirmDeleteTile = useCallback(() => {
    if (!tileToDelete) return;

    setDeletingTile(tileToDelete);
    
    setTimeout(() => {
      setTiles(prev => {
        const newTiles = prev.filter(tile => tile.id !== tileToDelete);
        
        // Remove from cast tiles if it was cast
        const newCastTiles = new Set(castTiles);
        newCastTiles.delete(tileToDelete);
        setCastTiles(newCastTiles);
        
        const newCastTileData = { ...castTileData };
        delete newCastTileData[tileToDelete];
        setCastTileData(newCastTileData);
        
        saveLayout(view, [], newTiles, undefined, Array.from(newCastTiles), newCastTileData);
        
        return newTiles;
      });
      setDeletingTile(null);
      setTileToDelete(null);
    }, 300);
  }, [tileToDelete, view, saveLayout, castTiles, castTileData]);

  const cancelDeleteTile = useCallback(() => {
    setTileToDelete(null);
  }, []);

  const handleResetLayoutClick = useCallback(() => {
    if (view === 'ai-tools' && castTiles.size > 0) {
      // Show warning for Stacc Cast clear all
      setShowClearAllWarning(true);
    } else {
      // Direct reset for other views or empty Stacc Cast
      performResetLayout();
    }
  }, [view, castTiles.size]);

  const performResetLayout = useCallback(async () => {
    setIsResetting(true);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (view === 'ai-tools') {
      // For Stacc Cast, reset all cast tiles
      resetAllCastTiles();
      setCastTiles(new Set());
      setCastTileData({});
      setTiles([]);
    } else {
      // For other views, reset layout
      resetLayout(view);
      const defaultTiles = getDefaultTilesForView(view);
      setTiles(defaultTiles);
    }
    
    setIsResetting(false);
    setShowClearAllWarning(false);
  }, [view, resetLayout, resetAllCastTiles]);

  const cancelClearAll = useCallback(() => {
    setShowClearAllWarning(false);
  }, []);

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

  // Show empty state for Stacc Cast when no tiles are cast
  if (view === 'ai-tools' && castTiles.size === 0) {
    return (
      <div className="w-full h-screen flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Cast className="w-8 h-8 text-spotify-green" />
          </div>
          <h2 className="text-2xl font-bold text-spotify-white mb-2 font-spotify">Your Stacc Cast is Empty</h2>
          <p className="text-spotify-text-gray font-spotify mb-4">
            Cast tiles from other pages to build your personalized collection here.
          </p>
          <p className="text-spotify-text-gray text-sm font-spotify">
            Look for the <Cast className="w-4 h-4 inline mx-1" /> icon on tiles to add them to your Stacc Cast.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-spotify-black font-spotify">
      <div className="w-full max-w-full px-3 sm:px-4 lg:px-6 xl:px-8 py-4 sm:py-6 lg:py-8 mx-auto overflow-x-hidden">
        
        {/* HEADER */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl lg:text-3xl font-bold text-spotify-white mb-2 font-spotify">
              {view === 'ai-tools' ? 'Stacc Cast' : 'Your Dashboard'}
            </h2>
            <p className="text-spotify-text-gray font-spotify">
              {view === 'ai-tools' 
                ? `${castTiles.size} tiles in your cast collection - drag and drop to reorder`
                : 'Drag and drop tiles to reorder your dashboard layout'
              }
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handleResetLayoutClick}
              disabled={isResetting}
              className="flex items-center space-x-2 px-4 py-2 bg-spotify-light-gray border border-spotify-light-gray rounded-full text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-medium-gray transition-all disabled:opacity-50 disabled:cursor-not-allowed font-spotify"
            >
              <RotateCcw className={`w-4 h-4 ${isResetting ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">
                {view === 'ai-tools' 
                  ? (isResetting ? 'Clearing...' : 'Clear All')
                  : (isResetting ? 'Resetting...' : 'Reset')
                }
              </span>
            </button>
          </div>
        </div>

        {/* UNIFIED GRID - CSS Grid with drag and drop for all views */}
        <div className={`transition-all duration-500 ${
          isResetting ? 'opacity-50 scale-95' : 'opacity-100 scale-100'
        }`}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {tiles.map((tile, index) => (
              <div
                key={tile.id}
                className={`w-full h-80 relative transition-all duration-300 ${
                  dragOverIndex === index ? 'transform scale-105 z-10' : ''
                } ${
                  draggedTile === tile.id ? 'opacity-50 transform rotate-2 scale-95' : ''
                }`}
                draggable
                onDragStart={(e) => handleDragStart(e, tile.id)}
                onDragOver={(e) => handleDragOver(e, index)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, index)}
              >
                {/* Drop indicator */}
                {dragOverIndex === index && draggedTile !== tile.id && (
                  <div className="absolute inset-0 border-2 border-dashed border-spotify-green bg-spotify-green/10 rounded-xl z-10 pointer-events-none" />
                )}
                
                <DashboardTile
                  tile={tile}
                  onTileUpdate={handleTileUpdate}
                  onDelete={handleDeleteTile}
                  onCast={handleCastTile}
                  isDeleting={deletingTile === tile.id}
                  isDraggable={true}
                  isCast={castTiles.has(tile.id)}
                  currentView={view}
                />
              </div>
            ))}
          </div>
        </div>

        {/* INFO SECTION */}
        {view !== 'ai-tools' && (
          <div className="mt-8 sm:mt-12 lg:mt-16 p-3 sm:p-4 lg:p-6 bg-spotify-dark-gray/30 rounded-xl border border-spotify-light-gray/20 w-full max-w-full">
            <div className="text-center">
              <p className="text-spotify-text-gray font-spotify mb-2 text-xs sm:text-sm lg:text-base">
                🚀 <strong className="text-spotify-white">Simple Drag & Drop:</strong> Drag tiles to reorder them - tiles flow naturally one after another
              </p>
              <p className="text-spotify-text-gray text-xs sm:text-sm font-spotify">
                Total tiles: <strong className="text-spotify-green">{tiles.length}</strong> • 
                Global cast tiles: <strong className="text-spotify-green">{castTiles.size}</strong> • 
                Layout: <strong className="text-spotify-green">Dynamic Flow</strong>
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={tileToDelete !== null}
        tileName={tiles.find(t => t.id === tileToDelete)?.title || 'this tile'}
        onConfirm={confirmDeleteTile}
        onCancel={cancelDeleteTile}
      />

      {/* Clear All Warning Modal */}
      <WarningModal
        isOpen={showClearAllWarning}
        title="Clear All Cast Tiles"
        message={`Are you sure you want to remove all ${castTiles.size} tiles from your Stacc Cast? This will permanently remove them from your collection, but you can always cast them again from other pages.`}
        actionText="Clear All"
        onConfirm={performResetLayout}
        onCancel={cancelClearAll}
        icon={<Cast className="w-5 h-5 text-orange-400" />}
        isDangerous={true}
      />
    </div>
  );
};

export default DashboardGrid;