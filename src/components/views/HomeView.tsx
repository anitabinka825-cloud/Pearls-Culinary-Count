import React from 'react';
import { Hero } from '../home/Hero';
import { BrandValues } from '../home/BrandValues';
import { TrainingSection } from '../home/TrainingSection';
import { CustomOrderSection } from '../home/CustomOrderSection';
import { CTASection } from '../home/CTASection';
import { SectionHeading } from '../ui/SectionHeading';
import { CategoryCard } from '../products/CategoryCard';
import { CATEGORIES } from '../../data/categories';
import { CategoryItem } from '../../types';

interface HomeViewProps {
  onExploreProducts: () => void;
  onExploreCategory: (category: CategoryItem) => void;
  onNavigateToTraining: () => void;
  onOpenCustomOrder: (productName?: string) => void;
  onContactClick: () => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onExploreProducts,
  onExploreCategory,
  onNavigateToTraining,
  onOpenCustomOrder,
  onContactClick,
}) => {
  return (
    <div className="space-y-0">
      {/* Hero Section */}
      <Hero
        onExploreProducts={onExploreProducts}
        onContactClick={onContactClick}
      />

      {/* Brand Values */}
      <BrandValues />

      {/* Featured Categories Grid */}
      <section
        id="categories-showcase"
        aria-label="Our Culinary & Lifestyle Categories"
        className="py-16 lg:py-24 bg-[#FAFAFA] border-b border-neutral-100"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeading
            badge="Curated Collections"
            title="Culinary & Lifestyle Offerings"
            subtitle="Explore our handcrafted baked treats, Ghanaian dining, masterclasses, and selected lifestyle essentials."
            className="mb-14"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {CATEGORIES.map((cat) => (
              <CategoryCard
                key={cat.id}
                category={cat}
                onExplore={onExploreCategory}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Custom Orders / Bespoke Request Section */}
      <CustomOrderSection onOpenEnquiry={() => onOpenCustomOrder()} />

      {/* Dedicated Training Section */}
      <TrainingSection
        onNavigateToTraining={onNavigateToTraining}
        onEnquireTraining={(programName) => onOpenCustomOrder(programName)}
      />

      {/* Contact & Orders CTA Section */}
      <CTASection onOpenCustomOrder={() => onOpenCustomOrder()} />
    </div>
  );
};
