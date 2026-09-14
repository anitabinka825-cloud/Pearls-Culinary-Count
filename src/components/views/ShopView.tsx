import React from 'react';
import { ProductGrid } from '../products/ProductGrid';
import { SectionHeading } from '../ui/SectionHeading';
import { ALL_PRODUCTS } from '../../data/products';
import { Product } from '../../types';
import { MessageCircle, Sparkles } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';

interface ShopViewProps {
  onViewProduct: (product: Product) => void;
  onOpenCustomOrder: (prefillProduct?: string) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  onViewProduct,
  onOpenCustomOrder,
}) => {
  const whatsappUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I am exploring your shop catalogue and would like to place an order.'
  );

  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Page Header */}
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>Pearls Catalogue</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#121214] tracking-tight">
            Curated Culinary & Lifestyle Catalogue
          </h1>

          <p className="text-neutral-600 text-sm sm:text-base leading-relaxed">
            Browse our signature celebration cakes, artisan pastries, fresh bread, savory Ghanaian cuisine, catering setups, culinary training modules, and selected lifestyle accessories in Accra.
          </p>
        </div>

        {/* Product Grid with Filters */}
        <ProductGrid
          products={ALL_PRODUCTS}
          onViewProduct={onViewProduct}
          showFilters={true}
        />

        {/* Custom Order Callout */}
        <div className="mt-16 p-8 rounded-3xl bg-neutral-50 border border-neutral-200/70 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <h3 className="font-serif text-xl font-bold text-neutral-900">
              Need a custom cake size, catering menu, or gift hamper?
            </h3>
            <p className="text-xs sm:text-sm text-neutral-600">
              We specialize in custom creations tailored to your exact party size, flavor choices, and budget.
            </p>
          </div>

          <div className="flex items-center gap-3 flex-shrink-0">
            <button
              type="button"
              onClick={() => onOpenCustomOrder()}
              className="px-6 py-2.5 rounded-full bg-[#121214] text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
            >
              Request Custom Order
            </button>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-5 py-2.5 rounded-full bg-[#DE1B76] text-white text-xs font-semibold hover:bg-[#B8125C] transition-colors flex items-center gap-1.5"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

      </div>
    </div>
  );
};
