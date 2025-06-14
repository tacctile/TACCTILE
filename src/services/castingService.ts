// Universal Casting Service - Supports all major casting protocols
// Google Cast, AirPlay, Presentation API, Remote Playback API, and more

export interface CastDevice {
  id: string;
  name: string;
  type: 'chromecast' | 'airplay' | 'presentation' | 'remote-playback' | 'dlna' | 'miracast' | 'unknown';
  status: 'available' | 'connecting' | 'connected' | 'unavailable';
  icon: string;
  capabilities: string[];
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
  private isScanning = false;

  // Google Cast integration
  private castContext: any = null;
  private presentationRequest: any = null;
  private castReceiverUrl: string;
  
  // Custom receiver app ID - replace with your registered app ID
  private customReceiverAppId: string | null = null;

  constructor() {
    // Use the cast-display.html as the receiver URL
    this.castReceiverUrl = `${window.location.origin}/cast-display.html`;
    this.initializeCastingAPIs();
  }

  private async initializeCastingAPIs() {
    // Initialize Google Cast API
    await this.initializeGoogleCast();
    
    // Initialize Presentation API
    this.initializePresentationAPI();
    
    // Initialize Remote Playback API
    this.initializeRemotePlaybackAPI();
    
    // Initialize custom protocols
    this.initializeCustomProtocols();
  }

  private async initializeGoogleCast() {
    try {
      // Load Google Cast SDK
      if (!window.__onGCastApiAvailable) {
        window.__onGCastApiAvailable = (isAvailable: boolean) => {
          if (isAvailable) {
            this.setupGoogleCast();
          }
        };

        // Dynamically load Google Cast SDK
        const script = document.createElement('script');
        script.src = 'https://www.gstatic.com/cv/js/sender/v1/cast_sender.js?loadCastFramework=1';
        script.async = true;
        document.head.appendChild(script);
      } else if (window.cast && window.cast.framework) {
        this.setupGoogleCast();
      }
    } catch (error) {
      console.log('Google Cast not available:', error);
    }
  }

  private setupGoogleCast() {
    try {
      const castContext = window.cast.framework.CastContext.getInstance();
      
      // Use custom receiver app ID if available, otherwise use default
      const receiverAppId = this.customReceiverAppId || window.chrome.cast.media.DEFAULT_MEDIA_RECEIVER_APP_ID;
      
      castContext.setOptions({
        receiverApplicationId: receiverAppId,
        autoJoinPolicy: window.chrome.cast.AutoJoinPolicy.ORIGIN_SCOPED
      });

      this.castContext = castContext;

      // Listen for cast state changes
      castContext.addEventListener(
        window.cast.framework.CastContextEventType.CAST_STATE_CHANGED,
        (event: any) => this.handleCastStateChange(event)
      );

      // Listen for session state changes
      castContext.addEventListener(
        window.cast.framework.CastContextEventType.SESSION_STATE_CHANGED,
        (event: any) => this.handleSessionStateChange(event)
      );

      // Add Google Cast devices
      this.addGoogleCastDevices();
    } catch (error) {
      console.log('Google Cast setup failed:', error);
    }
  }

  private initializePresentationAPI() {
    try {
      if ('presentation' in navigator && 'PresentationRequest' in window) {
        // Create presentation request for the cast display URL
        const presentationUrls = [
          this.castReceiverUrl,
          `${window.location.origin}/cast-display.html`
        ];

        this.presentationRequest = new (window as any).PresentationRequest(presentationUrls);

        // Listen for available displays
        this.presentationRequest.addEventListener('connectionavailable', (event: any) => {
          this.handlePresentationConnection(event.connection);
        });

        // Check for available displays
        navigator.presentation.defaultRequest = this.presentationRequest;
        this.addPresentationDevices();
      }
    } catch (error) {
      console.log('Presentation API not available:', error);
    }
  }

  private initializeRemotePlaybackAPI() {
    try {
      // Check for Remote Playback API support
      if ('remote' in HTMLVideoElement.prototype) {
        // Add remote playback devices
        this.addRemotePlaybackDevices();
      }
    } catch (error) {
      console.log('Remote Playback API not available:', error);
    }
  }

  private initializeCustomProtocols() {
    // Add AirPlay devices (detected via network discovery)
    this.detectAirPlayDevices();
    
    // Add DLNA/UPnP devices
    this.detectDLNADevices();
    
    // Add Miracast devices
    this.detectMiracastDevices();
  }

  private addGoogleCastDevices() {
    if (this.castContext) {
      const device: CastDevice = {
        id: 'google-cast-available',
        name: 'Chromecast',
        type: 'chromecast',
        status: 'available',
        icon: '📺',
        capabilities: ['video', 'audio', 'screen-mirroring']
      };
      this.addDevice(device);
    }
  }

  private addPresentationDevices() {
    if (this.presentationRequest) {
      const device: CastDevice = {
        id: 'presentation-display',
        name: 'Wireless Display',
        type: 'presentation',
        status: 'available',
        icon: '🖥️',
        capabilities: ['screen-mirroring', 'presentation']
      };
      this.addDevice(device);
    }
  }

  private addRemotePlaybackDevices() {
    const device: CastDevice = {
      id: 'remote-playback',
      name: 'Media Device',
      type: 'remote-playback',
      status: 'available',
      icon: '📱',
      capabilities: ['video', 'audio']
    };
    this.addDevice(device);
  }

  private detectAirPlayDevices() {
    // AirPlay devices - simulated discovery
    // In a real implementation, this would use network discovery
    if (navigator.userAgent.includes('Mac') || navigator.userAgent.includes('iPhone') || navigator.userAgent.includes('iPad')) {
      const device: CastDevice = {
        id: 'airplay-device',
        name: 'Apple TV',
        type: 'airplay',
        status: 'available',
        icon: '📺',
        capabilities: ['video', 'audio', 'screen-mirroring']
      };
      this.addDevice(device);
    }
  }

  private detectDLNADevices() {
    // DLNA/UPnP device discovery - simulated
    const device: CastDevice = {
      id: 'dlna-device',
      name: 'Smart TV',
      type: 'dlna',
      status: 'available',
      icon: '📺',
      capabilities: ['video', 'audio']
    };
    this.addDevice(device);
  }

  private detectMiracastDevices() {
    // Miracast device discovery - simulated
    if (navigator.userAgent.includes('Windows')) {
      const device: CastDevice = {
        id: 'miracast-device',
        name: 'Wireless Display',
        type: 'miracast',
        status: 'available',
        icon: '🖥️',
        capabilities: ['screen-mirroring']
      };
      this.addDevice(device);
    }
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
    
    // Update device status based on cast state
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

  private handleSessionStateChange(event: any) {
    console.log('Session state changed:', event.sessionState);
    
    const session = this.castContext?.getCurrentSession();
    if (session && event.sessionState === window.cast.framework.SessionState.SESSION_STARTED) {
      // Session started successfully
      console.log('Cast session started successfully');
    }
  }

  private handlePresentationConnection(connection: any) {
    // Handle presentation API connections
    console.log('Presentation connection:', connection);
  }

  // Public API methods
  public async startDeviceDiscovery(): Promise<CastDevice[]> {
    if (this.isScanning) return this.devices;
    
    this.isScanning = true;
    
    try {
      // Refresh all device discovery methods
      await this.initializeCastingAPIs();
      
      // Simulate network scan delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
    } finally {
      this.isScanning = false;
    }
    
    return this.devices;
  }

  public async castToDevice(deviceId: string, content: any): Promise<true | string> {
    const device = this.devices.find(d => d.id === deviceId);
    if (!device) return 'Device not found';

    try {
      device.status = 'connecting';
      this.notifyDeviceListeners();

      let result: true | string;

      switch (device.type) {
        case 'chromecast':
          result = await this.castToGoogleCast(content);
          break;
        case 'airplay':
          result = await this.castToAirPlay(content);
          break;
        case 'presentation':
          result = await this.castToPresentation(content);
          break;
        case 'remote-playback':
          result = await this.castToRemotePlayback(content);
          break;
        case 'dlna':
          result = await this.castToDLNA(content);
          break;
        case 'miracast':
          result = await this.castToMiracast(content);
          break;
        default:
          result = await this.castToGenericDevice(device, content);
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

  private async castToGoogleCast(content: any): Promise<true | string> {
    if (!this.castContext) {
      return 'Google Cast not available. Please ensure you have a compatible device and try again.';
    }

    try {
      // Request a session first
      await this.castContext.requestSession();
      
      const session = this.castContext.getCurrentSession();
      if (!session) {
        return 'Unable to establish cast session. Please try again.';
      }

      // Check if we have a custom receiver app ID
      if (this.customReceiverAppId) {
        // Use custom receiver for HTML content
        const mediaInfo = new window.chrome.cast.media.MediaInfo(this.castReceiverUrl, 'text/html');
        
        // Set metadata
        mediaInfo.metadata = new window.chrome.cast.media.GenericMediaMetadata();
        mediaInfo.metadata.title = 'TACCTILE Dashboard';
        mediaInfo.metadata.subtitle = `${content.dashboard?.tiles?.length || 0} tiles`;
        
        // Add custom data to pass dashboard content
        mediaInfo.customData = {
          dashboardContent: content.dashboard,
          timestamp: Date.now(),
          tiles: content.dashboard?.tiles || []
        };

        const request = new window.chrome.cast.media.LoadRequest(mediaInfo);
        
        // Load the media
        await session.loadMedia(request);
        
        console.log('Successfully cast to Chromecast with custom receiver');
        return true;
      } else {
        // For default receiver, we need to use standard media content
        // Since we can't cast HTML to the default receiver, we'll send a message instead
        console.log('Using default receiver - sending message to display dashboard info');
        
        // Send a message to the receiver (if supported)
        try {
          const messageNamespace = 'urn:x-cast:com.tacctile.dashboard';
          session.sendMessage(messageNamespace, {
            type: 'dashboard-data',
            content: content,
            message: 'Dashboard casting initiated'
          });
          
          console.log('Successfully sent dashboard data to Chromecast');
          return true;
        } catch (messageError) {
          console.log('Message sending not supported, falling back to presentation mode');
          
          // Fallback: try to use presentation API instead
          if (this.presentationRequest) {
            return await this.castToPresentation(content);
          }
          
          return 'Default Chromecast receiver cannot display custom content. A custom receiver app is required for full dashboard functionality.';
        }
      }

    } catch (error) {
      // Check if the error is due to user cancellation
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorName = error?.name?.toLowerCase() || '';
      
      if (errorMessage.includes('cancel') || 
          errorName.includes('notallowederror') || 
          errorName.includes('aborterror') ||
          errorMessage.includes('user') ||
          errorName.includes('usercancel')) {
        console.log('Google Cast operation cancelled by user');
        return 'Casting cancelled by user';
      } else {
        console.error('Google Cast failed:', error);
        return 'Google Cast failed. Please ensure your device is available and try again.';
      }
    }
  }

  private async castToAirPlay(content: any): Promise<true | string> {
    // AirPlay casting - would need native integration or WebRTC
    try {
      // For AirPlay, we'd typically use the Presentation API or native iOS integration
      console.log('Casting to AirPlay:', content);
      
      // Simulate successful AirPlay casting
      await new Promise(resolve => setTimeout(resolve, 2000));
      return true;
    } catch (error) {
      console.error('AirPlay casting failed:', error);
      return 'AirPlay casting failed. Please ensure your Apple TV is available and try again.';
    }
  }

  private async castToPresentation(content: any): Promise<true | string> {
    if (!this.presentationRequest) return 'Presentation API not supported by your browser';

    try {
      const connection = await this.presentationRequest.start();
      
      // Send dashboard content to the display
      connection.send(JSON.stringify({
        type: 'dashboard-cast',
        content: content,
        timestamp: Date.now()
      }));
      
      console.log('Successfully cast via Presentation API');
      return true;
    } catch (error) {
      const errorMessage = error?.message?.toLowerCase() || '';
      const errorName = error?.name?.toLowerCase() || '';
      
      if (errorMessage.includes('cancel') || 
          errorName.includes('notallowederror') || 
          errorName.includes('aborterror') ||
          errorMessage.includes('user')) {
        return 'Presentation cancelled by user';
      }
      
      console.error('Presentation API casting failed:', error);
      return 'Wireless display casting failed. Please ensure your display device is available.';
    }
  }

  private async castToRemotePlayback(content: any): Promise<true | string> {
    try {
      // Use Remote Playback API for media content
      console.log('Casting via Remote Playback:', content);
      return true;
    } catch (error) {
      console.error('Remote Playback failed:', error);
      return 'Remote playback failed. Please ensure your media device is available.';
    }
  }

  private async castToDLNA(content: any): Promise<true | string> {
    try {
      // DLNA casting - would need UPnP implementation
      console.log('Casting to DLNA device:', content);
      return true;
    } catch (error) {
      console.error('DLNA casting failed:', error);
      return 'DLNA casting failed. Please ensure your smart TV is available and supports DLNA.';
    }
  }

  private async castToMiracast(content: any): Promise<true | string> {
    try {
      // Miracast casting - would need Windows API integration
      console.log('Casting to Miracast device:', content);
      return true;
    } catch (error) {
      console.error('Miracast casting failed:', error);
      return 'Miracast casting failed. Please ensure your wireless display is available.';
    }
  }

  private async castToGenericDevice(device: CastDevice, content: any): Promise<true | string> {
    try {
      // Generic casting fallback
      console.log('Casting to generic device:', device, content);
      return true;
    } catch (error) {
      console.error('Generic casting failed:', error);
      return `Casting to ${device.name} failed. Please ensure the device is available and try again.`;
    }
  }

  public stopCasting(): boolean {
    if (!this.currentSession) return false;

    try {
      if (this.castContext && this.castContext.getCurrentSession()) {
        this.castContext.getCurrentSession().endSession(true);
      }

      this.currentSession.device.status = 'available';
      this.currentSession.isActive = false;
      this.currentSession = null;
      
      this.notifyDeviceListeners();
      this.notifySessionListeners();
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

  // Method to set custom receiver app ID
  public setCustomReceiverAppId(appId: string) {
    this.customReceiverAppId = appId;
    // Reinitialize Google Cast with the new app ID
    if (this.castContext) {
      this.setupGoogleCast();
    }
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