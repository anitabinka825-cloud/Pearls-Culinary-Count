import React from 'react';
import { Sparkles, ArrowRight, MessageCircle, MapPin, Heart } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';
import { Button } from '../ui/Button';
import heroImg from '../../assets/images/hero_culinary_cake_1791882607589.jpg';

interface HeroProps {
  onExploreProducts: () => void;
  onContactClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreProducts,
  onContactClick,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I would like to explore your products or make an enquiry.'
  );

  return (
    <section
      id="hero"
      aria-label="Welcome to Pearls Culinary Counts"
      className="relative bg-white pt-8 pb-16 lg:pt-16 lg:pb-24 overflow-hidden border-b border-neutral-100/80"
    >
      {/* Delicate background illumination - warm, feminine and spacious */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#FDF2F7]/70 rounded-full blur-3xl pointer-events-none -z-10 translate-x-1/3 -translate-y-1/4"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#F8F5EE]/80 rounded-full blur-3xl pointer-events-none -z-10 -translate-x-1/4 translate-y-1/4"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          {/* Left Column: Brand Hero Copy */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Location & Brand Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
              <span className="tracking-widest uppercase font-sans">
                Accra, Ghana
              </span>
              <span className="text-neutral-300">|</span>
              <span className="text-neutral-600 font-normal">
                Modern Ghanaian Culinary & Lifestyle
              </span>
            </div>

            {/* Business Name Heading */}
            <div className="space-y-2">
              <span className="text-xs uppercase tracking-[0.25em] font-semibold text-neutral-500 block">
                Welcome to
              </span>
              <h1
                id="hero-business-name"
                className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#121214] leading-[1.1]"
              >
                PEARLS CULINARY <span className="text-[#DE1B76]">COUNTS</span>
              </h1>
            </div>

            {/* Tagline & Motto */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <span className="h-px w-8 bg-[#C5A059]"></span>
                <p className="font-serif italic text-2xl sm:text-3xl text-neutral-800 font-medium tracking-wide">
                  {BUSINESS_CONFIG.tagline}
                </p>
              </div>
              <p className="text-base sm:text-lg font-medium text-neutral-700 tracking-wide">
                {BUSINESS_CONFIG.motto}
              </p>
            </div>

            {/* Narrative */}
            <p className="text-neutral-600 text-base sm:text-lg leading-relaxed max-w-xl font-light">
              We specialize in custom celebration cakes, delicate pastries, artisanal bread, savory food, full-service catering, practical culinary training, and selected lifestyle products in Accra.
            </p>

            {/* CTAs */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Button
                variant="secondary"
                size="lg"
                onClick={onExploreProducts}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Our Products
              </Button>

              <a
                id="hero-contact-btn"
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-medium px-7 py-3.5 rounded-full text-base transition-all duration-200 shadow-xs hover:shadow-md active:scale-[0.98] text-center"
              >
                <MessageCircle className="w-5 h-5 fill-white/20" />
                <span>Contact Us</span>
              </a>
            </div>

            {/* Trust notes - authentic to Ghana */}
            <div className="pt-4 flex flex-wrap items-center gap-y-2 gap-x-6 text-xs text-neutral-600 border-t border-neutral-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                <span>Pickup & Delivery in Accra</span>
              </div>
              <span className="text-neutral-300">•</span>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Direct WhatsApp: {BUSINESS_CONFIG.phoneFormatted}</span>
              </div>
            </div>

          </div>

          {/* Right Column: Visual Presentation Area */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              
              {/* Subtle gold accent perimeter frame */}
              <div className="absolute -inset-2.5 rounded-3xl border border-[#C5A059]/30 -rotate-1 pointer-events-none"></div>

              {/* Main Image Frame */}
              <div className="relative rounded-2xl overflow-hidden shadow-xl bg-neutral-100 aspect-4/5">
                <img
                  src={heroImg}
                  alt="Pearls Culinary Counts - Handcrafted celebration cake and gourmet confectionery"
                  className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700 ease-out"
                  loading="eager"
                  referrerPolicy="no-referrer"
                />

                {/* Subtle vignette overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-transparent to-transparent pointer-events-none"></div>

                {/* Bottom Card */}
                <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-white/95 backdrop-blur-md shadow-md border border-neutral-100 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold">
                      Handcrafted with care
                    </p>
                    <p className="font-serif text-sm font-bold text-neutral-900">
                      Bespoke Cakes & Pastries
                    </p>
                  </div>
                  <span className="inline-block px-2.5 py-1 rounded-md bg-[#FDF2F7] text-[#DE1B76] text-xs font-semibold">
                    Accra, Ghana
                  </span>
                </div>
              </div>

              {/* Floating Badge */}
              <div className="absolute -top-3 -right-2 sm:-right-4 bg-white px-3.5 py-2 rounded-xl shadow-md border border-neutral-100 flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#DE1B76] animate-pulse"></div>
                <span className="text-xs font-medium text-neutral-800">
                  Baked to Order
                </span>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
