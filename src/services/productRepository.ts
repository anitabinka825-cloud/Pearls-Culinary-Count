/**
 * Pearls Culinary Counts — Stage 2A Product Data Access Layer
 *
 * Provides decoupled, reusable data querying, filtering, sorting,
 * and price formatting methods. Designed to be easily migrated to
 * an asynchronous API/PostgreSQL client in subsequent stages.
 */

import {
  Product,
  Category,
  ProductFilterOptions,
  ProductVariant,
  ProductSortOption,
} from '../types';
import { SAMPLE_PRODUCTS } from '../data/products';
import { ALL_CATEGORIES, TOP_LEVEL_CATEGORIES } from '../data/categories';

export interface IProductRepository {
  getProducts(filters?: ProductFilterOptions, sourceProducts?: Product[]): Product[];
  getProductById(id: string): Product | undefined;
  getProductBySlug(slug: string): Product | undefined;
  getProductByIdOrSlug(idOrSlug: string): Product | undefined;
  getProductsByCategory(categoryId: string, subcategoryId?: string): Product[];
  searchProducts(query: string, options?: { categoryId?: string }): Product[];
  getFeaturedProducts(limit?: number): Product[];
  getCategories(): Category[];
  getTopLevelCategories(): Category[];
  getSubcategories(parentCategoryId: string): Category[];
  getCategoryBySlug(slug: string): Category | undefined;
  formatProductPrice(
    product: Product,
    selectedVariant?: ProductVariant | null
  ): string;
  validateCatalogData(): { isValid: boolean; errors: string[] };
}

export class LocalProductRepository implements IProductRepository {
  private products: Product[];
  private categories: Category[];

  constructor(products: Product[] = SAMPLE_PRODUCTS, categories: Category[] = ALL_CATEGORIES) {
    this.products = products;
    this.categories = categories;
  }

  /**
   * Retrieves products with optional filtering and sorting.
   * If sourceProducts is provided, filters against that array;
   * otherwise queries the authoritative repository catalogue.
   */
  public getProducts(
    filters?: ProductFilterOptions,
    sourceProducts?: Product[]
  ): Product[] {
    let result = Array.isArray(sourceProducts)
      ? [...sourceProducts]
      : [...this.products];

    if (!filters) {
      return result;
    }

    const {
      categoryId,
      subcategoryId,
      availability,
      madeToOrder,
      customizable,
      featured,
      searchQuery,
      sort,
    } = filters;

    // Filter by Category (supports matching categoryId or category string)
    if (categoryId && categoryId !== 'all') {
      const targetCat = categoryId.toLowerCase();
      result = result.filter(
        (p) =>
          p.categoryId.toLowerCase() === targetCat ||
          p.category.toLowerCase() === targetCat
      );
    }

    // Filter by Subcategory
    if (subcategoryId && subcategoryId !== 'all') {
      const targetSub = subcategoryId.toLowerCase();
      result = result.filter(
        (p) => p.subcategoryId && p.subcategoryId.toLowerCase() === targetSub
      );
    }

    // Filter by Availability
    if (availability && availability !== 'ALL') {
      result = result.filter((p) => p.availability === availability);
    }

    // Filter by Made to Order
    if (typeof madeToOrder === 'boolean') {
      result = result.filter((p) => Boolean(p.madeToOrder) === madeToOrder);
    }

    // Filter by Customizable
    if (typeof customizable === 'boolean') {
      result = result.filter((p) => Boolean(p.customizable) === customizable);
    }

    // Filter by Featured
    if (typeof featured === 'boolean') {
      result = result.filter((p) => Boolean(p.featured) === featured);
    }

    // Search Query Filter
    if (searchQuery && searchQuery.trim() !== '') {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter((p) => {
        const inName = p.name.toLowerCase().includes(q);
        const inDesc = p.description.toLowerCase().includes(q);
        const inShortDesc = p.shortDescription?.toLowerCase().includes(q) ?? false;
        const inCat =
          p.categoryName.toLowerCase().includes(q) ||
          p.categoryId.toLowerCase().includes(q);
        const inTags = p.tags?.some((t) => t.toLowerCase().includes(q)) ?? false;
        const inSpecs =
          p.specifications?.some(
            (s) =>
              s.label.toLowerCase().includes(q) ||
              s.value.toLowerCase().includes(q)
          ) ?? false;

        return inName || inDesc || inShortDesc || inCat || inTags || inSpecs;
      });
    }

    // Apply Sorting
    if (sort) {
      result = this.sortProducts(result, sort);
    }

    return result;
  }

  /**
   * Sorts product list based on given criteria without crashing on non-numeric prices.
   * Products with PRICE_ON_ENQUIRY consistently rank at the end of price sorts.
   */
  private sortProducts(products: Product[], sort: ProductSortOption): Product[] {
    const list = [...products];

    const hasNumericPrice = (p: Product): boolean => {
      if (p.pricingType === 'PRICE_ON_ENQUIRY') return false;
      if (typeof p.price === 'number' && !isNaN(p.price)) return true;
      if (typeof p.priceNumeric === 'number' && !isNaN(p.priceNumeric)) return true;
      if (p.variants && p.variants.length > 0) {
        return p.variants.some((v) => typeof v.price === 'number' && !isNaN(v.price));
      }
      const parsed = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
      return !isNaN(parsed) && parsed > 0;
    };

    const getPriceNumber = (p: Product): number => {
      if (typeof p.price === 'number' && !isNaN(p.price)) {
        return p.price;
      }
      if (p.variants && p.variants.length > 0) {
        const variantPrices = p.variants
          .map((v) => v.price)
          .filter((v): v is number => typeof v === 'number' && !isNaN(v));
        if (variantPrices.length > 0) {
          return Math.min(...variantPrices);
        }
      }
      if (typeof p.priceNumeric === 'number' && !isNaN(p.priceNumeric)) {
        return p.priceNumeric;
      }
      const parsed = parseFloat(String(p.price).replace(/[^0-9.]/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    };

    switch (sort) {
      case 'featured':
        return list.sort((a, b) => {
          if (a.featured && !b.featured) return -1;
          if (!a.featured && b.featured) return 1;
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        });

      case 'newest':
        return list.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

      case 'price_asc':
        return list.sort((a, b) => {
          const aHas = hasNumericPrice(a);
          const bHas = hasNumericPrice(b);
          if (!aHas && !bHas) return 0;
          if (!aHas) return 1; // enquiry/unknown prices to the end
          if (!bHas) return -1;

          return getPriceNumber(a) - getPriceNumber(b);
        });

      case 'price_desc':
        return list.sort((a, b) => {
          const aHas = hasNumericPrice(a);
          const bHas = hasNumericPrice(b);
          if (!aHas && !bHas) return 0;
          if (!aHas) return 1; // enquiry/unknown prices to the end
          if (!bHas) return -1;

          return getPriceNumber(b) - getPriceNumber(a);
        });

      case 'name_asc':
        return list.sort((a, b) => a.name.localeCompare(b.name));

      default:
        return list;
    }
  }

  public getProductById(id: string): Product | undefined {
    return this.products.find((p) => p.id === id);
  }

  public getProductBySlug(slug: string): Product | undefined {
    return this.products.find((p) => p.slug === slug);
  }

  /**
   * Universal resolver supporting both new slugs and legacy IDs
   */
  public getProductByIdOrSlug(idOrSlug: string): Product | undefined {
    return (
      this.products.find((p) => p.slug === idOrSlug) ||
      this.products.find((p) => p.id === idOrSlug)
    );
  }

  public getProductsByCategory(
    categoryId: string,
    subcategoryId?: string
  ): Product[] {
    return this.getProducts({ categoryId, subcategoryId });
  }

  public searchProducts(
    query: string,
    options?: { categoryId?: string }
  ): Product[] {
    return this.getProducts({
      searchQuery: query,
      categoryId: options?.categoryId,
    });
  }

  public getFeaturedProducts(limit: number = 4): Product[] {
    const featured = this.products.filter((p) => p.featured);
    return featured.slice(0, limit);
  }

  public getCategories(): Category[] {
    return this.categories;
  }

  public getTopLevelCategories(): Category[] {
    return TOP_LEVEL_CATEGORIES;
  }

  public getSubcategories(parentCategoryId: string): Category[] {
    return this.categories.filter(
      (c) => c.parentCategoryId === parentCategoryId && c.active
    );
  }

  public getCategoryBySlug(slug: string): Category | undefined {
    return this.categories.find((c) => c.slug === slug);
  }

  /**
   * Formats product pricing for display with support for variant selection,
   * FROM_PRICE, FIXED_PRICE, and PRICE_ON_ENQUIRY models.
   */
  public formatProductPrice(
    product: Product,
    selectedVariant?: ProductVariant | null
  ): string {
    const currency = product.currency || 'GH₵';

    // 1. If an explicit variant with price is selected
    if (selectedVariant && typeof selectedVariant.price === 'number') {
      const formatted =
        selectedVariant.price % 1 === 0
          ? `${selectedVariant.price}`
          : selectedVariant.price.toFixed(2);
      return `${currency} ${formatted}`;
    }

    // 2. Fixed Price model
    if (product.pricingType === 'FIXED_PRICE') {
      if (typeof product.price === 'number') {
        const formatted =
          product.price % 1 === 0 ? `${product.price}` : product.price.toFixed(2);
        return `${currency} ${formatted}`;
      }
      return String(product.priceFormatted || product.price);
    }

    // 3. From Price model
    if (product.pricingType === 'FROM_PRICE') {
      const base =
        typeof product.price === 'number'
          ? product.price
          : product.priceNumeric || 0;
      return `From ${currency} ${base}`;
    }

    // 4. Price on Enquiry model
    if (product.pricingType === 'PRICE_ON_ENQUIRY') {
      return 'Price on enquiry';
    }

    // 5. Variant Pricing model (default view when no variant picked yet)
    if (product.pricingType === 'VARIANT_PRICING') {
      if (product.variants && product.variants.length > 0) {
        const prices = product.variants
          .map((v) => v.price)
          .filter((p): p is number => typeof p === 'number');
        if (prices.length > 0) {
          const minPrice = Math.min(...prices);
          const maxPrice = Math.max(...prices);
          if (minPrice === maxPrice) {
            return `${currency} ${minPrice}`;
          }
          return `From ${currency} ${minPrice}`;
        }
      }
      if (typeof product.price === 'number') {
        return `From ${currency} ${product.price}`;
      }
      return 'Price on enquiry';
    }

    return String(product.priceFormatted || product.price);
  }

  /**
   * Stage 2A catalog validation helper to ensure data hygiene
   */
  public validateCatalogData(): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    const idSet = new Set<string>();
    const slugSet = new Set<string>();
    const skuSet = new Set<string>();
    const variantIdSet = new Set<string>();
    const validCategoryIds = new Set(this.categories.map((c) => c.id));
    const validSubcategoryIds = new Set(
      this.categories.filter((c) => c.parentCategoryId !== null).map((c) => c.id)
    );

    const validAvailabilities = new Set([
      'IN_STOCK',
      'OUT_OF_STOCK',
      'MADE_TO_ORDER',
      'AVAILABLE_ON_ENQUIRY',
      'DISCONTINUED',
    ]);

    const validPricingTypes = new Set([
      'FIXED_PRICE',
      'FROM_PRICE',
      'PRICE_ON_ENQUIRY',
      'VARIANT_PRICING',
    ]);

    this.products.forEach((p, idx) => {
      const productIdentifier = p.name ? `"${p.name}" (${p.id || idx})` : `at index ${idx}`;

      // 1. Check ID uniqueness & presence
      if (!p.id || typeof p.id !== 'string' || p.id.trim() === '') {
        errors.push(`Product ${productIdentifier} is missing an ID.`);
      } else if (idSet.has(p.id)) {
        errors.push(`Duplicate product ID found: "${p.id}".`);
      } else {
        idSet.add(p.id);
      }

      // 2. Check Slug uniqueness & presence
      if (!p.slug || typeof p.slug !== 'string' || p.slug.trim() === '') {
        errors.push(`Product ${productIdentifier} is missing a slug.`);
      } else if (slugSet.has(p.slug)) {
        errors.push(`Duplicate product slug found: "${p.slug}".`);
      } else {
        slugSet.add(p.slug);
      }

      // 3. Check Name & Description presence
      if (!p.name || typeof p.name !== 'string' || p.name.trim() === '') {
        errors.push(`Product ${productIdentifier} is missing a name.`);
      }
      if (!p.description || typeof p.description !== 'string' || p.description.trim() === '') {
        errors.push(`Product ${productIdentifier} is missing a description.`);
      }

      // 4. Check Currency
      if (!p.currency || typeof p.currency !== 'string' || p.currency.trim() === '') {
        errors.push(`Product ${productIdentifier} is missing a valid currency.`);
      }

      // 5. Check Category reference & active state
      if (!p.categoryId) {
        errors.push(`Product ${productIdentifier} is missing a categoryId.`);
      } else if (!validCategoryIds.has(p.categoryId)) {
        errors.push(
          `Product ${productIdentifier} references non-existent category: "${p.categoryId}".`
        );
      } else {
        const categoryObj = this.categories.find((c) => c.id === p.categoryId);
        if (categoryObj && !categoryObj.active) {
          errors.push(
            `Product ${productIdentifier} references inactive category: "${p.categoryId}".`
          );
        }
      }

      // 6. Check Subcategory reference if provided
      if (p.subcategoryId) {
        if (!validSubcategoryIds.has(p.subcategoryId)) {
          errors.push(
            `Product ${productIdentifier} references non-existent subcategory: "${p.subcategoryId}".`
          );
        } else {
          const subcat = this.categories.find((c) => c.id === p.subcategoryId);
          if (subcat) {
            if (!subcat.active) {
              errors.push(
                `Product ${productIdentifier} references inactive subcategory: "${p.subcategoryId}".`
              );
            }
            if (subcat.parentCategoryId !== p.categoryId) {
              errors.push(
                `Product ${productIdentifier} has subcategory "${p.subcategoryId}" whose parent ("${subcat.parentCategoryId}") does not match categoryId "${p.categoryId}".`
              );
            }
          }
        }
      }

      // 7. Check Availability & Pricing Type enums
      if (!validAvailabilities.has(p.availability)) {
        errors.push(
          `Product ${productIdentifier} has invalid availability: "${p.availability}".`
        );
      }
      if (!validPricingTypes.has(p.pricingType)) {
        errors.push(
          `Product ${productIdentifier} has invalid pricingType: "${p.pricingType}".`
        );
      }

      // 8. Check Pricing integrity
      if (typeof p.price === 'number' && p.price < 0) {
        errors.push(`Product ${productIdentifier} has a negative price: ${p.price}.`);
      }

      if (
        typeof p.compareAtPrice === 'number' &&
        typeof p.price === 'number' &&
        p.compareAtPrice < p.price
      ) {
        errors.push(
          `Product ${productIdentifier} has compareAtPrice (${p.compareAtPrice}) lower than base price (${p.price}).`
        );
      }

      // 9. Pricing Type requirements
      if (p.pricingType === 'FIXED_PRICE' || p.pricingType === 'FROM_PRICE') {
        if (typeof p.price === 'number' && isNaN(p.price)) {
          errors.push(
            `Product ${productIdentifier} has NaN price for pricingType "${p.pricingType}".`
          );
        }
      }

      if (p.pricingType === 'VARIANT_PRICING') {
        if (!p.variants || !Array.isArray(p.variants) || p.variants.length === 0) {
          errors.push(
            `Product ${productIdentifier} has pricingType "VARIANT_PRICING" but contains no variants.`
          );
        }
      }

      // 10. Stock Quantity
      if (typeof p.stockQuantity === 'number' && p.stockQuantity < 0) {
        errors.push(`Product ${productIdentifier} has a negative stockQuantity.`);
      }

      // 11. Timestamps validation
      if (p.createdAt && (typeof p.createdAt !== 'string' || isNaN(Date.parse(p.createdAt)))) {
        errors.push(`Product ${productIdentifier} has an invalid createdAt date: "${p.createdAt}".`);
      }
      if (p.updatedAt && (typeof p.updatedAt !== 'string' || isNaN(Date.parse(p.updatedAt)))) {
        errors.push(`Product ${productIdentifier} has an invalid updatedAt date: "${p.updatedAt}".`);
      }

      // 12. Options validation
      const productOptionNames = new Set<string>();
      const productOptionValuesMap = new Map<string, Set<string>>();

      if (p.options && Array.isArray(p.options)) {
        const optionIdSet = new Set<string>();
        p.options.forEach((opt, optIdx) => {
          if (!opt || typeof opt !== 'object') {
            errors.push(
              `Product ${productIdentifier} has malformed option structure at index ${optIdx}.`
            );
            return;
          }

          if (!opt.id || typeof opt.id !== 'string' || opt.id.trim() === '') {
            errors.push(
              `Product ${productIdentifier} has option at index ${optIdx} with missing ID.`
            );
          } else if (optionIdSet.has(opt.id)) {
            errors.push(
              `Product ${productIdentifier} has duplicate option ID: "${opt.id}".`
            );
          } else {
            optionIdSet.add(opt.id);
          }

          if (!opt.name || typeof opt.name !== 'string' || opt.name.trim() === '') {
            errors.push(
              `Product ${productIdentifier} has option with empty name at index ${optIdx}.`
            );
          } else {
            productOptionNames.add(opt.name);
            productOptionValuesMap.set(opt.name, new Set(opt.values || []));
          }

          if (!opt.values || !Array.isArray(opt.values) || opt.values.length === 0) {
            errors.push(
              `Product ${productIdentifier} option "${opt.name || opt.id}" has no values defined.`
            );
          } else {
            const seenValues = new Set<string>();
            opt.values.forEach((val, valIdx) => {
              if (typeof val !== 'string' || val.trim() === '') {
                errors.push(
                  `Product ${productIdentifier} option "${opt.name || opt.id}" has empty value at index ${valIdx}.`
                );
              } else if (seenValues.has(val)) {
                errors.push(
                  `Product ${productIdentifier} option "${opt.name || opt.id}" has duplicate value "${val}".`
                );
              } else {
                seenValues.add(val);
              }
            });
          }
        });
      }

      // 13. Variants validation
      if (p.variants && Array.isArray(p.variants)) {
        const defaultVariants = p.variants.filter((v) => v && v.isDefault === true);
        if (defaultVariants.length > 1) {
          errors.push(
            `Product ${productIdentifier} has ${defaultVariants.length} variants marked as default (isDefault: true). Only one default is allowed.`
          );
        }

        p.variants.forEach((v, vIdx) => {
          if (!v || typeof v !== 'object') {
            errors.push(
              `Product ${productIdentifier} has malformed variant structure at index ${vIdx}.`
            );
            return;
          }

          if (!v.id || typeof v.id !== 'string' || v.id.trim() === '') {
            errors.push(
              `Product ${productIdentifier} has variant at index ${vIdx} with missing ID.`
            );
          } else if (variantIdSet.has(v.id)) {
            errors.push(
              `Duplicate variant ID found across catalogue: "${v.id}" in product ${productIdentifier}.`
            );
          } else {
            variantIdSet.add(v.id);
          }

          if (!v.title || typeof v.title !== 'string' || v.title.trim() === '') {
            errors.push(
              `Product ${productIdentifier} has variant at index ${vIdx} with missing title.`
            );
          }

          if (v.sku !== undefined) {
            if (typeof v.sku !== 'string' || v.sku.trim() === '') {
              errors.push(
                `Product ${productIdentifier} variant "${v.title || vIdx}" has an empty SKU string.`
              );
            } else if (skuSet.has(v.sku)) {
              errors.push(
                `Duplicate SKU "${v.sku}" found in product ${productIdentifier} variant "${v.title || vIdx}".`
              );
            } else {
              skuSet.add(v.sku);
            }
          }

          if (typeof v.price === 'number' && v.price < 0) {
            errors.push(
              `Product ${productIdentifier} variant "${v.title}" has a negative price: ${v.price}.`
            );
          }

          if (
            typeof v.compareAtPrice === 'number' &&
            typeof v.price === 'number' &&
            v.compareAtPrice < v.price
          ) {
            errors.push(
              `Product ${productIdentifier} variant "${v.title}" has compareAtPrice (${v.compareAtPrice}) lower than variant price (${v.price}).`
            );
          }

          if (typeof v.stockQuantity === 'number' && v.stockQuantity < 0) {
            errors.push(
              `Product ${productIdentifier} variant "${v.title}" has a negative stockQuantity.`
            );
          }

          if (v.availability && !validAvailabilities.has(v.availability)) {
            errors.push(
              `Product ${productIdentifier} variant "${v.title}" has invalid availability: "${v.availability}".`
            );
          }

          // Check variant optionValues alignment
          if (v.optionValues) {
            Object.entries(v.optionValues).forEach(([optName, optVal]) => {
              if (!productOptionNames.has(optName)) {
                errors.push(
                  `Product ${productIdentifier} variant "${v.title}" references undefined option "${optName}".`
                );
              } else {
                const allowedValues = productOptionValuesMap.get(optName);
                if (allowedValues && !allowedValues.has(optVal)) {
                  errors.push(
                    `Product ${productIdentifier} variant "${v.title}" has value "${optVal}" not in option "${optName}" values list.`
                  );
                }
              }
            });
          }
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
    };
  }
}

// Singleton export
export const productRepository: IProductRepository = new LocalProductRepository();
