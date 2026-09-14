import React from 'react';
import { Sparkles, MessageSquare, ArrowRight, HeartHandshake } from 'lucide-react';
import { Button } from '../ui/Button';

interface CustomOrderSectionProps {
  onOpenEnquiry: () => void;
}

export const CustomOrderSection: React.FC<CustomOrderSectionProps> = ({
  onOpenEnquiry,
}) => {
  return (
    <section
      id="custom-orders"
      aria-label="Custom Orders and Bespoke Requests"
      className="py-16 lg:py-24 bg-white border-b border-neutral-100 relative overflow-hidden"
    >
      {/* Background accents */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-72 h-72 bg-[#FDF2F7]/80 rounded-full blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 right-0 -translate-y-1/2 w-72 h-72 bg-[#F8F5EE]/80 rounded-full blur-3xl pointer-events-none -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto bg-neutral-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 relative shadow-xl overflow-hidden">
          
          {/* Subtle gold luxury line accent */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#DE1B76] via-[#C5A059] to-[#DE1B76]"></div>

          <div className="text-center space-y-6 relative z-10">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Creations</span>
            </div>

            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-white leading-tight">
              Have something special in mind?
            </h2>

            <p className="text-neutral-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto font-light">
              Whether you envision a multi-tiered wedding centerpiece, customized corporate party pastries, curated Ghanaian dining platters, or personalized gift hampers — we translate your vision with precision and artistry.
            </p>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                variant="primary"
                size="lg"
                onClick={onOpenEnquiry}
                icon={<MessageSquare className="w-4 h-4" />}
              >
                Make an Enquiry
              </Button>
            </div>

            <div className="pt-6 border-t border-white/10 flex flex-wrap items-center justify-center gap-6 text-xs text-neutral-400">
              <span>Bespoke Cakes</span>
              <span>•</span>
              <span>Custom Flavors & Themes</span>
              <span>•</span>
              <span>Delivery Across Accra</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
