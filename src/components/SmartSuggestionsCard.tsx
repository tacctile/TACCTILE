import React, { useState, useEffect } from 'react';
import { RefreshCw, ChevronDown, ChevronUp, TrendingUp, Target, DollarSign, BarChart3, Sparkles } from 'lucide-react';
import { generateAISuggestions, AISuggestion } from '../services/aiService';

interface SmartSuggestionsCardProps {
  onRefresh?: () => void;
}

const SmartSuggestionsCard: React.FC<SmartSuggestionsCardProps> = ({ onRefresh }) => {
  const [suggestions, setSuggestions] = useState<AISuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isSparkleAnimating, setIsSparkleAnimating] = useState(false);

  const loadSuggestions = async () => {
    setIsLoading(true);
    setIsSparkleAnimating(true);
    
    try {
      const newSuggestions = await generateAISuggestions();
      setSuggestions(newSuggestions);
      
      // Stop sparkle animation after suggestions load
      setTimeout(() => setIsSparkleAnimating(false), 2000);
    } catch (error) {
      console.error('Failed to load suggestions:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSuggestions();
  }, []);

  const handleRefresh = () => {
    loadSuggestions();
    onRefresh?.();
  };

  const toggleExpanded = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'fantasy':
        return <Target className="w-4 h-4" />;
      case 'betting':
        return <DollarSign className="w-4 h-4" />;
      case 'analysis':
        return <BarChart3 className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'fantasy':
        return 'bg-spotify-green';
      case 'betting':
        return 'bg-orange-500';
      case 'analysis':
        return 'bg-blue-500';
      default:
        return 'bg-spotify-green';
    }
  };

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-spotify-green';
    if (confidence >= 75) return 'text-yellow-400';
    return 'text-orange-400';
  };

  return (
    <div className="h-full flex flex-col font-spotify">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <div className="relative">
            <Sparkles className={`w-5 h-5 text-spotify-green ${isSparkleAnimating ? 'animate-pulse' : ''}`} />
            {isSparkleAnimating && (
              <div className="absolute inset-0 animate-ping">
                <Sparkles className="w-5 h-5 text-spotify-green opacity-75" />
              </div>
            )}
          </div>
          <h3 className="text-lg font-semibold text-spotify-white">Smart Suggestions</h3>
        </div>
        <button
          onClick={handleRefresh}
          disabled={isLoading}
          className="p-2 rounded-lg bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div className="flex-1 space-y-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-lg p-4 animate-pulse">
              <div className="flex items-center justify-between mb-3">
                <div className="h-4 bg-spotify-light-gray rounded w-3/4"></div>
                <div className="h-6 bg-spotify-light-gray rounded w-16"></div>
              </div>
              <div className="h-3 bg-spotify-light-gray rounded w-full mb-2"></div>
              <div className="h-3 bg-spotify-light-gray rounded w-2/3"></div>
            </div>
          ))}
        </div>
      )}

      {/* Suggestions List */}
      {!isLoading && (
        <div className="flex-1 space-y-3 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <div
              key={suggestion.id}
              className={`bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-lg p-4 transition-all duration-300 ${
                isSparkleAnimating ? 'animate-pulse' : ''
              } ${expandedId === suggestion.id ? 'bg-spotify-light-gray' : 'hover:bg-spotify-light-gray/50'}`}
            >
              
              {/* Suggestion Header */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(suggestion.category)} text-spotify-black`}>
                      {suggestion.tag}
                    </span>
                    <div className={`flex items-center space-x-1 text-sm ${getConfidenceColor(suggestion.confidence)}`}>
                      <TrendingUp className="w-3 h-3" />
                      <span>{suggestion.confidence}%</span>
                    </div>
                  </div>
                  <h4 className="text-spotify-white font-medium mb-1">{suggestion.title}</h4>
                  <p className="text-spotify-text-gray text-sm">{suggestion.description}</p>
                </div>
              </div>

              {/* Expand Button */}
              <button
                onClick={() => toggleExpanded(suggestion.id)}
                className="w-full flex items-center justify-center space-x-2 mt-3 p-2 bg-spotify-light-gray hover:bg-spotify-light-gray/70 rounded-lg text-spotify-text-gray hover:text-spotify-white transition-all"
              >
                <span className="text-sm">
                  {expandedId === suggestion.id ? 'Show Less' : 'Show Analysis'}
                </span>
                {expandedId === suggestion.id ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </button>

              {/* Expanded Content */}
              {expandedId === suggestion.id && (
                <div className="mt-4 pt-4 border-t border-spotify-light-gray/20 animate-slide-down">
                  <div className="prose prose-invert prose-sm max-w-none">
                    <div className="text-spotify-text-gray leading-relaxed">
                      {suggestion.explanation.split('\n').map((line, lineIndex) => {
                        if (line.startsWith('**') && line.endsWith('**')) {
                          return (
                            <div key={lineIndex} className="font-bold text-spotify-white mt-3 mb-2 text-sm">
                              {line.replace(/\*\*/g, '')}
                            </div>
                          );
                        }
                        if (line.startsWith('• ')) {
                          return (
                            <div key={lineIndex} className="ml-3 mb-1 text-sm text-spotify-text-gray">
                              <span className="text-spotify-green">•</span> {line.substring(2)}
                            </div>
                          );
                        }
                        if (line.startsWith('- ')) {
                          return (
                            <div key={lineIndex} className="ml-3 mb-1 text-sm text-spotify-text-gray/70">
                              <span className="text-spotify-text-gray/50">-</span> {line.substring(2)}
                            </div>
                          );
                        }
                        return line.trim() ? (
                          <div key={lineIndex} className="mb-2 text-sm">
                            {line}
                          </div>
                        ) : (
                          <div key={lineIndex} className="h-1" />
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Timestamp */}
                  <div className="mt-3 pt-3 border-t border-spotify-light-gray/20 text-xs text-spotify-text-gray/70">
                    Generated: {new Date(suggestion.timestamp).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Sparkle Animation Overlay */}
      {isSparkleAnimating && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${1 + Math.random()}s`
              }}
            >
              <Sparkles className="w-3 h-3 text-spotify-green opacity-60" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SmartSuggestionsCard;