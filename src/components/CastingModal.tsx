import React, { useState, useEffect } from 'react';
import { X, Tv, Loader2, CheckCircle, AlertCircle, Monitor, Smartphone, RefreshCw, Settings, ExternalLink, Copy } from 'lucide-react';
import { castingService, CastDevice, CastSession } from '../services/castingService';

interface CastingModalProps {
  isOpen: boolean;
  onClose: () => void;
  dashboardContent: any;
}

const CastingModal: React.FC<CastingModalProps> = ({ isOpen, onClose, dashboardContent }) => {
  const [devices, setDevices] = useState<CastDevice[]>([]);
  const [currentSession, setCurrentSession] = useState<CastSession | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [castingToDevice, setCastingToDevice] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);
  const [showSetup, setShowSetup] = useState(false);
  const [customAppId, setCustomAppId] = useState('');

  useEffect(() => {
    if (!isOpen) return;

    setMessage(null);
    handleScanDevices();

    const unsubscribeDevices = castingService.onDevicesChanged(setDevices);
    const unsubscribeSession = castingService.onSessionChanged(setCurrentSession);

    // Load current configuration
    const config = castingService.getReceiverConfiguration();
    if (config.receiverType === 'custom') {
      setCustomAppId(config.receiverAppId);
    }

    return () => {
      unsubscribeDevices();
      unsubscribeSession();
    };
  }, [isOpen]);

  const handleScanDevices = async () => {
    setIsScanning(true);
    setMessage(null);
    
    try {
      const foundDevices = await castingService.startDeviceDiscovery();
      setDevices(foundDevices);
      console.log('Found devices:', foundDevices);
    } catch (error) {
      console.error('Device scan failed:', error);
      setMessage({ type: 'error', text: 'Failed to scan for devices' });
    } finally {
      setIsScanning(false);
    }
  };

  const handleCastToDevice = async (deviceId: string) => {
    const device = devices.find(d => d.id === deviceId);
    if (!device) return;

    setCastingToDevice(deviceId);
    setMessage(null);
    
    try {
      const contentToSend = {
        tiles: dashboardContent.tiles || [],
        timestamp: Date.now(),
        source: 'TACCTILE Dashboard'
      };

      console.log('Casting to device:', device.name);
      const result = await castingService.castToDevice(deviceId, contentToSend);

      if (result === true) {
        setMessage({ 
          type: 'success', 
          text: `✅ Successfully casting to ${device.name}! Your dashboard should appear on the screen.` 
        });
        
        // Auto-close success message
        setTimeout(() => setMessage(null), 5000);
      } else {
        if (result.includes('cancel')) {
          setMessage({ type: 'info', text: `ℹ️ ${result}` });
          setTimeout(() => setMessage(null), 3000);
        } else {
          // Check if it's a setup message
          if (result.includes('Setup Instructions')) {
            setMessage({ type: 'error', text: result });
            setShowSetup(true);
          } else {
            setMessage({ type: 'error', text: `❌ ${result}` });
          }
        }
      }
    } catch (error) {
      console.error('Casting error:', error);
      setMessage({ type: 'error', text: 'Casting failed unexpectedly' });
    } finally {
      setCastingToDevice(null);
    }
  };

  const handleStopCasting = () => {
    const success = castingService.stopCasting();
    if (success) {
      setMessage({ type: 'success', text: '✅ Casting stopped' });
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const handleSaveCustomAppId = () => {
    if (!customAppId.trim()) {
      setMessage({ type: 'error', text: 'Please enter a valid App ID' });
      return;
    }

    castingService.setCustomReceiverAppId(customAppId.trim());
    setMessage({ type: 'success', text: '✅ Custom Receiver App ID saved! Chromecast should now work.' });
    setShowSetup(false);
    
    // Refresh devices to update descriptions
    setTimeout(() => {
      handleScanDevices();
    }, 1000);
  };

  const handleCopyUrl = () => {
    const url = `${window.location.origin}/cast-display.html`;
    navigator.clipboard.writeText(url).then(() => {
      setMessage({ type: 'success', text: '✅ URL copied to clipboard!' });
      setTimeout(() => setMessage(null), 3000);
    });
  };

  const getDeviceIcon = (device: CastDevice) => {
    switch (device.type) {
      case 'chromecast':
        return <Tv className="w-5 h-5" />;
      case 'presentation':
        return <Monitor className="w-5 h-5" />;
      case 'window':
        return <Smartphone className="w-5 h-5" />;
      default:
        return <Tv className="w-5 h-5" />;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20 bg-spotify-green/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-spotify-green rounded-xl flex items-center justify-center">
              <Tv className="w-6 h-6 text-spotify-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-spotify-white font-spotify">Cast Your Dashboard</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">
                {dashboardContent.tiles?.length || 0} tiles ready to cast
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
              title="Setup Custom Receiver"
            >
              <Settings className="w-5 h-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Setup Panel */}
        {showSetup && (
          <div className="p-6 border-b border-spotify-light-gray/20 bg-spotify-green/5">
            <div className="space-y-4">
              <div className="flex items-center space-x-3 mb-4">
                <Settings className="w-5 h-5 text-spotify-green" />
                <h3 className="text-lg font-semibold text-spotify-white font-spotify">Custom Receiver Setup</h3>
              </div>
              
              <div className="bg-spotify-medium-gray rounded-lg p-4 space-y-3">
                <h4 className="font-medium text-spotify-white font-spotify">🔧 Setup Instructions:</h4>
                <ol className="text-sm text-spotify-text-gray space-y-2 list-decimal list-inside">
                  <li>Go to <a href="https://cast.google.com/publish" target="_blank" rel="noopener noreferrer" className="text-spotify-green hover:underline inline-flex items-center">
                    Google Cast Developer Console <ExternalLink className="w-3 h-3 ml-1" />
                  </a></li>
                  <li>Click "Add New Application"</li>
                  <li>Select "Custom Receiver"</li>
                  <li>Set receiver type to "Web Receiver"</li>
                  <li>Use this URL for your receiver:
                    <div className="flex items-center space-x-2 mt-2 p-2 bg-spotify-dark-gray rounded border">
                      <code className="text-spotify-green text-xs flex-1">{window.location.origin}/cast-display.html</code>
                      <button
                        onClick={handleCopyUrl}
                        className="p-1 hover:bg-spotify-light-gray rounded text-spotify-text-gray hover:text-spotify-white"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>
                  </li>
                  <li>Save and note the App ID</li>
                </ol>
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-spotify-text-gray font-spotify">
                  Enter your Custom Receiver App ID:
                </label>
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={customAppId}
                    onChange={(e) => setCustomAppId(e.target.value)}
                    placeholder="e.g., 12345678"
                    className="flex-1 px-3 py-2 bg-spotify-medium-gray border border-spotify-light-gray/30 rounded-lg text-spotify-white placeholder-spotify-text-gray focus:border-spotify-green focus:ring-2 focus:ring-spotify-green/20 transition-all font-spotify"
                  />
                  <button
                    onClick={handleSaveCustomAppId}
                    className="px-4 py-2 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all font-spotify"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="text-xs text-spotify-text-gray/70 bg-spotify-dark-gray/50 rounded p-3">
                💡 <strong>Note:</strong> The Custom Receiver enables full dashboard casting to Chromecast. 
                The "New Window\" option works immediately without any setup!
              </div>
            </div>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div className={`p-4 border-b border-spotify-light-gray/20 ${
            message.type === 'success' ? 'bg-spotify-green/10' :
            message.type === 'error' ? 'bg-red-500/10' : 'bg-blue-500/10'
          }`}>
            <div className="flex items-start space-x-3">
              {message.type === 'success' && <CheckCircle className="w-5 h-5 text-spotify-green flex-shrink-0 mt-0.5" />}
              {message.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />}
              {message.type === 'info' && <AlertCircle className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />}
              <div className={`text-sm leading-relaxed font-spotify ${
                message.type === 'success' ? 'text-spotify-green' :
                message.type === 'error' ? 'text-red-400' : 'text-blue-400'
              }`}>
                <pre className="whitespace-pre-wrap font-spotify">{message.text}</pre>
              </div>
            </div>
          </div>
        )}

        {/* Current Session */}
        {currentSession && (
          <div className="p-4 border-b border-spotify-light-gray/20 bg-spotify-green/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-spotify-green rounded-lg flex items-center justify-center">
                  {getDeviceIcon(currentSession.device)}
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-spotify-white font-spotify">
                    Casting to {currentSession.device.name}
                  </h3>
                  <p className="text-xs text-spotify-green font-spotify">✅ Connected</p>
                </div>
              </div>
              <button
                onClick={handleStopCasting}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all font-spotify text-sm"
              >
                Stop
              </button>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          
          {/* Device List Header */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-spotify-white font-spotify">Cast Destinations</h3>
            <button
              onClick={handleScanDevices}
              disabled={isScanning}
              className="flex items-center space-x-2 px-3 py-2 bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white rounded-lg transition-all disabled:opacity-50 font-spotify text-sm"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>Refresh</span>
            </button>
          </div>

          {/* Device List */}
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`p-4 rounded-xl border transition-all ${
                  device.status === 'connected'
                    ? 'bg-spotify-green/20 border-spotify-green/40'
                    : device.status === 'connecting'
                    ? 'bg-orange-500/20 border-orange-500/40'
                    : 'bg-spotify-medium-gray border-spotify-light-gray/20 hover:border-spotify-green/40 hover:bg-spotify-light-gray/50 cursor-pointer'
                }`}
                onClick={() => device.status === 'available' && handleCastToDevice(device.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      device.status === 'connected' ? 'bg-spotify-green text-spotify-black' :
                      device.status === 'connecting' ? 'bg-orange-500 text-white' :
                      'bg-spotify-light-gray text-spotify-text-gray'
                    }`}>
                      {getDeviceIcon(device)}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-spotify-white font-spotify">
                        {device.name}
                      </h4>
                      <p className="text-xs text-spotify-text-gray font-spotify">
                        {device.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status Indicator */}
                    <div className="flex items-center space-x-2">
                      {device.status === 'connecting' || castingToDevice === device.id ? (
                        <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                      ) : device.status === 'connected' ? (
                        <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" />
                      ) : (
                        <div className="w-2 h-2 bg-spotify-text-gray rounded-full" />
                      )}
                      <span className={`text-xs font-medium font-spotify ${
                        device.status === 'connected' ? 'text-spotify-green' :
                        device.status === 'connecting' || castingToDevice === device.id ? 'text-orange-400' :
                        'text-spotify-text-gray'
                      }`}>
                        {device.status === 'connecting' || castingToDevice === device.id ? 'Connecting...' :
                         device.status === 'connected' ? 'Connected' : 'Available'}
                      </span>
                    </div>

                    {/* Cast Button */}
                    {device.status === 'available' && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCastToDevice(device.id);
                        }}
                        disabled={castingToDevice === device.id}
                        className="px-4 py-2 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all disabled:opacity-50 text-xs"
                      >
                        {castingToDevice === device.id ? 'Casting...' : 'Cast'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {!isScanning && devices.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-spotify-medium-gray rounded-full flex items-center justify-center mx-auto mb-4">
                <Tv className="w-8 h-8 text-spotify-text-gray" />
              </div>
              <h3 className="text-lg font-semibold text-spotify-white mb-2 font-spotify">No devices found</h3>
              <p className="text-spotify-text-gray font-spotify mb-4">
                Try the "New Window" option - it works on any setup!
              </p>
              <button
                onClick={handleScanDevices}
                className="px-6 py-2 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all font-spotify"
              >
                Scan Again
              </button>
            </div>
          )}

          {/* Scanning State */}
          {isScanning && (
            <div className="text-center py-8">
              <Loader2 className="w-12 h-12 text-spotify-green animate-spin mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-spotify-white mb-2 font-spotify">Scanning...</h3>
              <p className="text-spotify-text-gray font-spotify">Looking for available devices</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20 bg-spotify-medium-gray/30">
          <div className="text-center">
            <p className="text-sm text-spotify-text-gray font-spotify mb-2">
              💡 <strong>Quick Start:</strong> Use "New Window" for immediate casting - just drag to your TV!
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-spotify-text-gray/70">
              <span>📺 Custom Receiver</span>
              <span>🖥️ Wireless Display</span>
              <span>🪟 New Window</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastingModal;