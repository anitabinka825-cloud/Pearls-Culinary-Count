import React from 'react';
import { GraduationCap, CheckCircle2, Calendar, BookOpen, ArrowRight } from 'lucide-react';
import { TRAINING_PROGRAMS } from '../../data/products';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';

interface TrainingSectionProps {
  onNavigateToTraining: () => void;
  onEnquireTraining: (programName: string) => void;
}

export const TrainingSection: React.FC<TrainingSectionProps> = ({
  onNavigateToTraining,
  onEnquireTraining,
}) => {
  return (
    <section
      id="training"
      aria-label="Culinary Training Section"
      className="py-16 lg:py-24 bg-[#FAFAFA] border-b border-neutral-100"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <SectionHeading
          badge="Empowerment & Craft"
          badgeIcon={<GraduationCap className="w-3.5 h-3.5" />}
          title="Culinary & Baking Training"
          subtitle="Hands-on culinary masterclasses, pastry fundamentals, and practical kitchen mentorship hosted in Accra."
          className="mb-14"
        />

        {/* Training Tracks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {TRAINING_PROGRAMS.map((program) => (
            <div
              key={program.id}
              className="bg-white rounded-2xl border border-neutral-100 p-8 shadow-2xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="w-10 h-10 rounded-xl bg-[#FDF2F7] flex items-center justify-center text-[#DE1B76] border border-[#F9A8D4]/30">
                  <BookOpen className="w-5 h-5" />
                </div>

                <div>
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#C5A059]">
                    {program.category}
                  </span>
                  <h3 className="font-serif text-2xl font-bold text-[#121214] mt-1">
                    {program.title}
                  </h3>
                </div>

                <p className="text-neutral-600 text-sm leading-relaxed">
                  {program.overview}
                </p>

                {/* Highlights */}
                <div className="space-y-2 pt-2 border-t border-neutral-100">
                  <span className="text-[11px] uppercase tracking-wider font-semibold text-neutral-500 block">
                    Core Curriculum Focus
                  </span>
                  <ul className="space-y-1.5">
                    {program.highlights.map((h, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#DE1B76] flex-shrink-0 mt-0.5" />
                        <span>{h}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Future intake placeholder note */}
                <div className="p-3 rounded-xl bg-neutral-50 text-neutral-600 text-xs flex items-center gap-2 border border-neutral-100">
                  <Calendar className="w-3.5 h-3.5 text-[#C5A059] flex-shrink-0" />
                  <span>Next cohorts: Registration & dates open on enquiry</span>
                </div>
              </div>

              {/* Action */}
              <div className="pt-6 mt-4 border-t border-neutral-100">
                <Button
                  variant="subtle"
                  size="sm"
                  fullWidth
                  onClick={() => onEnquireTraining(program.title)}
                  icon={<ArrowRight className="w-3.5 h-3.5" />}
                >
                  Enquire for {program.category}
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Global Training CTA */}
        <div className="text-center pt-2">
          <Button
            variant="primary"
            size="lg"
            onClick={onNavigateToTraining}
            icon={<ArrowRight className="w-4 h-4" />}
          >
            Explore Training
          </Button>
        </div>

      </div>
    </section>
  );
};
