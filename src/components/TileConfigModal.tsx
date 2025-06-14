import React, { useState } from 'react';
import { X, Save, Palette, Tag } from 'lucide-react';
import { TileData, tileColors, dataCategories } from '../types/dashboard';

interface TileConfigModalProps {
  tile: TileData;
  isOpen: boolean;
  onClose: () => void;
  onSave: (updatedTile: TileData) => void;
}

const TileConfigModal: React.FC<TileConfigModalProps> = ({ 
  tile, 
  isOpen, 
  onClose, 
  onSave 
}) => {
  const [title, setTitle] = useState(tile.title);
  const [description, setDescription] = useState(tile.description);
  const [color, setColor] = useState(tile.color);
  const [category, setCategory] = useState(tile.category);

  const handleSave = () => {
    const updatedTile: TileData = {
      ...tile,
      title,
      description,
      color,
      category,
      lastUpdated: new Date().toLocaleString()
    };
    onSave(updatedTile);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20">
          <h2 className="text-xl font-bold text-spotify-white font-spotify">Configure Tile</h2>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Title */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all font-spotify"
              placeholder="Enter tile title"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full px-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all resize-none font-spotify"
              placeholder="Enter tile description"
            />
          </div>

          {/* Color */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray flex items-center font-spotify">
              <Palette className="w-4 h-4 mr-2" />
              Color Theme
            </label>
            <div className="grid grid-cols-3 gap-2">
              {tileColors.map((colorOption) => (
                <button
                  key={colorOption.name}
                  onClick={() => setColor(colorOption.value)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    color === colorOption.value
                      ? 'border-spotify-green'
                      : 'border-spotify-light-gray/30 hover:border-spotify-light-gray/50'
                  }`}
                >
                  <div className={`w-full h-6 rounded ${colorOption.value === 'from-purple-500 to-pink-500' ? 'bg-gradient-to-r from-purple-500 to-pink-500' : 
                    colorOption.value === 'from-blue-500 to-cyan-500' ? 'bg-gradient-to-r from-blue-500 to-cyan-500' :
                    colorOption.value === 'from-green-500 to-emerald-500' ? 'bg-gradient-to-r from-green-500 to-emerald-500' :
                    colorOption.value === 'from-orange-500 to-red-500' ? 'bg-gradient-to-r from-orange-500 to-red-500' :
                    colorOption.value === 'from-pink-500 to-rose-500' ? 'bg-gradient-to-r from-pink-500 to-rose-500' :
                    'bg-gradient-to-r from-indigo-500 to-purple-500'}`} />
                  <span className="text-xs text-spotify-text-gray mt-1 block font-spotify">{colorOption.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category */}
          <div className="space-y-3">
            <label className="block text-sm font-medium text-spotify-text-gray flex items-center font-spotify">
              <Tag className="w-4 h-4 mr-2" />
              Data Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all appearance-none font-spotify"
            >
              {dataCategories.map((cat) => (
                <option key={cat} value={cat} className="bg-spotify-medium-gray">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20 flex space-x-3">
          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 bg-spotify-medium-gray text-spotify-white font-medium rounded-full hover:bg-spotify-light-gray transition-all font-spotify"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="flex-1 flex items-center justify-center space-x-2 py-3 px-4 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-bold rounded-full transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TileConfigModal;