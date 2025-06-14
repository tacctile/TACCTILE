// Enhanced casting service with Custom Receiver App support
export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'window' | 'presentation';
  status: 'available' | 'connecting' | 'connected';
  description: string;
}

export interface CastSession {
  device: CastDevice;
  sessionId: string;
  isActive: boolean;
  startTime: number;
}

// Configuration for different receiver apps
interface CastConfig {
  receiverAppId: string;
  receiverType: 'default' | 'custom';
  customReceiverUrl?: string;
}

class CastingService {
  private devices: CastDevice[] = [];
  private currentSession: CastSession | null = null;
  private listeners: Set<(devices: CastDevice[]) => void> = new Set();
  private sessionListeners: Set<(session: CastSession | null) => void> = new Set();
  private castWindow: Window | null = null;
  private castContext: any = null;
  private isGoogleCastReady = false;
  private castConfig: CastConfig;

  constructor() {
    // Initialize with configuration
    this.castConfig = this.getCastConfiguration();
    this.initializeServices();
  }

  private getCastConfiguration(): CastConfig {
    // Check for custom receiver app ID in environment or config
    const customAppId = import.meta.env.VITE_CAST_RECEIVER_APP_ID || 
                       localStorage.getItem('tacctile_cast_app_id') ||
                       null;

    if (customAppId) {
      return {
        receiverAppId: customAppId,
        receiverType: 'custom',
        customReceiverUrl: `${window.location.origin}/cast-display.html`
      };
    }

    // Fallback to default (will show helpful error message)
    return {
      receiverAppId: 'CC1AD845', // Default media receiver
      receiverType: 'default'
    };
  }

  private async initializeServices() {
    // Always provide the reliable fallback first
    this.addWindowCastDevice();
    
    // Try to initialize Google Cast
    this.tryInitializeGoogleCast();
    
    // Add presentation API if available
    this.tryInitializePresentationAPI();
  }

  private tryInitializeGoogleCast() {
    try {
      // Check if Cast API is already loaded
      if (window.cast?.framework) {
        this.setupGoogleCast();
        return;
      }

      // Load Cast API with timeout
      const loadCastAPI = () => {
        if (window.__onGCastApiAvailable) return;

        window.__onGCastApiAvailable = (isAvailable: boolean) => {
          console.log('Google Cast API loaded:', isAvailable);
          if (isAvailable) {
            this.setupGoogleCast();
          }
        };

        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        script.async = true;
        script.onload = () => console.log('Cast script loaded');
        script.onerror = () => console.log('Cast script failed to load');
        document.head.appendChild(script);
      };

      loadCastAPI();

      // Timeout after 5 seconds
      setTimeout(() => {
        if (!this.isGoogleCastReady) {
          console.log('Google Cast API timeout - continuing without it');
        }
      }, 5000);

    } catch (error) {
      console.log('Google Cast initialization error:', error);
    }
  }

  private setupGoogleCast() {
    try {
      if (!window.cast?.framework) return;

      const context = window.cast.framework.CastContext.getInstance();
      
      // Configure with our receiver app ID
      context.setOptions({
        receiverApplicationId: this.castConfig.receiverAppId,
        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });

      this.castContext = context;
      this.isGoogleCastReady = true;

      // Add Chromecast device with config info
      this.addChromecastDevice();

      // Listen for cast state changes
      context.addEventListener(
        window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        (event: any) => this.handleCastStateChange(event)
      );

      console.log(`Google Cast setup completed with ${this.castConfig.receiverType} receiver:`, this.castConfig.receiverAppId);
    } catch (error) {
      console.log('Google Cast setup failed:', error);
      this.isGoogleCastReady = false;
    }
  }

  private handleCastStateChange(event: any) {
    const chromecastDevice = this.devices.find(d => d.type === 'chromecast');
    if (!chromecastDevice) return;

    switch (event.castState) {
      case window.cast.framework.CastState.CONNECTED:
        chromecastDevice.status = 'connected';
        console.log('Chromecast connected');
        break;
      case window.cast.framework.CastState.CONNECTING:
        chromecastDevice.status = 'connecting';
        console.log('Chromecast connecting');
        break;
      default:
        chromecastDevice.status = 'available';
        console.log('Chromecast available');
    }
    this.notifyDeviceListeners();
  }

  private tryInitializePresentationAPI() {
    if ('presentation' in navigator && 'PresentationRequest' in window) {
      this.addPresentationDevice();
      console.log('Presentation API available');
    }
  }

  private addChromecastDevice() {
    const isCustomReceiver = this.castConfig.receiverType === 'custom';
    
    const device: CastDevice = {
      id: 'chromecast',
      name: isCustomReceiver ? 'TV (Custom Receiver)' : 'TV (Basic Chromecast)',
      type: 'chromecast',
      status: 'available',
      description: isCustomReceiver 
        ? 'Cast interactive dashboard to your TV' 
        : '⚠️ Needs Custom Receiver for dashboard casting'
    };
    this.addDevice(device);
  }

  private addPresentationDevice() {
    const device: CastDevice = {
      id: 'presentation',
      name: 'Wireless Display',
      type: 'presentation',
      status: 'available',
      description: 'Cast to wireless display or smart TV'
    };
    this.addDevice(device);
  }

  private addWindowCastDevice() {
    const device: CastDevice = {
      id: 'window',
      name: 'New Window',
      type: 'window',
      status: 'available',
      description: '✅ Reliable option - drag to any screen or TV'
    };
    this.addDevice(device);
  }

  private addDevice(device: CastDevice) {
    const existingIndex = this.devices.findIndex(d => d.id === device.id);
    if (existingIndex >= 0) {
      this.devices[existingIndex] = device;
    } else {
      this.devices.push(device);
    }
    this.notifyDeviceListeners();
  }

  public async startDeviceDiscovery(): Promise<CastDevice[]> {
    console.log('Starting device discovery...');
    
    // Simulate brief scanning period
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Ensure we always have the window option
    if (!this.devices.find(d => d.id === 'window')) {
      this.addWindowCastDevice();
    }
    
    return [...this.devices];
  }

  public async castToDevice(deviceId: string, dashboardContent: any): Promise<true | string> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return 'Device not found';

    console.log(`Casting to ${device.name} with content:`, dashboardContent);

    device.status = 'connecting';
    this.notifyDeviceListeners();

    try {
      let result: true | string;

      switch (device.type) {
        case 'chromecast':
          result = await this.castToChromecast(dashboardContent);
          break;
        case 'presentation':
          result = await this.castToPresentation(dashboardContent);
          break;
        case 'window':
          result = await this.castToWindow(dashboardContent);
          break;
        default:
          result = await this.castToWindow(dashboardContent);
      }

      if (result === true) {
        device.status = 'connected';
        this.currentSession = {
          device,
          sessionId: `session-${Date.now()}`,
          isActive: true,
          startTime: Date.now()
        };
        this.notifySessionListeners();
      } else {
        device.status = 'available';
      }

      this.notifyDeviceListeners();
      return result;

    } catch (error) {
      console.error('Casting failed:', error);
      device.status = 'available';
      this.notifyDeviceListeners();
      return 'Casting failed unexpectedly';
    }
  }

  private async castToChromecast(dashboardContent: any): Promise<true | string> {
    if (!this.isGoogleCastReady || !this.castContext) {
      return 'Chromecast not available. Try the "New Window" option instead.';
    }

    // Check if using default receiver
    if (this.castConfig.receiverType === 'default') {
      return `❌ Interactive dashboard casting requires a Custom Receiver App.

🔧 Setup Instructions:
1. Go to Google Cast Developer Console
2. Register a new Custom Receiver App
3. Set receiver type to "Web Receiver"
4. Use URL: ${window.location.origin}/cast-display.html
5. Add the App ID to your environment

💡 For now, try "New Window" option which works immediately!`;
    }

    try {
      console.log('Requesting Chromecast session...');
      
      // Request a cast session
      await this.castContext.requestSession();
      
      const session = this.castContext.getCurrentSession();
      if (!session) {
        return 'No Chromecast session established';
      }

      console.log('Chromecast session active, sending dashboard data...');

      // For custom receiver, send the data directly
      const message = {
        type: 'LOAD_DASHBOARD',
        data: dashboardContent,
        timestamp: Date.now()
      };

      session.sendMessage('urn:x-cast:com.tacctile.dashboard', message)
        .then(() => console.log('Dashboard data sent to receiver'))
        .catch((error: any) => console.error('Failed to send message:', error));

      console.log('Successfully cast to Custom Receiver');
      return true;

    } catch (error) {
      console.error('Chromecast error:', error);
      
      const errorMessage = String(error).toLowerCase();
      
      if (errorMessage.includes('cancel') || 
          errorMessage.includes('user') || 
          errorMessage.includes('abort')) {
        return 'Casting cancelled by user';
      }
      
      if (errorMessage.includes('timeout')) {
        return 'Chromecast connection timeout. Please ensure your device is nearby and try again.';
      }
      
      return 'Chromecast connection failed. Try using "New Window" option instead.';
    }
  }

  private async castToPresentation(dashboardContent: any): Promise<true | string> {
    try {
      if (!('presentation' in navigator)) {
        return 'Wireless display not supported by your browser';
      }

      // Generate unique key and store data in sessionStorage
      const dataKey = `tacctile_cast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem(dataKey, JSON.stringify(dashboardContent));

      const presentationUrl = `${window.location.origin}/cast-display.html?key=${dataKey}`;
      
      const request = new (window as any).PresentationRequest([presentationUrl]);
      const connection = await request.start();
      
      console.log('Presentation API connection established');
      return true;
      
    } catch (error) {
      console.error('Presentation API error:', error);
      
      const errorMessage = String(error).toLowerCase();
      if (errorMessage.includes('cancel') || errorMessage.includes('abort')) {
        return 'Wireless display cancelled by user';
      }
      
      return 'Wireless display connection failed. Try "New Window" option instead.';
    }
  }

  private async castToWindow(dashboardContent: any): Promise<true | string> {
    try {
      console.log('Opening cast display in new window...');
      
      // Close existing window if open
      if (this.castWindow && !this.castWindow.closed) {
        this.castWindow.close();
      }

      // ALWAYS use sessionStorage - never pass data in URL
      // Generate unique key and store data in sessionStorage
      const dataKey = `tacctile_cast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      // Ensure the data is properly serialized and stored
      try {
        const serializedData = JSON.stringify(dashboardContent);
        sessionStorage.setItem(dataKey, serializedData);
        console.log('Dashboard data stored in sessionStorage with key:', dataKey);
      } catch (serializationError) {
        console.error('Failed to serialize dashboard data:', serializationError);
        return 'Failed to prepare dashboard data for casting';
      }

      // Always use key-based URL - never include actual data
      const windowUrl = `${window.location.origin}/cast-display.html?key=${dataKey}`;
      
      // Verify URL length is reasonable (should be short with key approach)
      if (windowUrl.length > 2000) {
        console.error('Window URL still too long even with key approach:', windowUrl.length);
        return 'Internal error: URL generation failed';
      }

      // Open in new window - optimized for TV screens
      this.castWindow = window.open(
        windowUrl,
        'TacctileCastDisplay',
        'width=1920,height=1080,toolbar=no,menubar=no,scrollbars=no,resizable=yes,location=no,status=no,fullscreen=yes'
      );

      if (!this.castWindow) {
        // Clean up sessionStorage if window failed to open
        sessionStorage.removeItem(dataKey);
        return 'Unable to open new window. Please allow popups and try again.';
      }

      // Focus the new window
      this.castWindow.focus();

      console.log('Successfully opened cast window with sessionStorage key:', dataKey);
      return true;

    } catch (error) {
      console.error('Window casting error:', error);
      return 'Failed to open new window. Please check browser settings.';
    }
  }

  // Configuration methods
  public setCustomReceiverAppId(appId: string): void {
    localStorage.setItem('tacctile_cast_app_id', appId);
    this.castConfig = {
      receiverAppId: appId,
      receiverType: 'custom',
      customReceiverUrl: `${window.location.origin}/cast-display.html`
    };
    
    // Reinitialize Google Cast with new app ID
    if (this.isGoogleCastReady && this.castContext) {
      this.castContext.setOptions({
        receiverApplicationId: appId,
        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });
      
      // Update device description
      this.addChromecastDevice();
    }
    
    console.log('Custom Receiver App ID set:', appId);
  }

  public getReceiverConfiguration(): CastConfig {
    return { ...this.castConfig };
  }

  public stopCasting(): boolean {
    try {
      // Stop Chromecast
      if (this.castContext?.getCurrentSession()) {
        this.castContext.getCurrentSession().endSession(true);
      }

      // Close window
      if (this.castWindow && !this.castWindow.closed) {
        this.castWindow.close();
        this.castWindow = null;
      }

      // Reset session
      if (this.currentSession) {
        this.currentSession.device.status = 'available';
        this.currentSession = null;
        this.notifyDeviceListeners();
        this.notifySessionListeners();
      }

      return true;
    } catch (error) {
      console.error('Stop casting error:', error);
      return false;
    }
  }

  public getDevices(): CastDevice[] {
    return [...this.devices];
  }

  public getCurrentSession(): CastSession | null {
    return this.currentSession;
  }

  public onDevicesChanged(callback: (devices: CastDevice[]) => void) {
    this.listeners.add(callback);
    return () => this.listeners.delete(callback);
  }

  public onSessionChanged(callback: (session: CastSession | null) => void) {
    this.sessionListeners.add(callback);
    return () => this.sessionListeners.delete(callback);
  }

  private notifyDeviceListeners() {
    this.listeners.forEach(callback => callback([...this.devices]));
  }

  private notifySessionListeners() {
    this.sessionListeners.forEach(callback => callback(this.currentSession));
  }
}

// Export singleton instance
export const castingService = new CastingService();

// Global type declarations
declare global {
  interface Window {
    __onGCastApiAvailable?: (isAvailable: boolean) => void;
    cast?: any;
    chrome?: any;
  }
}