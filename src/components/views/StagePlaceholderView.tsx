import React from 'react';
import {
  ShoppingBag,
  User,
  CreditCard,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { Button } from '../ui/Button';

interface StagePlaceholderViewProps {
  type: 'account' | 'cart' | 'checkout';
  onNavigateHome: () => void;
  onNavigateShop: () => void;
}

export const StagePlaceholderView: React.FC<StagePlaceholderViewProps> = ({
  type,
  onNavigateHome,
  onNavigateShop,
}) => {
  const configs = {
    account: {
      icon: <User className="w-8 h-8 text-[#DE1B76]" />,
      title: 'Customer Accounts & Portal',
      stage: 'Future Commerce Integration',
      summary:
        'A dedicated extended customer portal is planned for subsequent backend stages, enabling advanced order tracking, saved Accra delivery addresses, and personal wishlists.',
      upcomingFeatures: [
        'Secure customer registration & password reset',
        'Saved delivery addresses across Accra',
        'Past order history & status tracking',
        'Personal wishlist & favorite bakes',
        'Integration with PostgreSQL database & session management',
      ],
    },
    cart: {
      icon: <ShoppingBag className="w-8 h-8 text-[#DE1B76]" />,
      title: 'Shopping Cart',
      stage: 'Future Commerce Integration',
      summary:
        'Your interactive shopping cart foundation is being prepared for a future commerce stage. Orders and inquiries are currently handled directly with our team on WhatsApp.',
      upcomingFeatures: [
        'Live quantity adjustments & subtotal calculations',
        'Custom order notes & celebration inscriptions',
        'Accra delivery fee calculator & pickup options',
        'Save cart for later sessions',
        'Smooth transition to Paystack checkout',
      ],
    },
    checkout: {
      icon: <CreditCard className="w-8 h-8 text-[#DE1B76]" />,
      title: 'Secure Checkout & Payments',
      stage: 'Future Commerce Integration',
      summary:
        'Checkout processing is reserved for subsequent backend stages. To place an order now, connect directly with Pearls Culinary Counts via WhatsApp or phone.',
      upcomingFeatures: [
        'Paystack card, Mobile Money (MTN, Telecel, AT) integration',
        'Cash on delivery & pickup payment options',
        'Automated SMS notifications via Sailup',
        'Real-time order verification & digital receipt',
        'Server-side payment reconciliation',
      ],
    },
  };

  const config = configs[type];

  return (
    <div className="py-16 lg:py-24 bg-[#FAFAFA] min-h-[70vh] flex items-center justify-center">
      <div className="max-w-2xl w-full mx-auto px-4">
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-neutral-200/70 shadow-sm text-center space-y-6">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{config.stage}</span>
          </div>

          {/* Icon */}
          <div className="w-16 h-16 rounded-2xl bg-neutral-50 flex items-center justify-center mx-auto border border-neutral-100 shadow-2xs">
            {config.icon}
          </div>

          {/* Title & Summary */}
          <div className="space-y-2">
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121214]">
              {config.title}
            </h1>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed max-w-lg mx-auto">
              {config.summary}
            </p>
          </div>

          {/* Planned Features List */}
          <div className="bg-neutral-50 rounded-2xl p-6 text-left border border-neutral-100 space-y-3">
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
              <Lock className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Planned Future Features</span>
            </div>
            <ul className="space-y-2 text-xs sm:text-sm text-neutral-700">
              {config.upcomingFeatures.map((feat, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#DE1B76] flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Button
              variant="primary"
              size="md"
              onClick={onNavigateShop}
            >
              Browse Offerings
            </Button>
            <Button
              variant="outline"
              size="md"
              onClick={onNavigateHome}
              icon={<ArrowLeft className="w-4 h-4" />}
              iconPosition="left"
            >
              Back to Home
            </Button>
          </div>

        </div>
      </div>
    </div>
  );
};
