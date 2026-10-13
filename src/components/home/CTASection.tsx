import React from 'react';
import { MessageCircle, Phone, MapPin, Sparkles, Clock } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';
import { Button } from '../ui/Button';
import brandFlyerImg from '../../assets/images/brand_flyer_1791881765075.jpg';

interface CTASectionProps {
  onOpenCustomOrder?: () => void;
}

export const CTASection: React.FC<CTASectionProps> = ({ onOpenCustomOrder }) => {
  const whatsappUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I would like to place an order or make an enquiry.'
  );

  return (
    <section
      id="contact-cta"
      aria-label="Contact and Orders"
      className="py-16 lg:py-24 bg-[#121214] text-white relative overflow-hidden"
    >
      {/* Background luxury illumination */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#DE1B76]/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#C5A059]/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          
          {/* Subtle gold badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 border border-[#C5A059]/40 text-xs font-semibold text-[#C5A059]">
            <Sparkles className="w-3.5 h-3.5" />
            <span className="uppercase tracking-widest font-sans">
              Orders • Enquiries • Training
            </span>
          </div>

          {/* Heading & description */}
          <div className="space-y-4">
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Ready to Experience Quality & Elegance?
            </h2>
            <p className="text-neutral-300 text-base sm:text-lg max-w-2xl mx-auto font-light leading-relaxed">
              Connect directly with Pearls Culinary Counts for custom celebration cakes, event catering, culinary masterclass reservations, or selected lifestyle pieces in Accra.
            </p>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              id="cta-whatsapp-btn"
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-semibold px-8 py-4 rounded-full text-base transition-all duration-200 shadow-lg hover:shadow-xl active:scale-[0.98]"
            >
              <MessageCircle className="w-5 h-5 fill-white/20" />
              <span>Order on WhatsApp</span>
            </a>

            <a
              id="cta-phone-btn"
              href={`tel:${BUSINESS_CONFIG.phone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 bg-white/10 hover:bg-white/15 text-white font-medium px-8 py-4 rounded-full text-base transition-all duration-200 border border-white/20"
            >
              <Phone className="w-4 h-4 text-[#DE1B76]" />
              <span>Call: {BUSINESS_CONFIG.phoneFormatted}</span>
            </a>
          </div>

          {/* Practical Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-10 border-t border-white/10 max-w-3xl mx-auto text-left">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <MapPin className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Location
                </p>
                <p className="text-sm font-medium text-white">
                  {BUSINESS_CONFIG.location}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Pickup & delivery options in Accra (confirmed upon order)
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <Clock className="w-5 h-5 text-[#DE1B76] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Direct Line
                </p>
                <p className="text-sm font-medium text-white">
                  {BUSINESS_CONFIG.phoneFormatted}
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Daily responses via WhatsApp
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-white/5 border border-white/5">
              <Sparkles className="w-5 h-5 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-xs uppercase tracking-wider text-neutral-400 font-medium">
                  Custom Orders
                </p>
                <p className="text-sm font-medium text-white">
                  Advance Bookings
                </p>
                <p className="text-xs text-neutral-400 mt-0.5">
                  Book 48 to 72 hours ahead
                </p>
              </div>
            </div>
          </div>

          {/* Brand Flyer Showcase under the contact buttons and info grid */}
          <div className="pt-12 max-w-xl mx-auto">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#C5A059]/40 shadow-2xl bg-neutral-900 group">
              <img
                src={brandFlyerImg}
                alt="Pearls Culinary Counts Brand Flyer & Offerings"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-4 left-4 right-4 text-center">
                <span className="inline-block px-3.5 py-1.5 rounded-full bg-[#DE1B76]/95 text-white text-xs font-semibold tracking-wider uppercase backdrop-blur-xs shadow-lg">
                  Exclusive Brand Showcase
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
