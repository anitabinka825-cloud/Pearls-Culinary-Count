import React, { useState } from 'react';
import { MessageCircle, Phone, MapPin, Heart, Sparkles, X } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';
import { SocialLinks } from '../ui/SocialLinks';
import { AppRoute } from '../../types';
import siteLogoImg from '../../assets/images/pearls_logo_1791881783293.jpg';

interface FooterProps {
  onNavigate: (route: AppRoute) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [activePolicy, setActivePolicy] = useState<'privacy' | 'terms' | null>(null);
  const currentYear = new Date().getFullYear();

  const whatsappUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I am visiting your website and have an enquiry.'
  );

  return (
    <footer
      id="global-footer"
      className="bg-[#0D0D0E] text-neutral-400 pt-16 pb-12 border-t border-neutral-900"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Footer Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 pb-12 border-b border-neutral-900">
          
          {/* Brand Info (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-[#C5A059] shadow-md flex-shrink-0">
                <img
                  src={siteLogoImg}
                  alt="Pearls Culinary Counts Logo"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="font-serif text-xl sm:text-2xl font-bold tracking-tight text-white">
                PEARLS CULINARY <span className="text-[#DE1B76]">COUNTS</span>
              </span>
            </div>

            <p className="font-serif italic text-sm text-[#C5A059]">
              {BUSINESS_CONFIG.tagline} • {BUSINESS_CONFIG.motto}
            </p>

            <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed max-w-sm font-light">
              A modern Ghanaian culinary and lifestyle business offering cakes, pastries, bread, food, catering, culinary training, bags, jewellery, perfumes, and selected lifestyle products.
            </p>

            {/* Social Media Links (Configured only) */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block mb-2">
                Connect With Us
              </span>
              <SocialLinks itemClassName="border-neutral-800 text-neutral-400 hover:text-[#DE1B76] hover:border-[#DE1B76] hover:bg-white/5" />
            </div>
          </div>

          {/* Quick Navigation (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Explore
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/')}
                  className="hover:text-white transition-colors"
                >
                  Home
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="hover:text-white transition-colors"
                >
                  Shop Offerings
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/about')}
                  className="hover:text-white transition-colors"
                >
                  About Pearls
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/contact')}
                  className="hover:text-white transition-colors"
                >
                  Contact & Orders
                </button>
              </li>
            </ul>
          </div>

          {/* Product Categories (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Categories & Training
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm">
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/cakes')}
                  className="hover:text-white transition-colors"
                >
                  Cakes & Pastries
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/food')}
                  className="hover:text-white transition-colors"
                >
                  Food & Catering
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/training')}
                  className="hover:text-white transition-colors"
                >
                  Culinary Training
                </button>
              </li>
              <li>
                <button
                  type="button"
                  onClick={() => onNavigate('/shop')}
                  className="hover:text-white transition-colors"
                >
                  Lifestyle (Bags, Jewellery, Perfumes)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact & Orders (3 cols) */}
          <div className="lg:col-span-3 space-y-3">
            <h4 className="text-xs uppercase tracking-widest text-white font-semibold">
              Location & Orders
            </h4>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center gap-2.5">
                <MapPin className="w-4 h-4 text-[#C5A059] flex-shrink-0" />
                <span className="text-neutral-300">{BUSINESS_CONFIG.location}</span>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#DE1B76] flex-shrink-0" />
                <a
                  href={`tel:${BUSINESS_CONFIG.phone}`}
                  className="text-neutral-300 hover:text-white transition-colors"
                >
                  {BUSINESS_CONFIG.phoneFormatted}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-[#DE1B76] flex-shrink-0" />
                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-neutral-300 hover:text-[#DE1B76] transition-colors"
                >
                  WhatsApp: {BUSINESS_CONFIG.phoneFormatted}
                </a>
              </div>
            </div>

            <div className="pt-3">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold px-4 py-2 rounded-full transition-colors"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright, Privacy & Terms */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500">
          <p>© {currentYear} {BUSINESS_CONFIG.name}. All rights reserved.</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => setActivePolicy('privacy')}
              className="hover:text-neutral-300 transition-colors"
            >
              Privacy Policy
            </button>
            <span>•</span>
            <button
              type="button"
              onClick={() => setActivePolicy('terms')}
              className="hover:text-neutral-300 transition-colors"
            >
              Terms of Service
            </button>
            <span>•</span>
            <div className="flex items-center gap-1.5 text-neutral-400">
              <span>Made with</span>
              <Heart className="w-3 h-3 text-[#DE1B76] fill-[#DE1B76]" />
              <span>in Accra, Ghana</span>
            </div>
          </div>
        </div>

      </div>

      {/* Privacy / Terms Policy Modal */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs"
        >
          <div className="bg-white text-neutral-900 rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
              <h3 className="font-serif text-xl font-bold">
                {activePolicy === 'privacy' ? 'Privacy Policy' : 'Terms of Service'}
              </h3>
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="p-1 rounded-full text-neutral-500 hover:text-neutral-900"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-neutral-600 space-y-2.5 max-h-72 overflow-y-auto leading-relaxed">
              {activePolicy === 'privacy' ? (
                <>
                  <p>
                    <strong>Pearls Culinary Counts</strong> values customer confidentiality. Information provided when creating a customer account or submitting WhatsApp enquiries is utilized solely by our team to coordinate orders and address enquiries in Accra, Ghana.
                  </p>
                  <p>
                    We do not sell or distribute customer contact details to third parties. Customer account authentication is managed securely through Firebase Authentication.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    All bakes, catering packages, and training sessions provided by <strong>Pearls Culinary Counts</strong> are prepared to order. Custom cake requests require advance notification (typically 48–72 hours).
                  </p>
                  <p>
                    Quotes and availability in Accra are confirmed directly via our official WhatsApp line (0552471271).
                  </p>
                </>
              )}
            </div>

            <div className="pt-2 text-right">
              <button
                type="button"
                onClick={() => setActivePolicy(null)}
                className="px-5 py-2 rounded-full bg-[#121214] text-white text-xs font-semibold hover:bg-neutral-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </footer>
  );
};
