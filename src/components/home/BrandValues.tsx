import React from 'react';
import { ShieldCheck, Sparkles, Heart, Users, Compass } from 'lucide-react';
import { SectionHeading } from '../ui/SectionHeading';

export const BrandValues: React.FC = () => {
  const values = [
    {
      title: 'Quality Preparation',
      description:
        'We focus on wholesome ingredients and thoughtful culinary preparation to deliver balanced flavors in every bake and dish.',
      icon: <ShieldCheck className="w-5 h-5 text-[#DE1B76]" />,
    },
    {
      title: 'Attention to Detail',
      description:
        'From clean piping and neat edges to balanced seasoning, each order is prepared with care.',
      icon: <Sparkles className="w-5 h-5 text-[#C5A059]" />,
    },
    {
      title: 'Timeless Elegance',
      description:
        'We believe culinary creations should look as breathtaking as they taste, elevating special celebrations and everyday dining alike.',
      icon: <Heart className="w-5 h-5 text-[#DE1B76]" />,
    },
    {
      title: 'Customer-Focused Service',
      description:
        'Listening attentively to custom requirements, dietary preferences, and event timelines to make your experience seamless and warm.',
      icon: <Users className="w-5 h-5 text-[#C5A059]" />,
    },
    {
      title: 'Culinary Creativity',
      description:
        'Harmonizing classic baking and Ghanaian culinary traditions with contemporary flair and aesthetic sophistication.',
      icon: <Compass className="w-5 h-5 text-[#DE1B76]" />,
    },
  ];

  return (
    <section
      id="values"
      aria-label="Brand Values"
      className="py-16 lg:py-24 bg-white border-b border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeading
          badge="Guiding Principles"
          title="What Defines Pearls Culinary Counts"
          subtitle="Our commitment to culinary excellence, graceful presentation, and genuine hospitality in Accra, Ghana."
          className="mb-14"
        />

        {/* Values Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {values.slice(0, 3).map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-sm group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 border border-neutral-100 shadow-2xs group-hover:scale-105 transition-transform">
                {val.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#121214] mb-3 group-hover:text-[#DE1B76] transition-colors">
                {val.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>

        {/* Secondary Row: Centered 2 Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mt-8">
          {values.slice(3).map((val, idx) => (
            <div
              key={idx}
              className="p-8 rounded-2xl bg-neutral-50/70 border border-neutral-100 hover:border-neutral-200 transition-all duration-300 hover:shadow-sm group"
            >
              <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center mb-5 border border-neutral-100 shadow-2xs group-hover:scale-105 transition-transform">
                {val.icon}
              </div>
              <h3 className="font-serif text-xl font-bold text-[#121214] mb-3 group-hover:text-[#DE1B76] transition-colors">
                {val.title}
              </h3>
              <p className="text-neutral-600 text-sm leading-relaxed">
                {val.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};
