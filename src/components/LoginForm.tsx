import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const { login, isLoading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    const success = await login(email, password);
    if (!success) {
      setError('Invalid email or password. Password must be at least 6 characters.');
    }
  };

  return (
    <div className="min-h-screen bg-spotify-black flex items-center justify-center p-4 font-spotify">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-xl bg-spotify-green"></div>
            <div className="absolute inset-1 rounded-lg bg-spotify-black flex items-center justify-center">
              <span className="text-xl font-bold text-spotify-white">T</span>
            </div>
          </div>
          <h1 className="text-3xl font-bold text-spotify-white mb-2">
            TAC<span className="text-spotify-green">CTILE</span>
          </h1>
          <p className="text-spotify-text-gray">Sign in to your dashboard</p>
        </div>

        {/* Login Form */}
        <div className="bg-spotify-dark-gray border border-spotify-light-gray/20 rounded-2xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label className="block text-sm font-medium text-spotify-text-gray mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text-gray w-5 h-5" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-xl text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-spotify-text-gray mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-spotify-text-gray w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-xl text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-spotify-text-gray hover:text-spotify-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm text-center p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-bold rounded-full transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="w-5 h-5 border-2 border-spotify-black/30 border-t-spotify-black rounded-full animate-spin mr-2"></div>
                  Signing in...
                </div>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Demo credentials */}
          <div className="mt-6 p-4 bg-spotify-green/10 border border-spotify-green/20 rounded-lg">
            <p className="text-spotify-green text-sm text-center">
              <strong>Demo:</strong> Use any email and password (6+ chars)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;