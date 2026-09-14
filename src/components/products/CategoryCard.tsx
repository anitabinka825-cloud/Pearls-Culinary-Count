import React from 'react';
import { ArrowRight } from 'lucide-react';
import { CategoryItem } from '../../types';

interface CategoryCardProps {
  category: CategoryItem;
  onExplore: (category: CategoryItem) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onExplore,
}) => {
  return (
    <article
      id={`category-card-${category.slug}`}
      className="group bg-white rounded-2xl border border-neutral-100/90 shadow-2xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden hover:-translate-y-1"
    >
      {/* Category Image */}
      <div className="relative h-60 w-full overflow-hidden bg-neutral-100">
        <img
          src={category.image}
          alt={category.imageAlt}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Subtle pill tag */}
        <div className="absolute top-3.5 left-3.5">
          <span className="inline-block bg-white/95 backdrop-blur-xs text-[#121214] text-xs font-semibold px-3 py-1 rounded-full shadow-2xs border border-white/80">
            {category.name}
          </span>
        </div>

        {/* Subtle hover accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-[#DE1B76] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>

      {/* Card Content */}
      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between gap-2">
            <span className="text-[11px] font-semibold tracking-wider uppercase text-[#C5A059]">
              {category.itemCount || 'Quality & Elegance'}
            </span>
          </div>

          <h3 className="font-serif text-xl font-bold text-[#121214] group-hover:text-[#DE1B76] transition-colors">
            {category.name}
          </h3>

          <p className="text-neutral-600 text-sm leading-relaxed line-clamp-3">
            {category.description}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-neutral-100">
          <button
            type="button"
            onClick={() => onExplore(category)}
            className="w-full inline-flex items-center justify-between py-2.5 px-4 rounded-xl bg-neutral-50 group-hover:bg-[#FDF2F7] text-neutral-800 group-hover:text-[#DE1B76] text-sm font-semibold transition-all duration-200 border border-neutral-200/50 group-hover:border-[#F9A8D4]"
          >
            <span>Explore {category.name}</span>
            <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </article>
  );
};
