import React from 'react';

interface SectionHeadingProps {
  badge?: string;
  badgeIcon?: React.ReactNode;
  title: string;
  subtitle?: string;
  align?: 'left' | 'center' | 'right';
  className?: string;
  dark?: boolean;
}

export const SectionHeading: React.FC<SectionHeadingProps> = ({
  badge,
  badgeIcon,
  title,
  subtitle,
  align = 'center',
  className = '',
  dark = false,
}) => {
  const alignClass = {
    left: 'text-left items-start',
    center: 'text-center items-center mx-auto',
    right: 'text-right items-end ml-auto',
  }[align];

  return (
    <div className={`flex flex-col max-w-3xl ${alignClass} space-y-3.5 ${className}`}>
      {badge && (
        <div
          className={`inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-semibold tracking-wider uppercase ${
            dark
              ? 'bg-white/10 text-[#C5A059] border border-[#C5A059]/40'
              : 'bg-[#FDF2F7] text-[#DE1B76] border border-[#F9A8D4]/40'
          }`}
        >
          {badgeIcon && <span className="flex-shrink-0">{badgeIcon}</span>}
          <span>{badge}</span>
        </div>
      )}

      <h2
        className={`font-serif text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${
          dark ? 'text-white' : 'text-[#121214]'
        }`}
      >
        {title}
      </h2>

      {subtitle && (
        <p
          className={`text-base sm:text-lg leading-relaxed font-normal max-w-2xl ${
            dark ? 'text-neutral-300' : 'text-neutral-600'
          }`}
        >
          {subtitle}
        </p>
      )}

      <div
        className={`w-12 h-0.5 mt-2 ${
          dark ? 'bg-[#C5A059]' : 'bg-[#DE1B76]'
        } ${align === 'center' ? 'mx-auto' : ''}`}
      ></div>
    </div>
  );
};
