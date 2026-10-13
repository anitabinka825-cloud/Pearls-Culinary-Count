import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Heart,
  Eye,
  MessageCircle,
  ShoppingBag,
  Sparkles,
  Clock,
  CheckCircle2,
  XCircle,
  ArrowRight,
} from 'lucide-react';
import { Product, ProductAvailability } from '../../types';
import { productRepository } from '../../services/productRepository';
import { createWhatsAppUrl } from '../../config/business';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCartPlaceholder?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onViewDetails,
  onAddToCartPlaceholder,
}) => {
  const navigate = useNavigate();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showCartNotice, setShowCartNotice] = useState(false);
  const [imgError, setImgError] = useState(false);

  // Status mapping for Stage 2A availability states (plus backward compatibility)
  const getStatusBadge = (availability: ProductAvailability | string) => {
    switch (availability) {
      case 'IN_STOCK':
      case 'in_stock':
        return {
          text: 'In Stock',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
        };
      case 'MADE_TO_ORDER':
      case 'made_to_order':
        return {
          text: 'Made to Order',
          color: 'bg-[#FDF2F7] text-[#DE1B76] border-[#F9A8D4]/40',
          icon: <Sparkles className="w-3 h-3 text-[#DE1B76]" />,
        };
      case 'AVAILABLE_ON_ENQUIRY':
      case 'available_to_order':
      case 'preorder':
        return {
          text: 'Available to Order',
          color: 'bg-[#F8F5EE] text-[#9E7B35] border-[#C5A059]/30',
          icon: <Clock className="w-3 h-3 text-[#C5A059]" />,
        };
      case 'OUT_OF_STOCK':
        return {
          text: 'Out of Stock',
          color: 'bg-neutral-100 text-neutral-600 border-neutral-200',
          icon: <XCircle className="w-3 h-3 text-neutral-400" />,
        };
      case 'DISCONTINUED':
        return {
          text: 'Discontinued',
          color: 'bg-neutral-100 text-neutral-500 border-neutral-200',
          icon: <XCircle className="w-3 h-3 text-neutral-400" />,
        };
      default:
        return {
          text: 'Available to Order',
          color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
          icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
        };
    }
  };

  const status = getStatusBadge(product.availability);
  const displayPrice = productRepository.formatProductPrice(product);
  const productPath = `/product/${product.slug || product.id}`;

  const handleCartClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowCartNotice(true);
    setTimeout(() => setShowCartNotice(false), 2600);
    if (onAddToCartPlaceholder) {
      onAddToCartPlaceholder(product);
    }
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  const productAbsoluteUrl =
    typeof window !== 'undefined'
      ? `${window.location.origin}${productPath}`
      : productPath;

  const whatsappInquiryUrl = createWhatsAppUrl(
    `Hello Pearls Culinary Counts, I am inquiring about "${product.name}" (${product.categoryName || product.category}). Displayed catalogue price: ${displayPrice}. Reference link: ${productAbsoluteUrl}. Could you please share details and availability for Accra?`
  );

  const fallbackImage =
    'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop';
  const displayImage = imgError
    ? fallbackImage
    : product.primaryImage || (product.images && product.images[0]) || product.image || fallbackImage;

  const shortText =
    product.shortDescription ||
    (product.description.length > 90
      ? `${product.description.slice(0, 90)}...`
      : product.description);

  return (
    <article
      id={`product-card-${product.slug || product.id}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={displayImage}
          alt={product.imageAlt || product.name}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
          onClick={() => navigate(productPath)}
          loading="lazy"
        />

        {/* Top Left Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="inline-block bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-neutral-800 px-2.5 py-1 rounded-full shadow-2xs border border-white/60">
              {product.categoryName || product.category}
            </span>
            {product.featured && (
              <span className="inline-flex items-center gap-1 bg-[#121214]/90 backdrop-blur-xs text-[10px] font-medium text-[#C5A059] px-2 py-0.5 rounded-full border border-[#C5A059]/40">
                <Sparkles className="w-2.5 h-2.5 text-[#C5A059]" />
                <span>Featured</span>
              </span>
            )}
          </div>
          {product.customizable && (
            <span className="inline-block self-start bg-white/90 backdrop-blur-xs text-[10px] font-medium text-neutral-700 px-2 py-0.5 rounded-md border border-neutral-200/80 shadow-2xs">
              Customizable
            </span>
          )}
        </div>

        {/* Top Right: Wishlist Preview Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist"
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-xs transition-colors z-10 ${
            isWishlisted
              ? 'bg-white text-[#DE1B76] shadow-sm'
              : 'bg-white/80 hover:bg-white text-neutral-600 hover:text-[#DE1B76]'
          }`}
        >
          <Heart
            className={`w-4 h-4 ${isWishlisted ? 'fill-[#DE1B76]' : ''}`}
          />
        </button>

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails(product);
            }}
            className="pointer-events-auto bg-white/95 text-neutral-900 px-4 py-2 rounded-full text-xs font-semibold shadow-md flex items-center gap-1.5 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300 hover:bg-white"
          >
            <Eye className="w-3.5 h-3.5 text-[#DE1B76]" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Cart notice toast */}
        {showCartNotice && (
          <div className="absolute bottom-2 left-2 right-2 bg-[#121214] text-white text-[11px] py-1.5 px-3 rounded-lg text-center shadow-lg animate-in fade-in z-20 flex items-center justify-center gap-1.5">
            <Sparkles className="w-3 h-3 text-[#C5A059]" />
            <span>Cart ordering is coming in a future commerce stage. Tap Enquire to order on WhatsApp.</span>
          </div>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          {/* Availability and Lead Time */}
          <div className="flex items-center justify-between gap-1.5 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border ${status.color}`}
            >
              {status.icon}
              <span>{status.text}</span>
            </span>

            {product.leadTime && (
              <span className="text-[10px] text-neutral-500 font-medium">
                {product.leadTime}
              </span>
            )}
          </div>

          <h3 className="font-serif text-lg font-bold text-neutral-900 group-hover:text-[#DE1B76] transition-colors line-clamp-1">
            <Link to={productPath} className="hover:underline">
              {product.name}
            </Link>
          </h3>

          <p className="text-neutral-600 text-xs leading-relaxed line-clamp-2">
            {shortText}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="space-y-3 pt-3 border-t border-neutral-100">
          <div className="flex items-baseline justify-between gap-2">
            <div className="flex items-baseline gap-2">
              <span className="text-sm sm:text-base font-serif font-bold text-neutral-900">
                {displayPrice}
              </span>
              {typeof product.compareAtPrice === 'number' && (
                <span className="text-xs text-neutral-400 line-through">
                  GH₵ {product.compareAtPrice}
                </span>
              )}
            </div>
            <span className="text-[11px] text-neutral-500">Accra, Ghana</span>
          </div>

          {/* Action Row */}
          <div className="space-y-2 pt-1">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquire on WhatsApp</span>
            </a>

            <button
              type="button"
              onClick={handleCartClick}
              title="Add to Cart — Coming Soon"
              aria-label="Add to Cart — Coming Soon"
              className="w-full inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-700 text-xs font-medium transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
              <span>Add to Cart — Coming Soon</span>
            </button>
          </div>

          {/* View Details Text Link */}
          <div className="text-center pt-1">
            <Link
              to={productPath}
              className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-600 hover:text-[#DE1B76] transition-colors"
            >
              <span>View Product Details</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
