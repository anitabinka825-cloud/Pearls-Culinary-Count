import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Home, ShoppingBag, Sparkles } from 'lucide-react';

export const NotFoundView: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="py-20 lg:py-32 bg-[#FAFAFA] min-h-[70vh] flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-4 text-center space-y-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF2F7] border border-[#F9A8D4]/40 text-xs font-semibold text-[#DE1B76]">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
          <span>Page Not Found</span>
        </div>

        <div className="space-y-2">
          <h1 className="font-serif text-4xl sm:text-5xl font-bold text-[#121214]">
            404
          </h1>
          <h2 className="font-serif text-xl sm:text-2xl font-bold text-neutral-800">
            Looking for something delicious?
          </h2>
          <p className="text-neutral-600 text-sm leading-relaxed max-w-sm mx-auto">
            The page you are looking for does not exist or may have been moved. Explore our shop or connect with us on WhatsApp.
          </p>
        </div>

        <div className="pt-3 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/shop')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#DE1B76] text-white text-xs font-semibold hover:bg-[#B8125C] transition-colors shadow-xs"
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Browse Offerings</span>
          </button>
          <button
            type="button"
            onClick={() => navigate('/')}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-white border border-neutral-200 text-neutral-700 text-xs font-semibold hover:bg-neutral-50 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Home</span>
          </button>
        </div>
      </div>
    </div>
  );
};
