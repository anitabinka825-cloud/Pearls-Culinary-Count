import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { Utensils, Sparkles, Users } from 'lucide-react';
import { Button } from '../ui/Button';

interface FoodViewProps {
  onViewProduct: (product: Product) => void;
  onOpenCustomOrder: (prefillProduct?: string) => void;
}

export const FoodView: React.FC<FoodViewProps> = ({
  onViewProduct,
  onOpenCustomOrder,
}) => {
  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Hero Banner */}
        <div className="rounded-3xl bg-[#121214] text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute right-0 top-0 w-80 h-80 bg-[#C5A059]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider">
              <Utensils className="w-3.5 h-3.5" />
              <span>Savory Cuisine & Catering</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Ghanaian Gourmet Food & Event Catering
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              From flavorful Ghanaian party Jollof and fried rice to tender grilled meats, small chops platters, and catering setups in Accra.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Button
                variant="primary"
                size="md"
                onClick={() => onOpenCustomOrder('Event Catering Package')}
              >
                Enquire for Catering
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Utensils className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Authentic Flavors
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Smoky party Jollof rice, seasoned roasted meats, kelewele, and flavorful continental sides.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Users className="w-5 h-5 text-[#C5A059]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Any Gathering Size
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Family celebrations, bridal showers, corporate luncheons, and large weddings in Accra.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-neutral-50 border border-neutral-100 space-y-2">
            <Sparkles className="w-5 h-5 text-[#DE1B76]" />
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Buffet & Event Presentation
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Thoughtful food presentation, chafing dishes, and coordinated delivery arrangements in Accra.
            </p>
          </div>
        </div>

        {/* Food Products Grid */}
        <div className="pt-4">
          <ProductGrid
            initialCategory="food"
            onViewProduct={onViewProduct}
            showFilters={true}
          />
        </div>

      </div>
    </div>
  );
};
