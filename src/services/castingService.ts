// Simplified, reliable casting service focused on dashboard content only
export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'presentation' | 'window' | 'unknown';
  status: 'available' | 'connecting' | 'connected' | 'unavailable';
  icon: string;
}

export interface CastSession {
  device: CastDevice;
  sessionId: string;
  isActive: boolean;
  startTime: number;
}

class CastingService {
  private devices: CastDevice[] = [];
  private currentSession: CastSession | null = null;
  private listeners: Set<(devices: CastDevice[]) => void> = new Set();
  private sessionListeners: Set<(session: CastSession | null) => void> = new Set();
  private castContext: any = null;
  private presentationRequest: any = null;
  private castWindow: Window | null = null;

  constructor() {
    this.initializeAPIs();
  }

  private async initializeAPIs() {
    // Initialize Google Cast
    this.initializeGoogleCast();
    
    // Initialize Presentation API
    this.initializePresentationAPI();
    
    // Always add fallback window casting
    this.addFallbackDevice();
  }

  private async initializeGoogleCast() {
    try {
      // Load Google Cast SDK
      if (!window.__onGCastApiAvailable && !window.cast) {
        window.__onGCastApiAvailable = (isAvailable: boolean) => {
          console.log('Google Cast API available:', isAvailable);
          if (isAvailable) {
            this.setupGoogleCast();
          }
        };

        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        script.async = true;
        script.onerror = () => {
          console.log('Google Cast SDK failed to load');
          this.addPresentationDevice();
        };
        document.head.appendChild(script);
        
        // Timeout fallback
        setTimeout(() => {
          if (!window.cast) {
            console.log('Google Cast SDK timeout');
            this.addPresentationDevice();
          }
        }, 3000);
      } else if (window.cast && window.cast.framework) {
        this.setupGoogleCast();
      }
    } catch (error) {
      console.log('Google Cast initialization failed:', error);
      this.addPresentationDevice();
    }
  }

  private setupGoogleCast() {
    try {
      const castContext = window.cast.framework.CastContext.getInstance();
      
      castContext.setOptions({
        receiverApplicationId: window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID,
        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });

      this.castContext = castContext;

      // Listen for cast state changes
      castContext.addEventListener(
        window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        (event: any) => this.handleCastStateChange(event)
      );

      this.addChromecastDevice();
      console.log('Google Cast setup completed');
    } catch (error) {
      console.log('Google Cast setup failed:', error);
      this.addPresentationDevice();
    }
  }

  private initializePresentationAPI() {
    try {
      if ('presentation' in navigator && 'PresentationRequest' in window) {
        const castUrl = `${window.location.origin}/cast-display.html`;
        this.presentationRequest = new (window as any).PresentationRequest([castUrl]);
        this.addPresentationDevice();
        console.log('Presentation API initialized');
      }
    } catch (error) {
      console.log('Presentation API not available:', error);
    }
  }

  private addChromecastDevice() {
    const device: CastDevice = {
      id: 'chromecast',
      name: 'Chromecast Device',
      type: 'chromecast',
      status: 'available',
      icon: '📺'
    };
    this.addDevice(device);
  }

  private addPresentationDevice() {
    const device: CastDevice = {
      id: 'presentation',
      name: 'Wireless Display',
      type: 'presentation',
      status: 'available',
      icon: '🖥️'
    };
    this.addDevice(device);
  }

  private addFallbackDevice() {
    const device: CastDevice = {
      id: 'new-window',
      name: 'New Window/Tab',
      type: 'window',
      status: 'available',
      icon: '🪟'
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

  private handleCastStateChange(event: any) {
    console.log('Cast state changed:', event.castState);
    const chromecastDevice = this.devices.find(d => d.type === 'chromecast');
    if (chromecastDevice) {
      switch (event.castState) {
        case window.cast.framework.CastState.CONNECTED:
          chromecastDevice.status = 'connected';
          break;
        case window.cast.framework.CastState.CONNECTING:
          chromecastDevice.status = 'connecting';
          break;
        default:
          chromecastDevice.status = 'available';
      }
      this.notifyDeviceListeners();
    }
  }

  public async startDeviceDiscovery(): Promise<CastDevice[]> {
    console.log('Starting device discovery...');
    
    // Simulate discovery delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return this.devices;
  }

  public async castToDevice(deviceId: string, dashboardContent: any): Promise<true | string> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return 'Device not found';

    console.log('Casting to device:', device.name, 'with content:', dashboardContent);

    try {
      device.status = 'connecting';
      this.notifyDeviceListeners();

      let result: true | string;

      switch (device.type) {
        case 'chromecast':
          result = await this.castToChromecast(dashboardContent);
          break;
        case 'presentation':
          result = await this.castToPresentation(dashboardContent);
          break;
        case 'window':
          result = await this.castToNewWindow(dashboardContent);
          break;
        default:
          result = await this.castToNewWindow(dashboardContent);
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
    if (!this.castContext) {
      return 'Chromecast not available. Please ensure you have a compatible device nearby.';
    }

    try {
      console.log('Requesting Chromecast session...');
      await this.castContext.requestSession();
      
      const session = this.castContext.getCurrentSession();
      if (!session) {
        return 'Unable to establish Chromecast session. Please try again.';
      }

      console.log('Chromecast session established, loading media...');

      // Create a media info object for the cast display
      const castUrl = `${window.location.origin}/cast-display.html`;
      const mediaInfo = new window.chrome.cast.media.MediaInfo(castUrl, 'text/html');
      
      // Set metadata
      mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
      mediaInfo.metadata.title = 'TACCTILE Dashboard';
      mediaInfo.metadata.subtitle = `Live Dashboard • ${dashboardContent.tiles?.length || 0} tiles`;
      
      // Add dashboard content as custom data
      mediaInfo.customData = {
        dashboardContent: dashboardContent,
        timestamp: Date.now(),
        type: 'tacctile-dashboard'
      };

      const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
      
      // Load the media
      await session.loadMedia(request);
      
      console.log('Successfully cast dashboard to Chromecast');
      return true;

    } catch (error) {
      console.error('Chromecast casting error:', error);
      
      // Enhanced error detection
      const errorStr = String(error).toLowerCase();
      const errorMsg = error?.message?.toLowerCase() || '';
      const errorName = error?.name?.toLowerCase() || '';
      
      if (errorStr.includes('cancel') || 
          errorStr.includes('user') || 
          errorMsg.includes('cancel') || 
          errorName.includes('cancel') ||
          errorName.includes('abort')) {
        return 'Chromecast session cancelled by user';
      }
      
      return 'Chromecast connection failed. Please ensure your device is available and try again.';
    }
  }

  private async castToPresentation(dashboardContent: any): Promise<true | string> {
    if (!this.presentationRequest) {
      return 'Wireless display not supported by your browser';
    }

    try {
      console.log('Starting wireless display presentation...');
      const connection = await this.presentationRequest.start();
      
      // Wait a moment for connection to establish
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Send dashboard content
      const message = JSON.stringify({
        type: 'dashboard-cast',
        content: dashboardContent,
        timestamp: Date.now()
      });
      
      connection.send(message);
      
      console.log('Successfully cast to wireless display');
      return true;
      
    } catch (error) {
      console.error('Presentation API casting error:', error);
      
      const errorStr = String(error).toLowerCase();
      if (errorStr.includes('cancel') || errorStr.includes('user') || errorStr.includes('abort')) {
        return 'Wireless display session cancelled by user';
      }
      
      return 'Wireless display connection failed. Please ensure your display device supports wireless connections.';
    }
  }

  private async castToNewWindow(dashboardContent: any): Promise<true | string> {
    try {
      console.log('Opening dashboard in new window...');
      
      // Close existing cast window if open
      if (this.castWindow && !this.castWindow.closed) {
        this.castWindow.close();
      }
      
      // Open cast display in new window
      const castUrl = `${window.location.origin}/cast-display.html`;
      this.castWindow = window.open(
        castUrl,
        'TacctileCastDisplay',
        'width=1920,height=1080,toolbar=no,menubar=no,location=no,status=no,scrollbars=no,resizable=yes'
      );

      if (!this.castWindow) {
        return 'Unable to open new window. Please allow popups for this site and try again.';
      }

      // Wait for the window to load, then send data
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      try {
        this.castWindow.postMessage({
          type: 'dashboard-cast',
          content: dashboardContent,
          timestamp: Date.now()
        }, window.location.origin);
        
        console.log('Successfully sent dashboard data to new window');
        return true;
      } catch (messageError) {
        console.log('Failed to send message to window, but window opened successfully');
        return true; // Window opened, data will be handled by the cast display page
      }
      
    } catch (error) {
      console.error('New window casting error:', error);
      return 'Failed to open new window. Please check your browser settings and try again.';
    }
  }

  public stopCasting(): boolean {
    if (!this.currentSession) return false;

    try {
      // Stop Chromecast session
      if (this.castContext && this.castContext.getCurrentSession()) {
        this.castContext.getCurrentSession().endSession(true);
      }

      // Close cast window
      if (this.castWindow && !this.castWindow.closed) {
        this.castWindow.close();
        this.castWindow = null;
      }

      this.currentSession.device.status = 'available';
      this.currentSession.isActive = false;
      this.currentSession = null;
      
      this.notifyDeviceListeners();
      this.notifySessionListeners();
      
      console.log('Casting stopped successfully');
      return true;
    } catch (error) {
      console.error('Stop casting failed:', error);
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

// Global casting service instance
export const castingService = new CastingService();

// Types for window extensions
declare global {
  interface Window {
    __onGCastApiAvailable: (isAvailable: boolean) => void;
    cast: any;
    chrome: any;
  }
}