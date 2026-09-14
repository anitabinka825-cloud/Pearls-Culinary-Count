import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  HelpCircle,
  X,
  MessageCircle,
  Phone,
  ShoppingBag,
  Sparkles,
  GraduationCap,
  Mail,
  User,
  ChevronRight,
  Send,
} from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';

interface CustomerCareButtonProps {
  onOpenCustomOrder?: () => void;
}

export const CustomerCareButton: React.FC<CustomerCareButtonProps> = ({
  onOpenCustomOrder,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  const whatsappGeneralUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts customer care, I have a question regarding your offerings and services in Accra.'
  );

  const handleNav = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

  return (
    <div
      id="customer-care-widget"
      aria-label="Customer Care Entry Point"
      className="fixed bottom-6 right-6 z-40"
    >
      {/* Floating Trigger Button */}
      {!isOpen && (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          aria-label="Open customer care options"
          className="group flex items-center gap-2.5 bg-[#DE1B76] hover:bg-[#B8125C] text-white p-3.5 sm:px-4 sm:py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 active:scale-95 border border-white/20"
        >
          <HelpCircle className="w-5 h-5 flex-shrink-0" />
          <span className="text-xs font-semibold tracking-wide">
            Need Help?
          </span>
        </button>
      )}

      {/* Expanded Assistance Card */}
      {isOpen && (
        <div className="bg-white rounded-3xl shadow-2xl border border-neutral-200/90 w-84 sm:w-92 overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200 flex flex-col max-h-[85vh]">
          {/* Card Header */}
          <div className="bg-[#121214] text-white p-4.5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#DE1B76] flex items-center justify-center text-white">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold font-serif text-white">
                  Customer Assistance
                </p>
                <p className="text-[10px] text-[#C5A059]">
                  Pearls Culinary Counts • Accra
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              aria-label="Close care menu"
              className="p-1 rounded-full text-neutral-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Help Content */}
          <div className="p-4 space-y-3 text-xs overflow-y-auto">
            <p className="text-neutral-600 leading-relaxed text-[11px]">
              How can we assist you with orders, culinary training, or custom bakes today?
            </p>

            {/* Quick Navigation Links */}
            <div className="space-y-1.5">
              {/* Shop */}
              <button
                type="button"
                onClick={() => handleNav('/shop')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-100 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <ShoppingBag className="w-4 h-4 text-[#DE1B76]" />
                  <span>Browse Shop & Catalogue</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Custom Order */}
              <button
                type="button"
                onClick={() => {
                  setIsOpen(false);
                  if (onOpenCustomOrder) {
                    onOpenCustomOrder();
                  } else {
                    navigate('/enquiry');
                  }
                }}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-100 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Sparkles className="w-4 h-4 text-[#C5A059]" />
                  <span>Custom Cake & Order Form</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Training */}
              <button
                type="button"
                onClick={() => handleNav('/training')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-100 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <GraduationCap className="w-4 h-4 text-[#DE1B76]" />
                  <span>Culinary Training Masterclasses</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Contact */}
              <button
                type="button"
                onClick={() => handleNav('/contact')}
                className="w-full flex items-center justify-between p-2.5 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-800 font-medium transition-colors border border-neutral-100 text-left"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-neutral-600" />
                  <span>Contact Information</span>
                </div>
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>

              {/* Cart & Account Grid */}
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                <button
                  type="button"
                  onClick={() => handleNav('/cart')}
                  className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium transition-colors border border-neutral-100 text-[11px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <ShoppingBag className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span>View Cart</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                </button>

                <button
                  type="button"
                  onClick={() => handleNav('/account')}
                  className="flex items-center justify-between p-2 rounded-xl bg-neutral-50 hover:bg-neutral-100 text-neutral-700 font-medium transition-colors border border-neutral-100 text-[11px]"
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <User className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                    <span>Account</span>
                  </div>
                  <ChevronRight className="w-3 h-3 text-neutral-400" />
                </button>
              </div>
            </div>

            {/* Direct Escalation to WhatsApp */}
            <div className="pt-2 border-t border-neutral-100 space-y-2">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-500 block">
                Have a question? Chat with our team
              </span>
              <a
                href={whatsappGeneralUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-between p-3 rounded-xl bg-[#FDF2F7] hover:bg-[#FCE7F3] text-[#DE1B76] font-semibold transition-colors border border-[#F9A8D4]/40"
              >
                <div className="flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 flex-shrink-0" />
                  <span>Escalate to WhatsApp ({BUSINESS_CONFIG.phoneFormatted})</span>
                </div>
                <Send className="w-3.5 h-3.5 text-[#DE1B76]" />
              </a>

              <a
                href={`tel:${BUSINESS_CONFIG.phone}`}
                className="flex items-center justify-between p-2 rounded-xl text-neutral-600 hover:text-neutral-900 text-[11px] transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-neutral-400" />
                  <span>Direct Call: {BUSINESS_CONFIG.phoneFormatted}</span>
                </div>
              </a>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};
