import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

export type SubscriptionTier = 'free' | 'pro' | 'enterprise';

export interface SubscriptionFeatures {
  maxTiles: number;
  canCastChromecast: boolean;
  canCastNewWindow: boolean;
  canCustomizeTiles: boolean;
  canUseCustomReceiver: boolean;
  canWhiteLabel: boolean;
  priority: 'standard' | 'priority' | 'enterprise';
}

export interface Subscription {
  tier: SubscriptionTier;
  features: SubscriptionFeatures;
  isActive: boolean;
  expiresAt?: string;
  cancelledAt?: string;
}

interface SubscriptionContextType {
  subscription: Subscription;
  canUseFeature: (feature: keyof SubscriptionFeatures) => boolean;
  isFeatureLocked: (feature: keyof SubscriptionFeatures) => boolean;
  upgradeTo: (tier: SubscriptionTier) => Promise<boolean>;
  cancelSubscription: () => Promise<boolean>;
  restoreSubscription: () => Promise<boolean>;
  getUpgradeReason: (feature: keyof SubscriptionFeatures) => string;
  isLoading: boolean;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

const subscriptionFeatures: Record<SubscriptionTier, SubscriptionFeatures> = {
  free: {
    maxTiles: 8,
    canCastChromecast: false,
    canCastNewWindow: true,
    canCustomizeTiles: false,
    canUseCustomReceiver: false,
    canWhiteLabel: false,
    priority: 'standard'
  },
  pro: {
    maxTiles: Infinity,
    canCastChromecast: true,
    canCastNewWindow: true,
    canCustomizeTiles: true,
    canUseCustomReceiver: true,
    canWhiteLabel: false,
    priority: 'priority'
  },
  enterprise: {
    maxTiles: Infinity,
    canCastChromecast: true,
    canCastNewWindow: true,
    canCustomizeTiles: true,
    canUseCustomReceiver: true,
    canWhiteLabel: true,
    priority: 'enterprise'
  }
};

const upgradeReasons: Record<keyof SubscriptionFeatures, string> = {
  maxTiles: 'Unlock unlimited tiles to build comprehensive dashboards',
  canCastChromecast: 'Cast to any Chromecast device for professional presentations',
  canCastNewWindow: 'This feature is available in your current plan',
  canCustomizeTiles: 'Customize tile colors, fonts, and styling to match your brand',
  canUseCustomReceiver: 'Deploy custom receiver apps for enterprise casting',
  canWhiteLabel: 'Remove TACCTILE branding and use your own company branding',
  priority: 'Get priority support and faster response times'
};

interface SubscriptionProviderProps {
  children: ReactNode;
}

export const SubscriptionProvider: React.FC<SubscriptionProviderProps> = ({ children }) => {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription>({
    tier: 'free',
    features: subscriptionFeatures.free,
    isActive: true
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSubscription();
  }, [user]);

  const loadSubscription = async () => {
    setIsLoading(true);
    
    try {
      // Simulate API call to load subscription
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Load from localStorage for demo
      const savedSub = localStorage.getItem(`tacctile_subscription_${user?.id || 'guest'}`);
      
      if (savedSub) {
        const parsed = JSON.parse(savedSub);
        setSubscription({
          ...parsed,
          features: subscriptionFeatures[parsed.tier]
        });
      } else {
        // Default to free tier
        setSubscription({
          tier: 'free',
          features: subscriptionFeatures.free,
          isActive: true
        });
      }
    } catch (error) {
      console.error('Failed to load subscription:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveSubscription = (sub: Subscription) => {
    localStorage.setItem(`tacctile_subscription_${user?.id || 'guest'}`, JSON.stringify(sub));
    setSubscription(sub);
  };

  const canUseFeature = (feature: keyof SubscriptionFeatures): boolean => {
    if (!subscription.isActive) return false;
    
    const featureValue = subscription.features[feature];
    
    // Special handling for maxTiles
    if (feature === 'maxTiles') {
      return true; // We'll check the actual count elsewhere
    }
    
    return Boolean(featureValue);
  };

  const isFeatureLocked = (feature: keyof SubscriptionFeatures): boolean => {
    return !canUseFeature(feature);
  };

  const upgradeTo = async (tier: SubscriptionTier): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newSubscription: Subscription = {
        tier,
        features: subscriptionFeatures[tier],
        isActive: true,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() // 30 days from now
      };
      
      saveSubscription(newSubscription);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Upgrade failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const cancelSubscription = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const cancelledSubscription: Subscription = {
        ...subscription,
        cancelledAt: new Date().toISOString()
      };
      
      saveSubscription(cancelledSubscription);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Cancellation failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const restoreSubscription = async (): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const restoredSubscription: Subscription = {
        ...subscription,
        cancelledAt: undefined
      };
      
      saveSubscription(restoredSubscription);
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error('Restore failed:', error);
      setIsLoading(false);
      return false;
    }
  };

  const getUpgradeReason = (feature: keyof SubscriptionFeatures): string => {
    return upgradeReasons[feature] || 'Upgrade to unlock this feature';
  };

  return (
    <SubscriptionContext.Provider value={{
      subscription,
      canUseFeature,
      isFeatureLocked,
      upgradeTo,
      cancelSubscription,
      restoreSubscription,
      getUpgradeReason,
      isLoading
    }}>
      {children}
    </SubscriptionContext.Provider>
  );
};