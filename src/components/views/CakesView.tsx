import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { Sparkles, Heart, Clock, Cake } from 'lucide-react';
import { Button } from '../ui/Button';

interface CakesViewProps {
  onViewProduct: (product: Product) => void;
  onOpenCustomOrder: (prefillProduct?: string) => void;
}

export const CakesView: React.FC<CakesViewProps> = ({
  onViewProduct,
  onOpenCustomOrder,
}) => {
  const cakeProducts = ALL_PRODUCTS.filter(
    (p) => p.category === 'cakes' || p.category === 'pastries'
  );

  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Cakes Hero Banner */}
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-[#DE1B76]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider">
              <Cake className="w-3.5 h-3.5" />
              <span>Bespoke Confectionery</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Artisan Cakes & Celebration Tiers
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Crafted in Accra with delicate sponges, silky buttercreams, and stunning sugar craft. Every celebration cake is customized to your preferred theme, flavor profile, and inscription.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenCustomOrder('Custom Celebration Cake')}
              >
                Order Custom Cake
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FDF2F7]/50 border border-[#F9A8D4]/30 space-y-2">
            <Sparkles className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Custom Themes & Fondant
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Tailored color palettes, fresh florals, gold leaf accents, and personalized inscriptions for milestones.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Heart className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Wholesome Flavors
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Vanilla velvet, decadent chocolate truffle, red velvet, salted caramel, and exotic fruit compotes.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#F8F5EE]/60 border border-[#C5A059]/30 space-y-2">
            <Clock className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Advance Booking
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              We recommend 48 to 72 hours notice for celebration cakes to ensure optimal perfection.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            Featured Cakes & Pastry Selections
          </h2>
          <ProductGrid
            products={cakeProducts}
            onViewProduct={onViewProduct}
            showFilters={false}
          />
        </div>

      </div>
    </div>
  );
};
