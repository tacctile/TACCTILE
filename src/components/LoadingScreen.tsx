import React from 'react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center font-spotify">
      <div className="text-center">
        <div className="relative">
          {/* Logo animation */}
          <div className="w-24 h-24 mx-auto mb-8 relative">
            <div className="absolute inset-0 rounded-xl bg-spotify-green animate-pulse"></div>
            <div className="absolute inset-2 rounded-lg bg-spotify-black flex items-center justify-center">
              <span className="text-2xl font-bold text-spotify-white">T</span>
            </div>
          </div>
          
          {/* Loading bars */}
          <div className="flex space-x-2 justify-center mb-8">
            {[...Array(5)].map((_, i) => (
              <div
                key={i}
                className="w-2 h-8 bg-spotify-green rounded-full animate-pulse"
                style={{
                  animationDelay: `${i * 0.2}s`,
                  animationDuration: '1.4s'
                }}
              ></div>
            ))}
          </div>
          
          {/* App name */}
          <h1 className="text-4xl font-bold text-spotify-white mb-4">
            TAC<span className="text-spotify-green">CTILE</span>
          </h1>
          
          {/* Loading text */}
          <p className="text-spotify-text-gray text-lg animate-pulse">
            Initializing your dashboard...
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoadingScreen;