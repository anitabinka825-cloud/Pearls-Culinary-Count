import React from 'react';
import { GraduationCap, CheckCircle2, Calendar, BookOpen, Clock, MapPin, Sparkles } from 'lucide-react';
import { TRAINING_PROGRAMS } from '../../data/products';
import { SectionHeading } from '../ui/SectionHeading';
import { Button } from '../ui/Button';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';

interface TrainingViewProps {
  onEnquireProgram: (programName: string) => void;
}

export const TrainingView: React.FC<TrainingViewProps> = ({ onEnquireProgram }) => {
  const whatsappUrl = createWhatsAppUrl(
    'Hello Pearls Culinary Counts, I am interested in enrolling or learning more about your culinary and baking training programs in Accra.'
  );

  return (
    <div className="py-12 lg:py-16 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        
        {/* Banner */}
        <div className="rounded-3xl bg-neutral-900 text-white p-8 sm:p-12 lg:p-16 relative overflow-hidden">
          <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#DE1B76]/15 rounded-full blur-3xl pointer-events-none"></div>

          <div className="max-w-3xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#C5A059] border border-[#C5A059]/40 text-xs font-semibold uppercase tracking-wider">
              <GraduationCap className="w-3.5 h-3.5" />
              <span>Culinary Academy & Mentorship</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-white leading-tight">
              Culinary & Baking Training Programmes
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed font-light">
              Explore baking fundamentals, pastry techniques, and culinary skills through practical masterclasses in Accra.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 bg-[#DE1B76] hover:bg-[#B8125C] text-white font-medium px-6 py-3 rounded-full text-sm transition-colors shadow-sm"
              >
                <span>Register Interest for Next Cohort</span>
              </a>
            </div>
          </div>
        </div>

        {/* What to Expect */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DE1B76] shadow-2xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Practical Learning
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Training programmes are designed around practical culinary and baking skills.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#C5A059] shadow-2xs">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Flexible Cohort Options
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Weekend intensive workshops and weekday comprehensive training sessions available.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-[#FAFAFA] border border-neutral-100 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-[#DE1B76] shadow-2xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-neutral-900 text-lg">
              Recipe Formulation & Costing
            </h3>
            <p className="text-xs text-neutral-600 leading-relaxed">
              Gain practical business insight on ingredient costing, recipe scaling, and presentation.
            </p>
          </div>
        </div>

        {/* Detailed Programs */}
        <div className="space-y-8">
          <SectionHeading
            badge="Curriculum"
            title="Available Training Tracks"
            subtitle="Select a track below to submit an inquiry for curriculum schedules and cohort dates."
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {TRAINING_PROGRAMS.map((prog) => (
              <div
                key={prog.id}
                className="bg-white rounded-2xl border border-neutral-200/80 p-8 shadow-sm flex flex-col justify-between space-y-6"
              >
                <div className="space-y-4">
                  <span className="text-xs uppercase tracking-wider font-semibold text-[#DE1B76]">
                    {prog.category}
                  </span>

                  <h3 className="font-serif text-2xl font-bold text-[#121214]">
                    {prog.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 leading-relaxed">
                    {prog.overview}
                  </p>

                  <div className="pt-2 border-t border-neutral-100 space-y-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500 block">
                      Curriculum Highlights
                    </span>
                    <ul className="space-y-2">
                      {prog.highlights.map((h, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs text-neutral-700">
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#DE1B76] flex-shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#FDF2F7]/50 border border-[#F9A8D4]/30 text-xs text-neutral-600 space-y-1">
                    <div className="flex items-center gap-1.5 font-medium text-neutral-800">
                      <Calendar className="w-3.5 h-3.5 text-[#C5A059]" />
                      <span>Cohort Schedules</span>
                    </div>
                    <p className="text-[11px] text-neutral-500">
                      Specific cohort dates, session durations, and seat availability are provided upon enquiry.
                    </p>
                  </div>
                </div>

                <div className="pt-4 border-t border-neutral-100">
                  <Button
                    variant="primary"
                    size="md"
                    fullWidth
                    onClick={() => onEnquireProgram(prog.title)}
                  >
                    Enquire for {prog.title}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
