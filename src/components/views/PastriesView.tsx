import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { Sparkles, Cookie, Coffee, ShieldCheck } from 'lucide-react';
import { Button } from '../ui/Button';

interface PastriesViewProps {
  onViewProduct: (product: Product) => void;
  onOpenCustomOrder: (prefillProduct?: string) => void;
}

export const PastriesView: React.FC<PastriesViewProps> = ({
  onViewProduct,
  onOpenCustomOrder,
}) => {
  const pastriesProducts = ALL_PRODUCTS.filter(
    (p) => p.category === 'pastries' || p.category === 'bread'
  );

  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Banner */}
        <div className="rounded-3xl bg-[#FDF2F7] border border-[#F9A8D4]/40 p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="max-w-2xl space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-[#DE1B76] text-xs font-semibold uppercase tracking-wider border border-[#F9A8D4]/50">
              <Cookie className="w-3.5 h-3.5" />
              <span>Prepared with Care</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-[#121214] leading-tight">
              Gourmet Pastries & Artisanal Bread
            </h1>

            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
              From buttery croissants and delicate fruit tarts to Ghanaian meat pies, spring rolls, and soft brioche loaves. Ideal for family breakfasts, office meetings, and special gifting in Accra.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenCustomOrder('Gourmet Pastry Box')}
              >
                Order Pastry Box
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Trio */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Coffee className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Event Breakfasts & Tea
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Curated corporate brunch platters, morning meeting finger foods, and tea party spreads.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Sparkles className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Laminated Pastry Craft
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Flaky layers, pure dairy butter, and authentic slow-proofing methods.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <ShieldCheck className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Made to Order
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Baked thoughtfully for orders and events in Accra with quality ingredients and artisanal care.
            </p>
          </div>
        </div>

        {/* Product Grid */}
        <div className="pt-4">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-neutral-900 mb-6">
            Explore Pastries & Bread
          </h2>
          <ProductGrid
            products={pastriesProducts}
            onViewProduct={onViewProduct}
            showFilters={false}
          />
        </div>

      </div>
    </div>
  );
};
