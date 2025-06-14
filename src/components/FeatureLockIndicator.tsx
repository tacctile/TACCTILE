import React from 'react';
import { Lock, Crown, Star } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';

interface FeatureLockIndicatorProps {
  feature: string;
  requiredTier: SubscriptionTier;
  inline?: boolean;
  showUpgradeHint?: boolean;
  onUpgradeClick?: () => void;
}

const FeatureLockIndicator: React.FC<FeatureLockIndicatorProps> = ({
  feature,
  requiredTier,
  inline = false,
  showUpgradeHint = true,
  onUpgradeClick
}) => {
  const { subscription } = useSubscription();

  const getTierInfo = (tier: SubscriptionTier) => {
    switch (tier) {
      case 'pro':
        return { name: 'Pro', icon: Star, color: 'text-spotify-green' };
      case 'enterprise':
        return { name: 'Enterprise', icon: Crown, color: 'text-purple-400' };
      default:
        return { name: 'Free', icon: Lock, color: 'text-spotify-text-gray' };
    }
  };

  const tierInfo = getTierInfo(requiredTier);
  const Icon = tierInfo.icon;

  if (inline) {
    return (
      <div className="inline-flex items-center space-x-2">
        <Lock className="w-4 h-4 text-orange-400" />
        <span className="text-xs text-orange-400 font-spotify">
          {tierInfo.name} Required
        </span>
      </div>
    );
  }

  return (
    <div className="p-4 bg-spotify-medium-gray border border-orange-500/30 rounded-lg">
      <div className="flex items-center space-x-3 mb-3">
        <div className="w-10 h-10 bg-orange-500/20 rounded-lg flex items-center justify-center">
          <Lock className="w-5 h-5 text-orange-400" />
        </div>
        <div>
          <h3 className="font-bold text-spotify-white font-spotify">{feature} Locked</h3>
          <p className="text-sm text-spotify-text-gray font-spotify">
            Requires {tierInfo.name} subscription
          </p>
        </div>
      </div>

      {showUpgradeHint && (
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-sm text-spotify-text-gray">
            <Icon className={`w-4 h-4 ${tierInfo.color}`} />
            <span className="font-spotify">Upgrade to unlock this feature</span>
          </div>
          {onUpgradeClick && (
            <button
              onClick={onUpgradeClick}
              className="px-3 py-1 bg-spotify-green hover:bg-spotify-green-dark text-spotify-black font-medium rounded-lg transition-all text-sm font-spotify"
            >
              Upgrade
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default FeatureLockIndicator;