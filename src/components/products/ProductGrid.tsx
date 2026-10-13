import React, { useState, useMemo } from 'react';
import {
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
  ArrowUpDown,
  Filter,
} from 'lucide-react';
import {
  Product,
  ProductCategory,
  ProductSortOption,
  ProductAvailability,
} from '../../types';
import { productRepository } from '../../services/productRepository';
import { ProductCard } from './ProductCard';
import { EmptyState } from '../ui/EmptyState';

interface ProductGridProps {
  products?: Product[];
  onViewProduct: (product: Product) => void;
  title?: string;
  subtitle?: string;
  initialCategory?: ProductCategory | string;
  initialSubcategory?: string;
  showFilters?: boolean;
}

export const ProductGrid: React.FC<ProductGridProps> = ({
  products: initialProducts,
  onViewProduct,
  title,
  subtitle,
  initialCategory = 'all',
  initialSubcategory = 'all',
  showFilters = true,
}) => {
  const [selectedCategory, setSelectedCategory] =
    useState<string>(initialCategory);
  const [selectedSubcategory, setSelectedSubcategory] =
    useState<string>(initialSubcategory);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSort, setSelectedSort] =
    useState<ProductSortOption>('featured');
  const [selectedAvailability, setSelectedAvailability] = useState<
    ProductAvailability | 'ALL'
  >('ALL');

  // Synchronize internal category/subcategory state if props change (e.g. route transitions)
  React.useEffect(() => {
    setSelectedCategory(initialCategory);
    setSelectedSubcategory(initialSubcategory);
  }, [initialCategory, initialSubcategory]);

  // Categories list: if initialProducts is provided, derive relevant categories or include top-level categories
  const categories = useMemo(() => {
    const top = productRepository.getTopLevelCategories();
    return [{ id: 'all', name: 'All Offerings', slug: 'all' }, ...top];
  }, []);

  // Available subcategories for currently active category
  const availableSubcategories = useMemo(() => {
    if (selectedCategory === 'all') return [];
    return productRepository.getSubcategories(selectedCategory);
  }, [selectedCategory]);

  // Query, filter, and sort products using the repository with optional external source array
  const filteredProducts = useMemo(() => {
    return productRepository.getProducts(
      {
        categoryId: selectedCategory === 'all' ? undefined : selectedCategory,
        subcategoryId:
          selectedSubcategory === 'all' ? undefined : selectedSubcategory,
        availability:
          selectedAvailability === 'ALL' ? undefined : selectedAvailability,
        searchQuery: searchQuery.trim() || undefined,
        sort: selectedSort,
      },
      initialProducts
    );
  }, [
    initialProducts,
    selectedCategory,
    selectedSubcategory,
    selectedAvailability,
    searchQuery,
    selectedSort,
  ]);

  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setSelectedSubcategory('all');
  };

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedSubcategory('all');
    setSearchQuery('');
    setSelectedSort('featured');
    setSelectedAvailability('ALL');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' ||
    selectedSubcategory !== 'all' ||
    searchQuery.trim() !== '' ||
    selectedAvailability !== 'ALL' ||
    selectedSort !== 'featured';

  return (
    <div className="space-y-6">
      {/* Optional Section Title */}
      {(title || subtitle) && (
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            {title && (
              <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#121214]">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-neutral-600 text-sm mt-1 max-w-2xl leading-relaxed">
                {subtitle}
              </p>
            )}
          </div>
          <span className="text-xs font-serif italic text-[#C5A059] flex-shrink-0">
            Showing {filteredProducts.length}{' '}
            {filteredProducts.length === 1 ? 'offering' : 'curated offerings'}
          </span>
        </div>
      )}

      {/* Filter & Search Bar */}
      {showFilters && (
        <div className="space-y-4 pt-2">
          {/* Top Row: Search Input, Sorting, and Availability Filter */}
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Box */}
            <div className="relative flex-1 max-w-md">
              <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search cakes, pastries, loaves, catering..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 text-xs bg-neutral-50 hover:bg-neutral-100/70 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] focus:bg-white transition-all duration-200"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  aria-label="Clear search"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700 p-0.5"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Sort & Availability Controls */}
            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Availability Filter */}
              <div className="flex items-center gap-1 bg-neutral-50 p-1 rounded-xl border border-neutral-200 text-xs">
                <button
                  type="button"
                  onClick={() => setSelectedAvailability('ALL')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedAvailability === 'ALL'
                      ? 'bg-white text-neutral-900 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  All
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAvailability('IN_STOCK')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedAvailability === 'IN_STOCK'
                      ? 'bg-white text-emerald-700 shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  In Stock
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedAvailability('MADE_TO_ORDER')}
                  className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                    selectedAvailability === 'MADE_TO_ORDER'
                      ? 'bg-white text-[#DE1B76] shadow-2xs font-semibold'
                      : 'text-neutral-600 hover:text-neutral-900'
                  }`}
                >
                  Made to Order
                </button>
              </div>

              {/* Sort Dropdown */}
              <div className="relative flex items-center">
                <ArrowUpDown className="w-3.5 h-3.5 text-neutral-500 absolute left-3 pointer-events-none" />
                <select
                  aria-label="Sort products by"
                  value={selectedSort}
                  onChange={(e) =>
                    setSelectedSort(e.target.value as ProductSortOption)
                  }
                  className="pl-8 pr-8 py-2 text-xs bg-neutral-50 hover:bg-neutral-100 border border-neutral-200 rounded-xl focus:outline-none focus:border-[#DE1B76] text-neutral-800 font-medium appearance-none cursor-pointer"
                >
                  <option value="featured">Featured First</option>
                  <option value="newest">Newest Additions</option>
                  <option value="price_asc">Price: Low to High</option>
                  <option value="price_desc">Price: High to Low</option>
                  <option value="name_asc">Alphabetical (A - Z)</option>
                </select>
              </div>

              {hasActiveFilters && (
                <button
                  type="button"
                  onClick={handleResetFilters}
                  className="text-xs text-neutral-500 hover:text-[#DE1B76] underline font-medium px-1"
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryChange(cat.id)}
                className={`text-xs font-semibold px-4 py-2 rounded-full whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-[#121214] text-white shadow-xs'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200/80 hover:text-neutral-900'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Subcategory Filter Chips (shown when a specific category with subcategories is chosen) */}
          {availableSubcategories.length > 0 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-1 pt-1 scrollbar-none">
              <span className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider pl-1">
                Subcategories:
              </span>
              <button
                type="button"
                onClick={() => setSelectedSubcategory('all')}
                className={`text-[11px] font-medium px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                  selectedSubcategory === 'all'
                    ? 'bg-[#DE1B76] text-white shadow-2xs font-semibold'
                    : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                }`}
              >
                All {categories.find((c) => c.id === selectedCategory)?.name}
              </button>
              {availableSubcategories.map((sub) => (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubcategory(sub.id)}
                  className={`text-[11px] font-medium px-3 py-1 rounded-lg transition-colors whitespace-nowrap ${
                    selectedSubcategory === sub.id
                      ? 'bg-[#DE1B76] text-white shadow-2xs font-semibold'
                      : 'bg-neutral-50 border border-neutral-200 text-neutral-600 hover:bg-neutral-100'
                  }`}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
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
          title="No matching offerings found"
          description={
            searchQuery
              ? `No offerings matched "${searchQuery}". Try adjusting your keywords or clearing the search filter.`
              : 'No items currently match the selected criteria in this category.'
          }
          actionText="Reset All Filters"
          onAction={handleResetFilters}
        />
      )}
    </div>
  );
};
