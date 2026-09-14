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
} from 'lucide-react';
import { Product } from '../../types';
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

  const availabilityLabels = {
    available_to_order: {
      text: 'Available to Order',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    },
    made_to_order: {
      text: 'Made to Order',
      color: 'bg-[#FDF2F7] text-[#DE1B76] border-[#F9A8D4]/40',
      icon: <Sparkles className="w-3 h-3 text-[#DE1B76]" />,
    },
    preorder: {
      text: 'Intake / Pre-Order',
      color: 'bg-[#F8F5EE] text-[#9E7B35] border-[#C5A059]/30',
      icon: <Clock className="w-3 h-3 text-[#C5A059]" />,
    },
    in_stock: {
      text: 'In Stock',
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      icon: <CheckCircle2 className="w-3 h-3 text-emerald-600" />,
    },
  };

  const status = availabilityLabels[product.availability] || availabilityLabels.made_to_order;

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

  const whatsappInquiryUrl = createWhatsAppUrl(
    `Hello Pearls Culinary Counts, I am interested in inquiring about the "${product.name}" (${product.categoryName}). Could you share more details and availability in Accra?`
  );

  const displayPrice = product.priceFormatted || product.price;

  return (
    <article
      id={`product-card-${product.id}`}
      className="group bg-white rounded-2xl border border-neutral-100 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden relative"
    >
      {/* Product Image Stage */}
      <div className="relative aspect-4/3 sm:aspect-square w-full overflow-hidden bg-neutral-100">
        <img
          src={imgError ? 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop' : product.image}
          alt={product.imageAlt}
          onError={() => setImgError(true)}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out cursor-pointer"
          onClick={() => navigate(`/product/${product.id}`)}
          loading="lazy"
        />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="inline-block bg-white/95 backdrop-blur-xs text-[11px] font-semibold text-neutral-800 px-2.5 py-1 rounded-full shadow-2xs border border-white/60">
            {product.categoryName}
          </span>
          {product.customizable && (
            <span className="inline-block bg-[#121214]/90 backdrop-blur-xs text-[10px] font-medium text-white px-2 py-0.5 rounded-md">
              Customizable
            </span>
          )}
        </div>

        {/* Top Right: Wishlist Preview Button */}
        <button
          type="button"
          onClick={handleWishlistToggle}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
          title="Wishlist (Stage 1 preview)"
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
            <span>Cart checkout will activate in Stage 2</span>
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
            <Link to={`/product/${product.id}`}>
              {product.name}
            </Link>
          </h3>

          <p className="text-neutral-600 text-xs leading-relaxed line-clamp-2">
            {product.description}
          </p>
        </div>

        {/* Pricing & Actions */}
        <div className="space-y-3 pt-3 border-t border-neutral-100">
          <div className="flex items-center justify-between">
            <span className="text-sm font-serif font-bold text-neutral-900">
              {displayPrice}
            </span>
            <span className="text-[11px] text-neutral-500">
              Accra, Ghana
            </span>
          </div>

          {/* Action Row */}
          <div className="grid grid-cols-2 gap-2">
            <a
              href={whatsappInquiryUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-[#DE1B76] hover:bg-[#B8125C] text-white text-xs font-semibold shadow-2xs transition-colors"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </a>

            <button
              type="button"
              onClick={handleCartClick}
              title="Cart integration planned for Stage 2"
              className="inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-neutral-800 text-xs font-medium transition-colors"
            >
              <ShoppingBag className="w-3.5 h-3.5 text-neutral-500" />
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};
