import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  X,
  MessageCircle,
  Sparkles,
  MapPin,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { Product } from '../../types';
import { createWhatsAppUrl } from '../../config/business';

interface ProductDetailModalProps {
  product: Product | null;
  onClose: () => void;
  onOpenCustomOrder?: (prefillProduct: string) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  onClose,
  onOpenCustomOrder,
}) => {
  const navigate = useNavigate();
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!product) return null;

  const whatsappMessage = `Hello Pearls Culinary Counts, I am inquiring about the "${product.name}" (${product.categoryName}). Could you provide more details regarding availability and ordering for Accra?`;
  const whatsappUrl = createWhatsAppUrl(whatsappMessage);

  const handleOpenFullPage = () => {
    onClose();
    navigate(`/product/${product.id}`);
  };

  const displayPrice = product.priceFormatted || product.price;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-product-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-neutral-900/60 backdrop-blur-xs transition-opacity"
        onClick={onClose}
      ></div>

      {/* Modal Container */}
      <div className="relative bg-white rounded-3xl shadow-2xl max-w-3xl w-full overflow-hidden z-10 border border-neutral-100 max-h-[92vh] flex flex-col animate-in fade-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close details"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/90 hover:bg-white text-neutral-700 hover:text-neutral-950 shadow-sm transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 overflow-y-auto">
          {/* Product Image */}
          <div className="relative bg-neutral-100 h-64 md:h-full min-h-[300px]">
            <img
              src={imgError ? 'https://images.unsplash.com/photo-1535141192574-5d4897c13136?q=80&w=1000&auto=format&fit=crop' : product.image}
              alt={product.imageAlt}
              onError={() => setImgError(true)}
              className="w-full h-full object-cover"
            />
            <div className="absolute top-4 left-4">
              <span className="bg-white/95 backdrop-blur-xs text-neutral-900 text-xs font-semibold px-3 py-1 rounded-full shadow-xs border border-white/60">
                {product.categoryName}
              </span>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#DE1B76]"></span>
                  <span className="text-xs uppercase tracking-wider text-[#C5A059] font-semibold">
                    Pearls Culinary Counts • Accra
                  </span>
                </div>
                <h3
                  id="modal-product-title"
                  className="font-serif text-2xl sm:text-3xl font-bold text-[#121214] leading-snug"
                >
                  {product.name}
                </h3>
              </div>

              {/* Price guide */}
              <div className="p-3 bg-[#FDF2F7] rounded-xl border border-[#F9A8D4]/40 flex items-center justify-between">
                <div>
                  <span className="text-[11px] uppercase tracking-wider text-neutral-500 font-semibold block">
                    Price Guide
                  </span>
                  <span className="font-serif font-bold text-lg text-[#DE1B76]">
                    {displayPrice}
                  </span>
                </div>
                <span className="text-xs text-neutral-600 bg-white px-2.5 py-1 rounded-md border border-[#F9A8D4]/30">
                  Accra Orders
                </span>
              </div>

              {/* Description */}
              <p className="text-neutral-600 text-sm leading-relaxed">
                {product.description}
              </p>

              {/* Specs & Lead time */}
              <div className="space-y-1 text-xs">
                {product.leadTime && (
                  <div className="flex items-center gap-1.5 text-neutral-600 py-0.5">
                    <Clock className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                    <span>Lead time: {product.leadTime}</span>
                  </div>
                )}
                {product.servings && (
                  <div className="flex items-center gap-1.5 text-neutral-600 py-0.5">
                    <span className="font-medium text-neutral-700">Portions:</span>
                    <span>{product.servings}</span>
                  </div>
                )}
              </div>

              {/* Delivery info */}
              <div className="flex items-center gap-2 text-xs text-neutral-600 pt-1">
                <MapPin className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                <span>Pickup or Accra delivery (confirmed based on location)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-2.5 pt-4 border-t border-neutral-100">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-medium py-3 px-5 rounded-full text-sm shadow-sm transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 fill-white/20" />
                <span>Enquire on WhatsApp</span>
              </a>

              {product.customizable && onOpenCustomOrder && (
                <button
                  type="button"
                  onClick={() => {
                    onClose();
                    onOpenCustomOrder(product.name);
                  }}
                  className="w-full inline-flex items-center justify-center gap-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-800 font-medium py-2.5 px-4 rounded-full text-xs transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>Customize This Commission</span>
                </button>
              )}

              <button
                type="button"
                onClick={handleOpenFullPage}
                className="w-full inline-flex items-center justify-center gap-1.5 text-neutral-600 hover:text-neutral-900 text-xs font-semibold py-1.5 transition-colors"
              >
                <span>View Full Product Page & Specs</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
