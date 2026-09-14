import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal, Sparkles } from 'lucide-react';
import { Product, ProductCategory } from '../../types';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';

interface ProductGridProps {
  products: Product[];
  onViewProduct: (product: Product) => void;
  title?: string;
  subtitle?: string;
  initialCategory?: ProductCategory | 'all';
  showFilters?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products,
  onViewProduct,
  title,
  subtitle,
  initialCategory = 'all',
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'cakes', label: 'Cakes' },
    { id: 'pastries', label: 'Pastries' },
    { id: 'bread', label: 'Bread' },
    { id: 'food', label: 'Food' },
    { id: 'catering', label: 'Catering' },
    { id: 'training', label: 'Training' },
    { id: 'lifestyle', label: 'Lifestyle' },
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((item) => {
      const matchesCategory =
        selectedCategory === 'all' || item.category === selectedCategory;
      const matchesSearch =
        searchQuery.trim() === '' ||
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.tags &&
          item.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase())));
      return matchesCategory && matchesSearch;
    });
  }, [products, selectedCategory, searchQuery]);

  return (
    <div className="space-y-8">
      {/* Optional Title */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#121214]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-neutral-600 text-sm mt-1 max-w-xl">
                {subtitle}
              </p>
            )}
          </div>
          <span className="text-xs font-serif italic text-[#C5A059] flex-shrink-0">
            Showing {filteredProducts.length} curated offerings
          </span>
        </div>
      )}

      {/* Filter & Search Bar */}
      {showFilters && (
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pt-2">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-[#121214] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[220px] max-w-xs">
            <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search offerings..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3.5 py-1.5 text-xs bg-neutral-50 border border-neutral-200 rounded-full focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-colors"
            />
          </div>
        </div>
      )}

      {/* Grid of Product Cards */}
      {filteredProducts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onViewDetails={onViewProduct}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title="No matching offerings"
          description={`No products found under "${selectedCategory}" matching "${searchQuery}". Clear your search or browse our full catalogue.`}
          actionText="Reset Filters"
          onAction={() => {
            setSelectedCategory('all');
            setSearchQuery('');
          }}
        />
      )}
    </div>
  );
};
