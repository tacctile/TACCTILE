import React, { useState } from 'react';
import { Settings, Save, RotateCcw, Type, Palette } from 'lucide-react';
import { TileData, TileSettings, tileColors, textColors } from '../types/dashboard';

interface TileSettingsPanelProps {
  tile: TileData;
  onUpdateTile: (updatedTile: TileData) => void;
}

const TileSettingsPanel: React.FC<TileSettingsPanelProps> = ({ tile, onUpdateTile }) => {
  const [localSettings, setLocalSettings] = useState<TileSettings>(tile.settings || {});
  const [localTitle, setLocalTitle] = useState(tile.title);
  const [hasChanges, setHasChanges] = useState(false);

  const handleColorChange = (colorValue: string) => {
    const updatedSettings = { ...localSettings, backgroundColor: colorValue };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleTextColorChange = (textColorValue: string) => {
    const updatedSettings = { ...localSettings, textColor: textColorValue };
    setLocalSettings(updatedSettings);
    setHasChanges(true);
  };

  const handleTitleChange = (newTitle: string) => {
    setLocalTitle(newTitle);
    setHasChanges(true);
  };

  const handleSaveChanges = () => {
    const updatedTile: TileData = {
      ...tile,
      title: localTitle,
      settings: localSettings,
      lastUpdated: new Date().toLocaleString()
    };
    onUpdateTile(updatedTile);
    setHasChanges(false);
  };

  const handleResetChanges = () => {
    setLocalSettings(tile.settings || {});
    setLocalTitle(tile.title);
    setHasChanges(false);
  };

  const handleResetToDefaults = () => {
    setLocalSettings({});
    setLocalTitle(tile.title);
    setHasChanges(true);
  };

  // Prevent drag events on all settings controls
  const preventDragEvents = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      className="h-full flex flex-col justify-start px-2 py-3 space-y-4 overflow-y-auto"
      onMouseDown={preventDragEvents}
      onTouchStart={preventDragEvents}
    >
      
      {/* Header */}
      <div className="text-center">
        <div className="w-8 h-8 bg-spotify-green/20 rounded-lg flex items-center justify-center mx-auto mb-2">
          <Settings className="w-4 h-4 text-spotify-green" />
        </div>
        <h3 className="text-sm font-medium text-spotify-white mb-1 font-spotify">Tile Settings</h3>
        <p className="text-xs text-spotify-text-gray font-spotify">Customize appearance</p>
      </div>

      {/* Title Input */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-spotify-text-gray font-spotify">Title</label>
        <input
          type="text"
          value={localTitle}
          onChange={(e) => handleTitleChange(e.target.value)}
          onMouseDown={preventDragEvents}
          onTouchStart={preventDragEvents}
          className="w-full px-3 py-2 text-sm bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-1 focus:ring-spotify-green/20 transition-all font-spotify"
          placeholder="Tile title"
        />
      </div>

      {/* Background Color */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-spotify-text-gray font-spotify flex items-center">
          <Palette className="w-3 h-3 mr-1" />
          Background Color
        </label>
        <div className="grid grid-cols-3 gap-2">
          {tileColors.map((color) => (
            <button
              key={color.name}
              onClick={() => handleColorChange(color.value)}
              onMouseDown={preventDragEvents}
              onTouchStart={preventDragEvents}
              className={`w-full h-8 rounded-lg border-2 transition-all ${color.value} ${
                localSettings.backgroundColor === color.value
                  ? 'border-spotify-green shadow-lg shadow-spotify-green/20'
                  : 'border-spotify-light-gray/30 hover:border-spotify-light-gray/50'
              }`}
              title={color.name}
            >
              <span className="sr-only">{color.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Text Color */}
      <div className="space-y-2">
        <label className="block text-xs font-medium text-spotify-text-gray font-spotify flex items-center">
          <Type className="w-3 h-3 mr-1" />
          Text Color
        </label>
        <div className="grid grid-cols-3 gap-2">
          {textColors.map((textColor) => (
            <button
              key={textColor.name}
              onClick={() => handleTextColorChange(textColor.value)}
              onMouseDown={preventDragEvents}
              onTouchStart={preventDragEvents}
              className={`w-full h-8 rounded-lg border-2 transition-all ${
                localSettings.textColor === textColor.value
                  ? 'border-spotify-green shadow-lg shadow-spotify-green/20'
                  : 'border-spotify-light-gray/30 hover:border-spotify-light-gray/50'
              }`}
              style={{ backgroundColor: textColor.color }}
              title={textColor.name}
            >
              <span className="sr-only">{textColor.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2 pt-2 border-t border-spotify-light-gray/20">
        {hasChanges && (
          <div className="flex space-x-2">
            <button
              onClick={handleSaveChanges}
              onMouseDown={preventDragEvents}
              onTouchStart={preventDragEvents}
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all text-sm"
            >
              <Save className="w-3 h-3" />
              <span>Save</span>
            </button>
            <button
              onClick={handleResetChanges}
              onMouseDown={preventDragEvents}
              onTouchStart={preventDragEvents}
              className="flex-1 flex items-center justify-center space-x-1 py-2 px-3 bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white font-medium rounded-lg transition-all text-sm"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>
        )}
        
        <button
          onClick={handleResetToDefaults}
          onMouseDown={preventDragEvents}
          onTouchStart={preventDragEvents}
          className="w-full flex items-center justify-center space-x-1 py-2 px-3 bg-spotify-dark-gray/50 hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white font-medium rounded-lg transition-all text-sm border border-spotify-light-gray/20"
        >
          <RotateCcw className="w-3 h-3" />
          <span>Reset to Defaults</span>
        </button>
      </div>

      {/* Status */}
      <div className="text-center pt-1">
        <p className="text-xs text-spotify-text-gray/70 font-spotify">
          {hasChanges ? '🔄 Unsaved changes' : '✅ All changes saved'}
        </p>
      </div>
    </div>
  );
};

export default TileSettingsPanel;