import React, { useState, useEffect } from 'react';
import { X, Wifi, Loader2, Play, Square, RefreshCw, Cast, CheckCircle, AlertCircle, Info } from 'lucide-react';
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
  const [castSuccess, setCastSuccess] = useState<string | null>(null);
  const [castError, setCastError] = useState<string | null>(null);
  const [castInfo, setCastInfo] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    // Start device discovery when modal opens
    handleScanDevices();

    // Subscribe to device changes
    const unsubscribeDevices = castingService.onDevicesChanged(setDevices);
    const unsubscribeSession = castingService.onSessionChanged(setCurrentSession);

    return () => {
      unsubscribeDevices();
      unsubscribeSession();
    };
  }, [isOpen]);

  const handleScanDevices = async () => {
    setIsScanning(true);
    setCastError(null);
    setCastInfo(null);
    try {
      const foundDevices = await castingService.startDeviceDiscovery();
      setDevices(foundDevices);
    } catch (error) {
      setCastError('Failed to scan for devices');
    } finally {
      setIsScanning(false);
    }
  };

  const handleCastToDevice = async (deviceId: string) => {
    setCastingToDevice(deviceId);
    setCastError(null);
    setCastSuccess(null);
    setCastInfo(null);
    
    try {
      const device = devices.find(d => d.id === deviceId);
      const deviceName = device?.name || 'device';
      
      const result = await castingService.castToDevice(deviceId, {
        url: `${window.location.origin}/cast-display.html`,
        dashboard: dashboardContent,
        dashboardContent: dashboardContent, // Alternative key for compatibility
        timestamp: Date.now(),
        tiles: dashboardContent.tiles || []
      });

      if (result === true) {
        setCastSuccess(`Successfully casting to ${deviceName}! Your dashboard should appear on the TV shortly.`);
        
        // Auto-close success message after 5 seconds
        setTimeout(() => setCastSuccess(null), 5000);
      } else {
        // Handle specific error messages
        if (result === 'Casting cancelled by user' || result === 'Presentation cancelled by user') {
          setCastInfo(result);
          // Auto-close info message after 3 seconds
          setTimeout(() => setCastInfo(null), 3000);
        } else {
          setCastError(result);
        }
      }
    } catch (error) {
      setCastError('Casting failed. Please check your connection and try again.');
    } finally {
      setCastingToDevice(null);
    }
  };

  const handleStopCasting = () => {
    castingService.stopCasting();
    setCastSuccess(null);
    setCastError(null);
    setCastInfo(null);
  };

  const getDeviceIcon = (device: CastDevice) => {
    switch (device.type) {
      case 'chromecast':
        return '📺';
      case 'airplay':
        return '📱';
      case 'presentation':
        return '🖥️';
      case 'remote-playback':
        return '📻';
      case 'dlna':
        return '📺';
      case 'miracast':
        return '💻';
      default:
        return '📡';
    }
  };

  const getDeviceTypeName = (type: string) => {
    switch (type) {
      case 'chromecast':
        return 'Chromecast';
      case 'airplay':
        return 'AirPlay';
      case 'presentation':
        return 'Wireless Display';
      case 'remote-playback':
        return 'Media Device';
      case 'dlna':
        return 'DLNA/UPnP';
      case 'miracast':
        return 'Miracast';
      default:
        return 'Unknown Device';
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl max-h-[80vh] bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20 bg-spotify-green/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-spotify-green rounded-xl flex items-center justify-center">
              <Cast className="w-6 h-6 text-spotify-black" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-spotify-white font-spotify">Cast Dashboard</h2>
              <p className="text-spotify-text-gray text-sm font-spotify">
                {currentSession ? 'Now casting to your TV' : 'Choose a device to cast to'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success/Error/Info Messages */}
        {castSuccess && (
          <div className="p-4 border-b border-spotify-light-gray/20 bg-spotify-green/10">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-5 h-5 text-spotify-green flex-shrink-0" />
              <p className="text-spotify-green font-spotify text-sm">{castSuccess}</p>
            </div>
          </div>
        )}

        {castError && (
          <div className="p-4 border-b border-spotify-light-gray/20 bg-red-500/10">
            <div className="flex items-center space-x-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-400 font-spotify text-sm">{castError}</p>
            </div>
          </div>
        )}

        {castInfo && (
          <div className="p-4 border-b border-spotify-light-gray/20 bg-blue-500/10">
            <div className="flex items-center space-x-3">
              <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />
              <p className="text-blue-400 font-spotify text-sm">{castInfo}</p>
            </div>
          </div>
        )}

        {/* Current Session Info */}
        {currentSession && (
          <div className="p-4 border-b border-spotify-light-gray/20 bg-spotify-green/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-spotify-green rounded-lg flex items-center justify-center">
                  <span className="text-lg">{getDeviceIcon(currentSession.device)}</span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-spotify-white font-spotify">
                    Casting to {currentSession.device.name}
                  </h3>
                  <p className="text-xs text-spotify-green font-spotify">
                    Connected • {getDeviceTypeName(currentSession.device.type)}
                  </p>
                </div>
              </div>
              <button
                onClick={handleStopCasting}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-all font-spotify"
              >
                <Square className="w-4 h-4" />
                <span>Stop Casting</span>
              </button>
            </div>
          </div>
        )}

        {/* Device List */}
        <div className="p-6 max-h-[50vh] overflow-y-auto">
          
          {/* Scan Button */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-spotify-white font-spotify">Available Devices</h3>
            <button
              onClick={handleScanDevices}
              disabled={isScanning}
              className="flex items-center space-x-2 px-4 py-2 bg-spotify-medium-gray hover:bg-spotify-light-gray text-spotify-text-gray hover:text-spotify-white font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed font-spotify"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Scanning...' : 'Refresh'}</span>
            </button>
          </div>

          {/* Device Grid */}
          <div className="space-y-3">
            {devices.map((device) => (
              <div
                key={device.id}
                className={`p-4 rounded-xl border transition-all cursor-pointer ${
                  device.status === 'connected'
                    ? 'bg-spotify-green/20 border-spotify-green/40'
                    : device.status === 'connecting'
                    ? 'bg-orange-500/20 border-orange-500/40'
                    : 'bg-spotify-medium-gray border-spotify-light-gray/20 hover:border-spotify-green/40 hover:bg-spotify-light-gray/50'
                }`}
                onClick={() => device.status === 'available' && handleCastToDevice(device.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getDeviceIcon(device)}</div>
                    <div className="flex-1">
                      <h4 className="text-sm font-semibold text-spotify-white font-spotify">
                        {device.name}
                      </h4>
                      <p className="text-xs text-spotify-text-gray font-spotify">
                        {getDeviceTypeName(device.type)} • {device.capabilities.join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      {device.status === 'connecting' || castingToDevice === device.id ? (
                        <Loader2 className="w-4 h-4 text-orange-400 animate-spin" />
                      ) : device.status === 'connected' ? (
                        <div className="w-2 h-2 bg-spotify-green rounded-full animate-pulse" />
                      ) : (
                        <Wifi className="w-4 h-4 text-spotify-text-gray" />
                      )}
                      <span className={`text-xs font-medium font-spotify ${
                        device.status === 'connected' ? 'text-spotify-green' :
                        device.status === 'connecting' ? 'text-orange-400' :
                        'text-spotify-text-gray'
                      }`}>
                        {device.status === 'connecting' || castingToDevice === device.id ? 'Connecting...' :
                         device.status === 'connected' ? 'Connected' :
                         'Available'}
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
                        className="flex items-center space-x-1 px-3 py-1 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs"
                      >
                        {castingToDevice === device.id ? (
                          <Loader2 className="w-3 h-3 animate-spin" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                        <span>Cast</span>
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
                <Cast className="w-8 h-8 text-spotify-text-gray" />
              </div>
              <h3 className="text-lg font-semibold text-spotify-white mb-2 font-spotify">No devices found</h3>
              <p className="text-spotify-text-gray font-spotify mb-4">
                Make sure your casting devices are on the same network and try scanning again.
              </p>
              <button
                onClick={handleScanDevices}
                className="px-6 py-2 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all font-spotify"
              >
                Scan for Devices
              </button>
            </div>
          )}

          {/* Scanning State */}
          {isScanning && devices.length === 0 && (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-spotify-green/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Loader2 className="w-8 h-8 text-spotify-green animate-spin" />
              </div>
              <h3 className="text-lg font-semibold text-spotify-white mb-2 font-spotify">Scanning for devices...</h3>
              <p className="text-spotify-text-gray font-spotify">
                Looking for Chromecast, AirPlay, and other casting devices
              </p>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="p-6 border-t border-spotify-light-gray/20 bg-spotify-medium-gray/30">
          <div className="text-center">
            <h4 className="text-sm font-semibold text-spotify-white mb-2 font-spotify">
              📺 How to Cast Successfully
            </h4>
            <p className="text-xs text-spotify-text-gray font-spotify mb-3">
              Make sure your device and casting target are on the same WiFi network. 
              For Chromecast, your dashboard will appear on your TV within a few seconds.
            </p>
            <div className="flex items-center justify-center space-x-4 text-xs text-spotify-text-gray/70">
              <span>📺 Chromecast</span>
              <span>📱 AirPlay</span>
              <span>🖥️ Wireless Display</span>
              <span>📡 DLNA</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CastingModal;