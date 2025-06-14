import React, { useState } from 'react';
import { X, Crown, Star, Zap, Check, Loader2, CreditCard } from 'lucide-react';
import { useSubscription, SubscriptionTier } from '../contexts/SubscriptionContext';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  lockedFeature?: string;
  featureDescription?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({ 
  isOpen, 
  onClose, 
  lockedFeature,
  featureDescription 
}) => {
  const { subscription, upgradeTo, isLoading } = useSubscription();
  const [selectedTier, setSelectedTier] = useState<SubscriptionTier>('pro');
  const [isUpgrading, setIsUpgrading] = useState(false);
  const [upgradeSuccess, setUpgradeSuccess] = useState(false);

  const plans = [
    {
      tier: 'pro' as SubscriptionTier,
      name: 'Pro',
      price: '$9',
      period: '/month',
      icon: <Star className="w-6 h-6" />,
      color: 'from-spotify-green to-green-600',
      popular: true,
      features: [
        'Unlimited tiles',
        'Full Chromecast casting',
        'Custom tile styling',
        'Custom receiver apps',
        'Priority support',
        'Advanced analytics'
      ]
    },
    {
      tier: 'enterprise' as SubscriptionTier,
      name: 'Enterprise',
      price: '$29',
      period: '/month',
      icon: <Crown className="w-6 h-6" />,
      color: 'from-purple-500 to-purple-700',
      popular: false,
      features: [
        'Everything in Pro',
        'White-label branding',
        'Custom domains',
        'Enterprise SSO',
        'Dedicated support',
        'SLA guarantee',
        'Custom integrations'
      ]
    }
  ];

  const handleUpgrade = async (tier: SubscriptionTier) => {
    setIsUpgrading(true);
    setSelectedTier(tier);

    try {
      const success = await upgradeTo(tier);
      if (success) {
        setUpgradeSuccess(true);
        setTimeout(() => {
          onClose();
          setUpgradeSuccess(false);
        }, 2000);
      }
    } catch (error) {
      console.error('Upgrade failed:', error);
    } finally {
      setIsUpgrading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl bg-spotify-dark-gray backdrop-blur-xl border border-spotify-light-gray/30 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-spotify-light-gray/20 bg-gradient-to-r from-spotify-green/10 to-purple-500/10">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-spotify-green to-purple-500 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-spotify-white font-spotify">Upgrade Your Plan</h2>
              {lockedFeature && (
                <p className="text-spotify-text-gray text-sm font-spotify">
                  Unlock {lockedFeature} {featureDescription && `• ${featureDescription}`}
                </p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-spotify-medium-gray text-spotify-text-gray hover:text-spotify-white transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Success State */}
        {upgradeSuccess && (
          <div className="p-6 border-b border-spotify-light-gray/20 bg-spotify-green/10">
            <div className="flex items-center space-x-3 text-spotify-green">
              <Check className="w-6 h-6" />
              <div>
                <h3 className="font-bold font-spotify">Upgrade Successful!</h3>
                <p className="text-sm font-spotify">Your new features are now active.</p>
              </div>
            </div>
          </div>
        )}

        {/* Current Plan */}
        {subscription.tier !== 'free' && (
          <div className="p-6 border-b border-spotify-light-gray/20 bg-spotify-medium-gray/30">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-spotify-green/20 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-spotify-green" />
              </div>
              <div>
                <h3 className="font-bold text-spotify-white font-spotify">
                  Current Plan: {subscription.tier.charAt(0).toUpperCase() + subscription.tier.slice(1)}
                </h3>
                <p className="text-sm text-spotify-text-gray font-spotify">
                  {subscription.expiresAt && `Expires ${new Date(subscription.expiresAt).toLocaleDateString()}`}
                  {subscription.cancelledAt && ` • Cancelled ${new Date(subscription.cancelledAt).toLocaleDateString()}`}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {plans.map((plan) => (
              <div
                key={plan.tier}
                className={`relative rounded-2xl border-2 transition-all duration-300 ${
                  plan.popular 
                    ? 'border-spotify-green bg-spotify-green/5' 
                    : 'border-spotify-light-gray/20 bg-spotify-medium-gray/30 hover:border-spotify-green/40'
                }`}
              >
                {/* Popular Badge */}
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <div className="bg-spotify-green text-spotify-black px-4 py-1 rounded-full text-sm font-bold font-spotify">
                      Most Popular
                    </div>
                  </div>
                )}

                <div className="p-6">
                  {/* Plan Header */}
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-xl bg-gradient-to-r ${plan.color} flex items-center justify-center`}>
                      {plan.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-spotify-white mb-2 font-spotify">{plan.name}</h3>
                    <div className="flex items-baseline justify-center">
                      <span className="text-4xl font-bold text-spotify-white font-spotify">{plan.price}</span>
                      <span className="text-spotify-text-gray font-spotify">{plan.period}</span>
                    </div>
                  </div>

                  {/* Features */}
                  <div className="space-y-3 mb-6">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-3">
                        <Check className="w-5 h-5 text-spotify-green flex-shrink-0" />
                        <span className="text-spotify-text-gray font-spotify">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Action Button */}
                  <button
                    onClick={() => handleUpgrade(plan.tier)}
                    disabled={isUpgrading || subscription.tier === plan.tier}
                    className={`w-full py-3 px-4 rounded-xl font-bold transition-all font-spotify ${
                      subscription.tier === plan.tier
                        ? 'bg-spotify-light-gray text-spotify-text-gray cursor-not-allowed'
                        : plan.popular
                        ? 'bg-spotify-green hover:bg-spotify-green-dark text-spotify-black shadow-lg shadow-spotify-green/20 hover:shadow-xl hover:shadow-spotify-green/30'
                        : 'bg-gradient-to-r from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white'
                    }`}
                  >
                    {isUpgrading && selectedTier === plan.tier ? (
                      <div className="flex items-center justify-center space-x-2">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Processing...</span>
                      </div>
                    ) : subscription.tier === plan.tier ? (
                      'Current Plan'
                    ) : (
                      <div className="flex items-center justify-center space-x-2">
                        <CreditCard className="w-4 h-4" />
                        <span>Upgrade to {plan.name}</span>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Free Plan Info */}
        <div className="p-6 border-t border-spotify-light-gray/20 bg-spotify-medium-gray/20">
          <div className="text-center">
            <h3 className="font-bold text-spotify-white mb-2 font-spotify">Free Plan Features</h3>
            <div className="flex items-center justify-center space-x-6 text-sm text-spotify-text-gray font-spotify">
              <span>✅ Up to 8 tiles</span>
              <span>✅ New Window casting</span>
              <span>✅ Basic dashboard</span>
              <span>❌ Chromecast casting</span>
              <span>❌ Custom styling</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-spotify-light-gray/20 bg-spotify-dark-gray/50">
          <div className="text-center text-sm text-spotify-text-gray font-spotify">
            <p className="mb-2">
              🔒 <strong>Secure Payment:</strong> All transactions are encrypted and secure
            </p>
            <p>
              💰 <strong>30-day money-back guarantee</strong> • 
              📞 <strong>Cancel anytime</strong> • 
              🔄 <strong>Instant activation</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;