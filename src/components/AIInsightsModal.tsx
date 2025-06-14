import React, { useState } from 'react';
import { X, Send, Brain, Sparkles, Clock, TrendingUp } from 'lucide-react';
import { generateAIInsight, AIInsight } from '../services/aiService';

interface AIInsightsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const AIInsightsModal: React.FC<AIInsightsModalProps> = ({ isOpen, onClose }) => {
  const [question, setQuestion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [insight, setInsight] = useState<AIInsight | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim()) return;

    setIsLoading(true);
    setError('');
    setInsight(null);

    try {
      const result = await generateAIInsight(question);
      setInsight(result);
    } catch (err) {
      setError('Failed to generate insight. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewQuestion = () => {
    setQuestion('');
    setInsight(null);
    setError('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl max-h-[90vh] bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20 bg-spotify-green/10">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-spotify-green rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-spotify-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-spotify-white font-spotify">AI Sports Insights</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">Ask anything about sports, fantasy, or betting</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[calc(90vh-200px)] overflow-y-auto">
          
          {/* Question Input */}
          <form onSubmit={handleSubmit} className="mb-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-spotify-text-gray mb-2 font-spotify">
                  What would you like to know?
                </label>
                <div className="relative">
                  <textarea
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="e.g., 'Top WRs this week', 'NBA injury trends', 'Best NFL props for Sunday'"
                    className="w-full px-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all resize-none font-spotify"
                    rows={3}
                    disabled={isLoading}
                  />
                  <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                    <Sparkles className="w-4 h-4 text-spotify-green animate-pulse" />
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2 text-xs text-spotify-text-gray">
                  <Brain className="w-4 h-4" />
                  <span className="font-spotify">Powered by Advanced Sports AI</span>
                </div>
                <button
                  type="submit"
                  disabled={isLoading || !question.trim()}
                  className="flex items-center space-x-2 px-6 py-3 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-spotify-black/30 border-t-spotify-black rounded-full animate-spin" />
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4" />
                      <span>Ask AI</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </form>

          {/* Error State */}
          {error && (
            <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-red-400 text-sm font-spotify">{error}</p>
            </div>
          )}

          {/* Loading Animation */}
          {isLoading && (
            <div className="mb-6 p-6 bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-lg">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center animate-pulse">
                  <Brain className="w-4 h-4 text-spotify-black" />
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-spotify-light-gray rounded w-3/4 mb-2 animate-pulse"></div>
                  <div className="h-3 bg-spotify-light-gray rounded w-1/2 animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="h-3 bg-spotify-light-gray rounded animate-pulse"></div>
                <div className="h-3 bg-spotify-light-gray rounded w-5/6 animate-pulse"></div>
                <div className="h-3 bg-spotify-light-gray rounded w-4/5 animate-pulse"></div>
              </div>
            </div>
          )}

          {/* AI Response */}
          {insight && (
            <div className="space-y-6">
              
              {/* Response Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-spotify-green rounded-full flex items-center justify-center">
                    <Brain className="w-4 h-4 text-spotify-black" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-spotify-white font-spotify">AI Analysis</h3>
                    <div className="flex items-center space-x-3 text-sm text-spotify-text-gray">
                      <div className="flex items-center space-x-1">
                        <TrendingUp className="w-3 h-3" />
                        <span className="font-spotify">Confidence: {insight.confidence}%</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span className="font-spotify">{new Date(insight.timestamp).toLocaleTimeString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <button
                  onClick={handleNewQuestion}
                  className="px-4 py-2 bg-spotify-medium-gray text-spotify-text-gray rounded-lg hover:bg-spotify-light-gray hover:text-spotify-white transition-all font-spotify"
                >
                  New Question
                </button>
              </div>

              {/* Response Content */}
              <div className="bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-lg p-6">
                <div className="prose prose-invert max-w-none">
                  <div className="whitespace-pre-wrap text-spotify-text-gray leading-relaxed font-spotify">
                    {insight.answer.split('\n').map((line, index) => {
                      if (line.startsWith('**') && line.endsWith('**')) {
                        return (
                          <div key={index} className="font-bold text-spotify-white mt-4 mb-2">
                            {line.replace(/\*\*/g, '')}
                          </div>
                        );
                      }
                      if (line.startsWith('• ')) {
                        return (
                          <div key={index} className="ml-4 mb-1 text-spotify-text-gray">
                            <span className="text-spotify-green">•</span> {line.substring(2)}
                          </div>
                        );
                      }
                      if (line.startsWith('🔴') || line.startsWith('🟡') || line.startsWith('1.') || line.startsWith('2.') || line.startsWith('3.')) {
                        return (
                          <div key={index} className="font-medium text-spotify-white mt-2">
                            {line}
                          </div>
                        );
                      }
                      return line.trim() ? (
                        <div key={index} className="mb-2">
                          {line}
                        </div>
                      ) : (
                        <div key={index} className="h-2" />
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Sources */}
              {insight.sources && insight.sources.length > 0 && (
                <div className="bg-spotify-green/10 border border-spotify-green/20 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-spotify-green mb-2 font-spotify">Sources</h4>
                  <div className="flex flex-wrap gap-2">
                    {insight.sources.map((source, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-spotify-green/20 text-spotify-green rounded text-xs font-spotify"
                      >
                        {source}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Example Questions */}
          {!insight && !isLoading && (
            <div className="mt-8">
              <h3 className="text-lg font-semibold text-spotify-white mb-4 font-spotify">Try asking about:</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  'Top fantasy WRs this week',
                  'NBA injury report analysis',
                  'Best NFL betting props',
                  'Player prop value picks',
                  'DFS lineup strategy',
                  'Trade deadline impact'
                ].map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setQuestion(example)}
                    className="p-3 bg-spotify-medium-gray border border-spotify-light-gray/20 rounded-lg text-left text-spotify-text-gray hover:text-spotify-white hover:bg-spotify-light-gray transition-all"
                  >
                    <div className="text-sm font-spotify">{example}</div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AIInsightsModal;