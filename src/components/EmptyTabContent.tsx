import React from 'react';
import { Plus, Layers } from 'lucide-react';

interface EmptyTabContentProps {
  tabNumber: number;
  onAddContent: () => void;
}

const EmptyTabContent: React.FC<EmptyTabContentProps> = ({ tabNumber, onAddContent }) => {
  return (
    <div className="h-full flex items-center justify-center px-2">
      <button
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          onAddContent();
        }}
        onMouseDown={(e) => e.stopPropagation()}
        className="w-full h-full bg-spotify-dark-gray/20 border border-dashed border-spotify-light-gray/30 rounded-lg hover:border-spotify-green/50 hover:bg-spotify-green/5 transition-all duration-300 group flex items-center justify-center min-h-[120px]"
      >
        {/* Content */}
        <div className="flex flex-col items-center space-y-2">
          <div className="w-8 h-8 rounded-full bg-spotify-light-gray/20 group-hover:bg-spotify-green/20 border border-dashed border-spotify-light-gray/30 group-hover:border-spotify-green/50 flex items-center justify-center transition-all duration-300">
            <Plus className="w-4 h-4 text-spotify-text-gray group-hover:text-spotify-green transition-colors duration-300" />
          </div>
          
          {/* Label */}
          <div className="text-center">
            <p className="text-xs font-medium text-spotify-text-gray group-hover:text-spotify-white transition-colors duration-300 font-spotify">
              Add Content
            </p>
            <p className="text-xs text-spotify-text-gray/70 group-hover:text-spotify-text-gray transition-colors duration-300 font-spotify">
              Tab {tabNumber}
            </p>
          </div>
        </div>

        {/* Hover Effects */}
        <div className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
          <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-spotify-green/5 via-transparent to-spotify-green/10" />
        </div>

        {/* Mini sparkles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
          <div className="absolute top-2 left-2 w-1 h-1 bg-spotify-green rounded-full animate-ping" style={{ animationDelay: '0s' }} />
          <div className="absolute top-3 right-3 w-0.5 h-0.5 bg-spotify-green/70 rounded-full animate-ping" style={{ animationDelay: '0.3s' }} />
          <div className="absolute bottom-2 left-3 w-0.5 h-0.5 bg-spotify-green/50 rounded-full animate-ping" style={{ animationDelay: '0.6s' }} />
        </div>
      </button>
    </div>
  );
};

export default EmptyTabContent;