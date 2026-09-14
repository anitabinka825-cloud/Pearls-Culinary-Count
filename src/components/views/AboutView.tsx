import React from 'react';
import { Sparkles, MapPin, Heart, ShieldCheck, ArrowRight } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';
import { Button } from '../ui/Button';

interface AboutViewProps {
  onNavigateShop: () => void;
  onNavigateContact: () => void;
}

export const AboutView: React.FC<AboutViewProps> = ({
  onNavigateShop,
  onNavigateContact,
}) => {
  return (
    <div className="py-12 lg:py-20 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Story Banner */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              <span>Our Story & Vision</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#121214] leading-tight">
              Quality & Elegance in Every Culinary Expression
            </h1>

            <div className="space-y-4 text-neutral-600 text-sm sm:text-base leading-relaxed font-light">
              <p>
                <strong>{BUSINESS_CONFIG.name}</strong> is a modern Ghanaian culinary and lifestyle business founded in Accra, Ghana. We are built on the foundational belief that great food and elegant living belong together.
              </p>
              <p>
                Our philosophy — <em>"{BUSINESS_CONFIG.motto}"</em> — guides every aspect of what we create. From bespoke wedding cakes and delicate morning pastries to traditional Ghanaian savory feasts and practical culinary training masterclasses, we bring dedication, refinement, and genuine warmth to every project.
              </p>
              <p>
                Beyond the kitchen, Pearls extends into curated lifestyle essentials — featuring tasteful bags, sparkling jewellery, and signature fragrances chosen to complement an elegant modern lifestyle.
              </p>
            </div>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={onNavigateShop}
                icon={<ArrowRight className="w-4 h-4" />}
              >
                Explore Offerings
              </Button>
              <Button
                variant="outline"
                size="md"
                onClick={onNavigateContact}
              >
                Get in Touch
              </Button>
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl aspect-4/5 bg-neutral-100 border border-neutral-100">
              <img
                src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?q=80&w=1200&auto=format&fit=crop"
                alt="Pearls Culinary Counts - Culinary artistry and baking studio in Accra"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
              <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-white/95 backdrop-blur-xs border border-white/80">
                <p className="font-serif font-bold text-neutral-900 text-base">
                  Pearls Culinary Counts
                </p>
                <p className="text-xs text-neutral-600 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Accra, Ghana</span>
                </p>
              </div>
            </div>
          </div>

        </div>

        {/* Core Pillars */}
        <div className="pt-8 border-t border-neutral-100">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121214]">
              What Guides Our Standards
            </h2>
            <p className="text-xs sm:text-sm text-neutral-600">
              Upholding culinary integrity and gracious customer care in Accra.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DE1B76] shadow-2xs">
                <Heart className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-neutral-900 text-xl">
                Artisanal Integrity
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                We prepare all bakes and dishes using real ingredients, consistent kitchen methods, and respect for our customers' milestones.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C5A059] shadow-2xs">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-neutral-900 text-xl">
                Modern Ghanaian Identity
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Proudly Ghanaian with an internationally presentable standard of presentation, flavor balance, and hospitality.
              </p>
            </div>

            <div className="p-8 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DE1B76] shadow-2xs">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-neutral-900 text-xl">
                Lifestyle Harmony
              </h3>
              <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                Seamlessly pairing culinary excellence with selected bags, jewellery, and perfumes to create holistic gifting experiences.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
