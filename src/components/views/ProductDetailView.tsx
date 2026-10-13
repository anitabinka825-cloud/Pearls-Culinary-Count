import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  MessageCircle,
  Sparkles,
  MapPin,
  Clock,
  ShieldCheck,
  ArrowLeft,
  ShoppingBag,
  Heart,
  CheckCircle2,
  AlertCircle,
  Check,
  Tag,
  Share2,
} from 'lucide-react';
import { productRepository } from '../../services/productRepository';
import { createWhatsAppUrl } from '../../config/business';
import { ProductVariant, ProductAvailability } from '../../types';
import { ProductCard } from '../products/ProductCard';

interface ProductDetailViewProps {
  onOpenCustomOrder: (productName?: string) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  onOpenCustomOrder,
}) => {
  const { slug, id } = useParams<{ slug?: string; id?: string }>();
  const navigate = useNavigate();

  const identifier = slug || id || '';
  const product = productRepository.getProductByIdOrSlug(identifier);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCartNotice, setShowCartNotice] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  // Initialize selected options from product options or default variant
  const initialOptions = useMemo(() => {
    if (!product) return {};
    if (product.variants && product.variants.length > 0) {
      const defaultVar =
        product.variants.find((v) => v.isDefault) || product.variants[0];
      return { ...defaultVar.optionValues };
    }
    if (product.options && product.options.length > 0) {
      const opts: Record<string, string> = {};
      product.options.forEach((opt) => {
        if (opt.values.length > 0) {
          opts[opt.name] = opt.values[0];
        }
      });
      return opts;
    }
    return {};
  }, [product]);

  const [selectedOptions, setSelectedOptions] =
    useState<Record<string, string>>(initialOptions);

  // Synchronize when product changes
  useEffect(() => {
    setSelectedOptions(initialOptions);
    setSelectedImageIndex(0);
    setImgError(false);
  }, [initialOptions]);

  // Find active variant based on chosen options
  const activeVariant: ProductVariant | null = useMemo(() => {
    if (!product || !product.variants || product.variants.length === 0) {
      return null;
    }
    return (
      product.variants.find((variant) => {
        return Object.entries(selectedOptions).every(
          ([optName, optVal]) => variant.optionValues[optName] === optVal
        );
      }) ||
      product.variants.find((v) => v.isDefault) ||
      product.variants[0]
    );
  }, [product, selectedOptions]);

  if (!product) {
    return (
      <div className="py-20 lg:py-32 bg-[#FAFAFA] min-h-[70vh] flex items-center justify-center">
        <div className="max-w-md w-full mx-auto px-4 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-rose-50 text-[#DE1B76] border border-rose-100 flex items-center justify-center mx-auto shadow-2xs">
            <AlertCircle className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h1 className="font-serif text-3xl font-bold text-[#121214]">
              Product Not Found
            </h1>
            <p className="text-neutral-600 text-sm leading-relaxed">
              We could not find an offering matching identifier{' '}
              <code className="bg-neutral-100 px-2 py-0.5 rounded text-neutral-800 font-mono text-xs">
                {identifier}
              </code>
              . This item may have been updated or moved.
            </p>
          </div>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              type="button"
              onClick={() => navigate('/shop')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-[#DE1B76] text-white text-xs font-semibold hover:bg-[#B8125C] transition-colors shadow-xs"
            >
              Browse Shop Offerings
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full sm:w-auto px-6 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
            >
              Return Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  const galleryImages =
    product.images && product.images.length > 0
      ? product.images
      : [product.primaryImage || product.image];

  const currentImage = galleryImages[selectedImageIndex] || galleryImages[0];

  // Dynamic pricing calculation
  const displayPrice = productRepository.formatProductPrice(
    product,
    activeVariant
  );

  const compareAtPrice =
    activeVariant?.compareAtPrice !== undefined
      ? activeVariant.compareAtPrice
      : product.compareAtPrice;

  // Availability badge configuration
  const currentAvailability: ProductAvailability =
    activeVariant?.availability || product.availability;

  const getStatusConfig = (avail: ProductAvailability | string) => {
    switch (avail) {
      case 'IN_STOCK':
      case 'in_stock':
        return {
          label: 'In Stock',
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
      case 'MADE_TO_ORDER':
      case 'made_to_order':
        return {
          label: 'Made to Order',
          bg: 'bg-[#FDF2F7] border-[#F9A8D4]/40',
          text: 'text-[#DE1B76]',
          icon: <Sparkles className="w-3.5 h-3.5 text-[#DE1B76]" />,
        };
      case 'AVAILABLE_ON_ENQUIRY':
      case 'available_to_order':
      case 'preorder':
        return {
          label: 'Available on Enquiry',
          bg: 'bg-[#F8F5EE] border-[#C5A059]/30',
          text: 'text-[#9E7B35]',
          icon: <Clock className="w-3.5 h-3.5 text-[#C5A059]" />,
        };
      case 'OUT_OF_STOCK':
        return {
          label: 'Out of Stock',
          bg: 'bg-neutral-100 border-neutral-200',
          text: 'text-neutral-600',
          icon: <AlertCircle className="w-3.5 h-3.5 text-neutral-400" />,
        };
      default:
        return {
          label: 'Available on Enquiry',
          bg: 'bg-emerald-50 border-emerald-200',
          text: 'text-emerald-700',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
        };
    }
  };

  const statusBadge = getStatusConfig(currentAvailability);

  // Selected options summary string for WhatsApp & checkout
  const selectedOptionsText = Object.entries(selectedOptions)
    .map(([key, val]) => `${key}: ${val}`)
    .join(', ');

  const currentUrl =
    typeof window !== 'undefined' ? window.location.href : '';

  const whatsappMessage =
    `Hello Pearls Culinary Counts, I am inquiring about "${product.name}" (${product.categoryName || product.category}).` +
    (selectedOptionsText ? `\n• Selected: ${selectedOptionsText}` : '') +
    (activeVariant?.sku ? `\n• SKU: ${activeVariant.sku}` : '') +
    `\n• Displayed catalogue price: ${displayPrice}` +
    `\n• Reference URL: ${currentUrl}` +
    `\nCould you please share availability and order details for Accra fulfillment?`;

  const whatsappInquiryUrl = createWhatsAppUrl(whatsappMessage);

  const handleAddToCart = () => {
    setShowCartNotice(true);
    setTimeout(() => setShowCartNotice(false), 3500);
  };

  const handleShare = () => {
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2200);
    }
  };

  // Related products recommendations
  const relatedProducts = productRepository
    .getProductsByCategory(product.categoryId)
    .filter((p) => p.id !== product.id && p.slug !== product.slug)
    .slice(0, 3);

  return (
    <div className="py-8 sm:py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        {/* Top Breadcrumb Bar */}
        <nav
          aria-label="Breadcrumb"
          className="flex items-center gap-2 text-xs text-neutral-500 flex-wrap"
        >
          <Link to="/" className="hover:text-neutral-900 transition-colors">
            Home
          </Link>
          <span>/</span>
          <Link to="/shop" className="hover:text-neutral-900 transition-colors">
            Shop
          </Link>
          <span>/</span>
          <Link
            to={`/${product.categoryId}`}
            className="hover:text-neutral-900 transition-colors capitalize"
          >
            {product.categoryName || product.category}
          </Link>
          {product.subcategoryId && (
            <>
              <span>/</span>
              <span className="text-neutral-400 capitalize">
                {product.subcategoryId.replace('sub-', '').replace(/-/g, ' ')}
              </span>
            </>
          )}
          <span>/</span>
          <span className="text-neutral-900 font-medium truncate max-w-[220px] sm:max-w-none">
            {product.name}
          </span>
        </nav>

        {/* Back Link & Share Action */}
        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-neutral-600 hover:text-[#DE1B76] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Offerings</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-600 hover:text-neutral-900 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            title="Share this product link"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copiedLink ? 'Link Copied!' : 'Share'}</span>
          </button>
        </div>

        {/* Main Product Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Image Gallery (6 cols) */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Featured Image */}
            <div className="relative aspect-square w-full rounded-3xl overflow-hidden bg-neutral-100 border border-neutral-200/80 shadow-xs">
              <img
                src={
                  imgError
                    ? 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop'
                    : currentImage
                }
                alt={product.imageAlt || product.name}
                onError={() => setImgError(true)}
                className="w-full h-full object-cover"
              />

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => setIsWishlisted(!isWishlisted)}
                aria-label={
                  isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'
                }
                className="absolute top-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-neutral-700 hover:text-[#DE1B76] hover:bg-white shadow-xs transition-colors"
              >
                <Heart
                  className={`w-4 h-4 ${
                    isWishlisted ? 'fill-[#DE1B76] text-[#DE1B76]' : ''
                  }`}
                />
              </button>

              {/* Category Pill */}
              <div className="absolute top-4 left-4 flex flex-col gap-1.5">
                <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full shadow-2xs border border-white/60">
                  {product.categoryName || product.category}
                </span>
                {product.featured && (
                  <span className="inline-flex items-center gap-1 bg-[#121214]/90 backdrop-blur-xs text-[#C5A059] text-[10px] font-medium px-2 py-0.5 rounded-full border border-[#C5A059]/40">
                    <Sparkles className="w-2.5 h-2.5" />
                    <span>Featured</span>
                  </span>
                )}
              </div>
            </div>

            {/* Gallery Thumbnails (if multiple images) */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-3 overflow-x-auto pb-1">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSelectedImageIndex(idx)}
                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${
                      selectedImageIndex === idx
                        ? 'border-[#DE1B76] ring-2 ring-[#DE1B76]/20'
                        : 'border-neutral-200 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {/* Trust and Care note */}
            <div className="p-4 rounded-2xl bg-neutral-50 border border-neutral-100 flex items-start gap-3 text-xs text-neutral-600">
              <ShieldCheck className="w-4 h-4 text-[#C5A059] flex-shrink-0 mt-0.5" />
              <p className="leading-relaxed">
                Every order at <strong>Pearls Culinary Counts</strong> is
                prepared to order in Accra using carefully sourced ingredients.
                Handcrafted with culinary craftsmanship and attention to detail.
              </p>
            </div>
          </div>

          {/* Right Column: Specifications, Options, Pricing & Actions (6 cols) */}
          <div className="lg:col-span-6 space-y-6">
            {/* Title & Brand Header */}
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#DE1B76]"></span>
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold">
                  Pearls Culinary Counts • Accra
                </span>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#121214] leading-tight">
                {product.name}
              </h1>

              {/* Status and Customization Badges */}
              <div className="flex flex-wrap items-center gap-2 pt-1">
                <span
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border ${statusBadge.bg} ${statusBadge.text}`}
                >
                  {statusBadge.icon}
                  <span>{statusBadge.label}</span>
                </span>

                {product.customizable && (
                  <span className="inline-flex items-center gap-1 text-xs font-medium px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 border border-neutral-200">
                    <Sparkles className="w-3 h-3 text-[#C5A059]" />
                    <span>Customizable to your requirements</span>
                  </span>
                )}

                {activeVariant?.sku && (
                  <span className="inline-flex items-center gap-1 text-xs font-mono text-neutral-500 px-2 py-0.5 rounded bg-neutral-100">
                    <Tag className="w-3 h-3" />
                    <span>{activeVariant.sku}</span>
                  </span>
                )}
              </div>
            </div>

            {/* Pricing Section */}
            <div className="p-5 rounded-2xl bg-[#FDF2F7] border border-[#F9A8D4]/40 flex items-center justify-between">
              <div>
                <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
                  {product.pricingType === 'PRICE_ON_ENQUIRY'
                    ? 'Price Guide'
                    : 'Current Price'}
                </span>
                <div className="flex items-baseline gap-2.5">
                  <span className="font-serif text-2xl sm:text-3xl font-bold text-[#DE1B76]">
                    {displayPrice}
                  </span>
                  {typeof compareAtPrice === 'number' && (
                    <span className="text-sm text-neutral-400 line-through">
                      GH₵ {compareAtPrice}
                    </span>
                  )}
                </div>
                {product.pricingType === 'FROM_PRICE' && (
                  <p className="text-[11px] text-neutral-500 mt-0.5">
                    Estimated base guide • Final quote confirmed upon design
                    specifications
                  </p>
                )}
              </div>
              <span className="text-xs font-medium bg-white text-neutral-700 px-3 py-1.5 rounded-lg border border-[#F9A8D4]/30 shadow-2xs">
                Accra Orders
              </span>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                Description
              </h2>
              <p className="text-neutral-700 text-sm leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Interactive Options & Variants Selection */}
            {product.options && product.options.length > 0 && (
              <div className="space-y-4 pt-2 border-t border-neutral-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-700">
                    Choose Options & Configuration
                  </h2>
                  <span className="text-[11px] text-neutral-500">
                    Price updates automatically
                  </span>
                </div>

                <div className="space-y-4">
                  {product.options.map((option) => (
                    <div key={option.id} className="space-y-2">
                      <label className="block text-xs font-medium text-neutral-700">
                        {option.name}:{' '}
                        <span className="text-neutral-900 font-semibold">
                          {selectedOptions[option.name] || 'Select'}
                        </span>
                      </label>
                      <div className="flex flex-wrap gap-2">
                        {option.values.map((val) => {
                          const isSelected =
                            selectedOptions[option.name] === val;
                          return (
                            <button
                              key={val}
                              type="button"
                              onClick={() =>
                                setSelectedOptions((prev) => ({
                                  ...prev,
                                  [option.name]: val,
                                }))
                              }
                              className={`text-xs font-medium px-3.5 py-2 rounded-xl border transition-all duration-200 ${
                                isSelected
                                  ? 'bg-[#121214] text-white border-[#121214] shadow-xs'
                                  : 'bg-neutral-50 text-neutral-700 border-neutral-200 hover:bg-neutral-100 hover:border-neutral-300'
                              }`}
                            >
                              <span className="flex items-center gap-1.5">
                                {isSelected && <Check className="w-3 h-3" />}
                                <span>{val}</span>
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Key Attributes / Specifications summary */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              {product.leadTime && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
                    Lead Time
                  </span>
                  <span className="text-xs font-medium text-neutral-800">
                    {product.leadTime}
                  </span>
                </div>
              )}

              {product.servings && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
                    Portions
                  </span>
                  <span className="text-xs font-medium text-neutral-800">
                    {product.servings}
                  </span>
                </div>
              )}

              {product.minimumOrderQuantity && (
                <div className="p-3 rounded-xl bg-neutral-50 border border-neutral-100 space-y-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-semibold text-neutral-400 block">
                    Min. Order
                  </span>
                  <span className="text-xs font-medium text-neutral-800">
                    {product.minimumOrderQuantity} unit(s)
                  </span>
                </div>
              )}
            </div>

            {/* Specifications Table */}
            {product.specifications && product.specifications.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-neutral-100">
                <h2 className="text-xs uppercase tracking-wider font-semibold text-neutral-500">
                  Specifications & Notice
                </h2>
                <div className="bg-neutral-50/70 rounded-2xl border border-neutral-100 divide-y divide-neutral-100 overflow-hidden text-xs">
                  {product.specifications.map((spec, i) => (
                    <div
                      key={i}
                      className="flex items-center justify-between p-3"
                    >
                      <span className="text-neutral-500 font-medium">
                        {spec.label}
                      </span>
                      <span className="font-semibold text-neutral-800">
                        {spec.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tags */}
            {product.tags && product.tags.length > 0 && (
              <div className="flex items-center flex-wrap gap-1.5 pt-1">
                {product.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] bg-neutral-100 text-neutral-600 px-2.5 py-1 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3 pt-4 border-t border-neutral-100">
              {/* WhatsApp Enquiry Button */}
              <a
                href={whatsappInquiryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-medium py-3.5 px-6 rounded-full text-sm shadow-sm hover:shadow transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Enquire & Order on WhatsApp</span>
              </a>

              {/* Custom Order / Commission Button */}
              {product.customizable && (
                <button
                  type="button"
                  onClick={() => onOpenCustomOrder(product.name)}
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-3 px-6 rounded-full text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Customize This Commission</span>
                </button>
              )}

              {/* Future Add to Cart Action */}
              <button
                type="button"
                onClick={handleAddToCart}
                className="w-full inline-flex items-center justify-center gap-2 bg-white border border-neutral-200 text-neutral-700 hover:text-neutral-900 hover:border-neutral-300 font-medium py-2.5 px-6 rounded-full text-xs transition-colors"
                title="Add to Cart — Coming Soon"
                aria-label="Add to Cart — Coming Soon"
              >
                <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
                <span>Add to Cart — Coming Soon</span>
              </button>

              {/* Cart Preview Notice Toast */}
              {showCartNotice && (
                <div className="p-3.5 rounded-2xl bg-[#121214] text-white text-xs space-y-1 shadow-lg animate-in fade-in duration-200">
                  <div className="flex items-center gap-2 font-semibold text-[#C5A059]">
                    <Sparkles className="w-4 h-4" />
                    <span>Commerce Features Coming Soon</span>
                  </div>
                  <p className="text-neutral-300 leading-relaxed text-[11px]">
                    Shopping cart, checkout, online payments, and full order processing will be introduced in a future commerce stage. For immediate ordering, please use the WhatsApp enquiry button above!
                  </p>
                </div>
              )}
            </div>

            {/* Delivery Info Footer */}
            <div className="flex items-center gap-2 text-xs text-neutral-500 pt-2">
              <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
              <span>
                Pick up available in Accra or delivery arranged for your address
                (confirmed upon enquiry).
              </span>
            </div>
          </div>
        </div>

        {/* Related Products / Recommendations */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 sm:pt-20 border-t border-neutral-200/80 space-y-8">
            <div className="flex items-end justify-between">
              <div>
                <span className="text-xs uppercase tracking-widest text-[#C5A059] font-semibold block">
                  More From {product.categoryName || product.category}
                </span>
                <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#121214] mt-1">
                  You May Also Like
                </h2>
              </div>
              <Link
                to={`/${product.categoryId}`}
                className="text-xs font-semibold text-[#DE1B76] hover:underline"
              >
                View all in category &rarr;
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map((relProduct) => (
                <ProductCard
                  key={relProduct.id}
                  product={relProduct}
                  onViewDetails={(p) =>
                    navigate(`/product/${p.slug || p.id}`)
                  }
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
