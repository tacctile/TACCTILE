import React, { useState, forwardRef } from 'react';
import { TrendingUp, TrendingDown, Clock, Brain, Sparkles, X, Cast, GripVertical, Settings } from 'lucide-react';
import { TileData, TabContent } from '../types/dashboard';
import AIInsightsModal from './AIInsightsModal';
import SmartSuggestionsCard from './SmartSuggestionsCard';
import WarningModal from './WarningModal';
import EmptyTabContent from './EmptyTabContent';
import TabContentModal from './TabContentModal';
import TileSettingsPanel from './TileSettingsPanel';

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
  const [activeTab, setActiveTab] = useState(1);
  const [showTabContentModal, setShowTabContentModal] = useState(false);
  const [selectedTabForContent, setSelectedTabForContent] = useState<number>(1);

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

  const handleTabClick = (tabNumber: number, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setActiveTab(tabNumber);
  };

  const handleAddTabContent = (tabNumber: number, e?: React.MouseEvent) => {
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    setSelectedTabForContent(tabNumber);
    setShowTabContentModal(true);
  };

  const handleSelectTabContent = (template: any) => {
    const newTabContent: TabContent = {
      id: `tab-content-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      title: template.title,
      description: template.description,
      value: template.preview.value,
      change: template.preview.change,
      changeType: template.preview.changeType,
      chart: template.type === 'chart' ? [45, 52, 48, 61, 58, 67, 73, 69] : undefined,
      type: template.type,
      color: template.color,
      category: template.category,
      lastUpdated: new Date().toLocaleString()
    };

    const updatedTile: TileData = {
      ...tile,
      tabs: {
        ...tile.tabs,
        [`tab${selectedTabForContent}`]: newTabContent
      }
    };

    onTileUpdate(updatedTile);
    setShowTabContentModal(false);
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

  const renderContentForType = (content: TabContent | TileData, isTabContent = false) => {
    switch (content.type) {
      case 'chart':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className={`${isTabContent ? 'text-sm sm:text-base lg:text-lg' : 'text-base sm:text-lg lg:text-xl xl:text-2xl 2xl:text-3xl'} font-bold font-spotify text-center truncate drop-shadow-lg ${getTextColorClass()}`}>
              {content.value}
            </div>
            {content.chart && renderSparkline(content.chart)}
          </div>
        );
      
      case 'metric':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className={`${isTabContent ? 'text-sm sm:text-base lg:text-lg' : 'text-lg sm:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl'} font-bold font-spotify text-center truncate drop-shadow-lg ${getTextColorClass()}`}>
              {content.value}
            </div>
            {content.change !== undefined && (
              <div className={`flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm lg:text-base font-spotify ${
                content.changeType === 'increase' ? 'text-spotify-green' : 'text-red-400'
              }`}>
                {content.changeType === 'increase' ? (
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                ) : (
                  <TrendingDown className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                )}
                <span className="truncate drop-shadow-lg">{Math.abs(content.change)}% from last period</span>
              </div>
            )}
          </div>
        );
      
      case 'api':
        return (
          <div className="h-full flex flex-col justify-center space-y-2 sm:space-y-3 lg:space-y-4 px-2 sm:px-3">
            <div className={`${isTabContent ? 'text-sm sm:text-base lg:text-lg' : 'text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl'} font-bold font-spotify text-center truncate drop-shadow-lg ${getTextColorClass()}`}>
              {content.value}
            </div>
            <div className={`flex items-center justify-center space-x-1 sm:space-x-2 text-xs sm:text-sm ${getDescriptionColorClass()}`}>
              <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-spotify-green rounded-full animate-pulse flex-shrink-0"></div>
              <span className="font-spotify truncate drop-shadow-lg">Live API Data</span>
            </div>
          </div>
        );
      
      default:
        return (
          <div className={`h-full flex items-center justify-center text-sm sm:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-bold font-spotify px-2 text-center drop-shadow-lg ${getTextColorClass()}`}>
            {content.value}
          </div>
        );
    }
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
              <div className={`text-sm sm:text-base lg:text-lg xl:text-xl font-bold font-spotify truncate drop-shadow-lg ${getTextColorClass()}`}>Ask AI</div>
              <div className="text-xs sm:text-sm text-spotify-green font-spotify truncate drop-shadow-lg">Sports Intelligence</div>
            </div>
          </div>
          <div className={`flex items-center space-x-2 text-xs sm:text-sm ${getDescriptionColorClass()}`}>
            <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-spotify-green animate-pulse flex-shrink-0" />
            <span className="font-spotify truncate drop-shadow-lg">Click to open AI assistant</span>
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

    // Check for tab content
    const currentTabContent = tile.tabs?.[`tab${activeTab}` as keyof typeof tile.tabs];
    
    if (activeTab <= 3) {
      if (currentTabContent) {
        // Show tab content
        return renderContentForType(currentTabContent, true);
      } else {
        // Show empty tab state
        return (
          <EmptyTabContent 
            tabNumber={activeTab} 
            onAddContent={() => handleAddTabContent(activeTab)} 
          />
        );
      }
    } else if (activeTab === 4) {
      // Settings tab
      return (
        <TileSettingsPanel 
          tile={tile} 
          onUpdateTile={onTileUpdate}
        />
      );
    }

    // Default content (fallback to main tile content)
    return renderContentForType(tile);
  };

  // Apply custom settings
  const getBackgroundClass = () => {
    if (tile.settings?.backgroundColor) {
      return tile.settings.backgroundColor;
    }
    return 'bg-spotify-dark-gray';
  };

  const getTextColorClass = () => {
    return tile.settings?.textColor || 'text-spotify-white';
  };

  const getDescriptionColorClass = () => {
    // If custom text color is set, use a slightly muted version
    if (tile.settings?.textColor) {
      return tile.settings.textColor.replace('400', '300'); // Make description slightly lighter
    }
    return 'text-spotify-text-gray';
  };

  // Special styling for AI tiles
  const isAITile = tile.id === 'ai-insights' || tile.id === 'smart-suggestions';
  
  const tileClasses = `
    group relative w-full h-full rounded-xl overflow-hidden
    transition-all duration-300
    ${getBackgroundClass()}
    border border-spotify-light-gray/20
    ${isAITile ? 'cursor-pointer' : ''}
    ${isHovered ? 'scale-[1.02] shadow-2xl shadow-spotify-green/20' : ''}
    ${isDeleting ? 'opacity-0 scale-95' : ''}
    hover:border-spotify-green/30
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
          className={`absolute bottom-8 left-3 p-2 rounded-full transition-all duration-300 z-20 opacity-0 group-hover:opacity-100 ${
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
          <h3 className={`font-bold text-sm leading-tight mb-1 font-spotify truncate drop-shadow-lg ${getTextColorClass()}`}>
            {tile.title}
          </h3>
          <p className={`text-xs line-clamp-2 font-spotify drop-shadow-lg ${getDescriptionColorClass()}`}>
            {tile.description}
          </p>
        </div>

        {/* CONTENT - Adjusted for smaller tabs */}
        <div className="pt-16 pb-6 px-4 relative z-10" style={{ height: 'calc(100% - 24px)' }}>
          {renderTileContent()}
        </div>

        {/* MODERN SLEEK TABS - 6% of tile height (24px) */}
        <div className="absolute bottom-0 left-0 right-0 h-6 bg-spotify-medium-gray/60 backdrop-blur-sm border-t border-spotify-light-gray/20 z-10">
          <div className="flex h-full">
            
            {/* TAB 1 - 30% width */}
            <button
              onClick={(e) => handleTabClick(1, e)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex-1 flex items-center justify-center text-xs font-medium transition-all duration-200 relative ${
                activeTab === 1 
                  ? 'bg-spotify-green text-spotify-black shadow-lg shadow-spotify-green/20' 
                  : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-light-gray/50'
              }`}
              style={{ width: '30%' }}
              title={tile.tabs?.tab1 ? `Tab 1: ${tile.tabs.tab1.title}` : 'Tab 1 (Empty - Click to add content)'}
            >
              {tile.tabs?.tab1 ? '●' : '○'}
              {activeTab === 1 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-spotify-green" />
              )}
            </button>

            {/* TAB 2 - 30% width */}
            <button
              onClick={(e) => handleTabClick(2, e)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex-1 flex items-center justify-center text-xs font-medium transition-all duration-200 relative ${
                activeTab === 2 
                  ? 'bg-spotify-green text-spotify-black shadow-lg shadow-spotify-green/20' 
                  : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-light-gray/50'
              }`}
              style={{ width: '30%' }}
              title={tile.tabs?.tab2 ? `Tab 2: ${tile.tabs.tab2.title}` : 'Tab 2 (Empty - Click to add content)'}
            >
              {tile.tabs?.tab2 ? '●' : '○'}
              {activeTab === 2 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-spotify-green" />
              )}
            </button>

            {/* TAB 3 - 30% width */}
            <button
              onClick={(e) => handleTabClick(3, e)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex-1 flex items-center justify-center text-xs font-medium transition-all duration-200 relative ${
                activeTab === 3 
                  ? 'bg-spotify-green text-spotify-black shadow-lg shadow-spotify-green/20' 
                  : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-light-gray/50'
              }`}
              style={{ width: '30%' }}
              title={tile.tabs?.tab3 ? `Tab 3: ${tile.tabs.tab3.title}` : 'Tab 3 (Empty - Click to add content)'}
            >
              {tile.tabs?.tab3 ? '●' : '○'}
              {activeTab === 3 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-spotify-green" />
              )}
            </button>

            {/* SEPARATOR */}
            <div className="w-px bg-spotify-light-gray/30 my-1" />

            {/* TAB 4 (Settings) - 10% width */}
            <button
              onClick={(e) => handleTabClick(4, e)}
              onMouseDown={(e) => e.stopPropagation()}
              className={`flex items-center justify-center text-xs font-medium transition-all duration-200 relative ${
                activeTab === 4 
                  ? 'bg-spotify-green text-spotify-black shadow-lg shadow-spotify-green/20' 
                  : 'text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-light-gray/50'
              }`}
              style={{ width: '10%' }}
              title="Tile Settings"
            >
              <Settings className="w-3 h-3" />
              {activeTab === 4 && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-spotify-green" />
              )}
            </button>
          </div>
        </div>

        {/* TIMESTAMP - Above tabs (only show when not in settings tab) */}
        {tile.id !== 'smart-suggestions' && activeTab !== 4 && (
          <div className={`absolute bottom-8 left-16 right-16 flex items-center justify-center space-x-1 text-xs font-spotify z-10 ${getDescriptionColorClass()}`}>
            <Clock className="w-3 h-3 flex-shrink-0" />
            <span className="truncate drop-shadow-lg">{tile.lastUpdated}</span>
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

        {/* Custom Settings Visual Indicator - Small dot */}
        {(tile.settings?.backgroundColor && tile.settings.backgroundColor !== 'bg-spotify-dark-gray') || 
         tile.settings?.textColor ? (
          <div className="absolute top-3 left-3 w-2 h-2 bg-spotify-green rounded-full opacity-60 pointer-events-none z-20" title="Custom styling applied" />
        ) : null}
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

      {/* Tab Content Modal - Now uses React Portal and proper z-index */}
      <TabContentModal
        isOpen={showTabContentModal}
        onClose={() => setShowTabContentModal(false)}
        onSelectContent={handleSelectTabContent}
        tabNumber={selectedTabForContent}
        tileName={tile.title}
      />
    </>
  );
});

DashboardTile.displayName = 'DashboardTile';

export default DashboardTile;