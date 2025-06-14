import React, { useState, forwardRef } from 'react';
import { TrendingUp, TrendingDown, Clock, Brain, Sparkles, X, Cast, GripVertical } from 'lucide-react';
import { TileData } from '../types/dashboard';
import AIInsightsModal from './AIInsightsModal';
import SmartSuggestionsCard from './SmartSuggestionsCard';
import WarningModal from './WarningModal';

interface DashboardTileProps {
  tile: TileData;
  onTileUpdate: (updatedTile: TileData) => void;
  onDelete: (tileId: string) => void;
  onCast?: (tileId: string) => void;
  isDeleting?: boolean;
  isDraggable?: boolean;
  isCast?: boolean;
  currentView?: string;
}

const DashboardTile = forwardRef<HTMLDivElement, DashboardTileProps>(({ 
  tile, 
  onTileUpdate, 
  onDelete,
  onCast,
  isDeleting = false,
  isDraggable = false,
  isCast = false,
  currentView = 'dashboard'
}, ref) => {
  const [showAIInsights, setShowAIInsights] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [showUncastWarning, setShowUncastWarning] = useState(false);

  const handleCastClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    
    // If tile is already cast and we're on Stacc Cast page, show warning
    if (isCast && currentView === 'ai-tools') {
      setShowUncastWarning(true);
    } else {
      // Direct cast/uncast for other scenarios
      onCast?.(tile.id);
    }
  };

  const confirmUncast = () => {
    onCast?.(tile.id);
    setShowUncastWarning(false);
  };

  const cancelUncast = () => {
    setShowUncastWarning(false);
  };

  const renderSparkline = (data: number[]) => {
    const max = Math.max(...data);
    const min = Math.min(...data);
    const range = max - min || 1;
    
    return (
      <div className="flex items-end space-x-0.5 sm:space-x-1 h-6 sm:h-8 lg:h-10 xl:h-12 mt-2 sm:mt-3 lg:mt-4">
        {data.map((value, index) => (
          <div
            key={index}
            className="bg-spotify-green rounded-sm opacity-70 transition-all duration-300 hover:opacity-100 flex-1 min-w-0"
            style={{
              height: `${((value - min) / range) * 100}%`,
            }}
          />
        ))}
      </div>
    );
  };

  const renderTileContent = () => {
    // AI Insights Tile - Special interactive tile
    if (tile.id === 'ai-insights') {
      return (
        <div className="space-y-2 sm:space-y-3 lg:space-y-4 cursor-pointer h-full flex flex-col justify-center px-2 sm:px-3" onClick={() => setShowAIInsights(true)}>
          <div className="flex items-center space-x-2 sm:space-x-3">
            <div className="w-6 h-6 sm:w-8 sm:h-8 lg:w-10 lg:h-10 xl:w-12 xl:h-12 bg-spotify-green rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5 xl:w-6 xl:h-6 text-spotify-black" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-sm sm:text-base lg:text-lg xl:text-xl font-bold text-spotify-white font-spotify truncate">Ask AI</div>
              <div className="text-xs sm:text-sm text-spotify-green font-spotify truncate">Sports Intelligence</div>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-xs sm:text-sm text-spotify-text-gray">
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-spotify-green animate-pulse flex-shrink-0" />
            <span className="font-spotify truncate">Click to open AI assistant</span>
          </div>
        </div>
      );
    }

    // Smart Suggestions Tile - Special embedded component
    if (tile.id === 'smart-suggestions') {
      return (
        <div className="h-full overflow-hidden">
          <SmartSuggestionsCard />
        </div>
      );
    }

    // Standard tile content
    switch (tile.type) {
      case 'chart':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className="text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl font-bold text-spotify-white font-spotify text-center truncate">
              {tile.value}
            </div>
            {tile.chart && renderSparkline(tile.chart)}
          </div>
        );
      
      case 'metric':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className="text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-bold text-spotify-white font-spotify text-center truncate">
              {tile.value}
            </div>
            {tile.change !== undefined && (
              <div className={`flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base font-spotify ${
                tile.changeType === 'increase' ? 'text-spotify-green' : 'text-red-400'
              }`}>
                {tile.changeType === 'increase' ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                )}
                <span className="truncate">{Math.abs(tile.change)}% from last period</span>
              </div>
            )}
          </div>
        );
      
      case 'api':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className="text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-spotify-white font-spotify text-center truncate">
              {tile.value}
            </div>
            <div className="flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm text-spotify-text-gray">
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-spotify-green rounded-full animate-pulse flex-shrink-0"></div>
              <span className="font-spotify truncate">Live API Data</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className="h-full flex items-center justify-center text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold text-spotify-white font-spotify px-2 text-center">
            {tile.value}
          </div>
        );
    }
  };

  // Special styling for AI tiles
  const isAITile = tile.id === 'ai-insights' || tile.id === 'smart-suggestions';
  
  const tileClasses = `
    group relative w-full h-full bg-spotify-dark-gray rounded-xl border overflow-hidden
    transition-all duration-300
    ${isAITile ? 'cursor-pointer' : ''}
    ${isHovered ? 'scale-[1.02] shadow-2xl shadow-spotify-green/20' : ''}
    ${isDeleting ? 'opacity-0 scale-95' : ''}
    border-spotify-light-gray/20 hover:border-spotify-green/30
  `;

  return (
    <>
      <div
        ref={ref}
        className={tileClasses}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={tile.id === 'ai-insights' ? () => setShowAIInsights(true) : undefined}
      >
        {/* UPPER RIGHT CORNER - DRAG HANDLE + DELETE BUTTON */}
        <div className="absolute top-3 right-3 flex items-center space-x-2 z-20">
          {/* 6-DOT DRAG HANDLE */}
          {isDraggable && (
            <div className="p-1.5 rounded cursor-move opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-spotify-medium-gray/50 hover:bg-spotify-medium-gray flex items-center justify-center">
              <GripVertical className="w-4 h-4 text-spotify-text-gray" title="Drag to move tile" />
            </div>
          )}

          {/* DELETE BUTTON */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              e.preventDefault();
              onDelete(tile.id);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className="p-1.5 rounded bg-spotify-medium-gray/50 text-spotify-text-gray hover:text-white hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
            title="Delete tile"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* CAST BUTTON - BOTTOM LEFT */}
        <button
          onClick={handleCastClick}
          onMouseDown={(e) => e.stopPropagation()}
          className={`absolute bottom-3 left-3 p-2 rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 ${
            isCast 
              ? 'bg-spotify-green text-spotify-black shadow-lg shadow-spotify-green/30 opacity-100' 
              : 'bg-spotify-medium-gray/80 text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-green hover:text-spotify-black hover:shadow-lg hover:shadow-spotify-green/30'
          }`}
          title={isCast ? 'Remove from Stacc Cast' : 'Add to Stacc Cast'}
        >
          <Cast className="w-4 h-4" />
        </button>

        {/* HEADER */}
        <div className="absolute top-3 left-3 right-20 z-10 pointer-events-none">
          <h3 className="text-spotify-white font-bold text-sm leading-tight mb-1 font-spotify truncate">
            {tile.title}
          </h3>
          <p className="text-spotify-text-gray text-xs line-clamp-2 font-spotify">
            {tile.description}
          </p>
        </div>

        {/* CONTENT */}
        <div className="pt-16 pb-14 px-4 h-full">
          {renderTileContent()}
        </div>

        {/* FOOTER - TIME ONLY */}
        {tile.id !== 'smart-suggestions' && (
          <div className="absolute bottom-3 left-16 right-16 flex items-center justify-center space-x-1 text-xs text-spotify-text-gray font-spotify">
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{tile.lastUpdated}</span>
          </div>
        )}

        {/* Spotify-style active indicator */}
        <div className={`absolute inset-0 rounded-xl transition-all duration-300 pointer-events-none ${
          isHovered ? 'ring-2 ring-spotify-green/30 shadow-lg shadow-spotify-green/10' : ''
        }`} />

        {/* AI Tile Special Effects */}
        {isAITile && isHovered && (
          <div className="absolute inset-0 rounded-xl bg-spotify-green/5 pointer-events-none">
            <div className="absolute inset-0 rounded-xl border border-spotify-green/30 animate-pulse" />
          </div>
        )}

        {/* Cast State Indicator */}
        {isCast && (
          <div className="absolute left-0 top-0 bottom-0 w-1 bg-spotify-green rounded-l-xl pointer-events-none" />
        )}
      </div>

      {/* AI Insights Modal */}
      <AIInsightsModal
        isOpen={showAIInsights}
        onClose={() => setShowAIInsights(false)}
      />

      {/* Uncast Warning Modal */}
      <WarningModal
        isOpen={showUncastWarning}
        title="Remove from Stacc Cast"
        message={`Are you sure you want to remove "${tile.title}" from your Stacc Cast? You can always cast it again from other pages.`}
        actionText="Remove from Cast"
        onConfirm={confirmUncast}
        onCancel={cancelUncast}
        icon={<Cast className="w-5 h-5 text-orange-400" />}
        isDangerous={true}
      />
    </>
  );
});

DashboardTile.displayName = 'DashboardTile';

export default DashboardTile;