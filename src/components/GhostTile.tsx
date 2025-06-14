import React from 'react';
import { Plus } from 'lucide-react';

interface GhostTileProps {
  onAddTile: () => void;
}

const GhostTile: React.FC<GhostTileProps> = ({ onAddTile }) => {
  return (
    <div className="w-full h-80 relative">
      <button
        onClick={onAddTile}
        className="w-full h-full bg-spotify-dark-gray/30 border-2 border-dashed border-spotify-light-gray/40 rounded-xl hover:border-spotify-green/60 hover:bg-spotify-green/5 transition-all duration-300 group flex items-center justify-center"
      >
        {/* Plus Icon */}
        <div className="flex flex-col items-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-spotify-light-gray/20 group-hover:bg-spotify-green/20 border-2 border-dashed border-spotify-light-gray/40 group-hover:border-spotify-green/60 flex items-center justify-center transition-all duration-300">
            <Plus className="w-8 h-8 text-spotify-text-gray group-hover:text-spotify-green transition-colors duration-300" />
          </div>
          
          {/* Label */}
          <div className="text-center">
            <p className="text-sm font-medium text-spotify-text-gray group-hover:text-spotify-white transition-colors duration-300 font-spotify">
              Add New Tile
            </p>
            <p className="text-xs text-spotify-text-gray/70 group-hover:text-spotify-text-gray transition-colors duration-300 font-spotify mt-1">
              Click to customize
            </p>
          </div>
        </div>

        {/* Hover Glow Effect */}
        <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-spotify-green/10 via-transparent to-spotify-green/5" />
          <div className="absolute inset-0 rounded-xl shadow-lg shadow-spotify-green/10" />
        </div>

        {/* Animated Sparkles on Hover */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-4 left-4 w-2 h-2 bg-spotify-green rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-8 right-6 w-1.5 h-1.5 bg-spotify-green/70 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
          <div className="absolute bottom-6 left-8 w-1 h-1 bg-spotify-green/50 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
          <div className="absolute bottom-4 right-4 w-1.5 h-1.5 bg-spotify-green/80 rounded-full animate-ping" style={{ animationDelay: '1.5s' }} />
        </div>
      </button>
    </div>
  );
};

export default GhostTile;