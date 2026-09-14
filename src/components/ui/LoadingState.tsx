import React from 'react';

interface LoadingStateProps {
  message?: string;
  count?: number;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  message = 'Loading Pearls Culinary Counts offerings...',
  count = 4,
}) => {
  return (
    <div className="space-y-6 w-full py-8">
      <div className="flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-wider text-neutral-500">
        <span className="w-2 h-2 rounded-full bg-[#DE1B76] animate-ping"></span>
        <span>{message}</span>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: count }).map((_, i) => (
          <div
            key={i}
            className="rounded-2xl border border-neutral-100 p-4 bg-white space-y-4 animate-pulse"
          >
            <div className="aspect-4/3 bg-neutral-200 rounded-xl w-full"></div>
            <div className="h-4 bg-neutral-200 rounded w-3/4"></div>
            <div className="h-3 bg-neutral-100 rounded w-full"></div>
            <div className="h-3 bg-neutral-100 rounded w-2/3"></div>
            <div className="h-8 bg-neutral-100 rounded-full w-full mt-2"></div>
          </div>
        ))}
      </div>
    </div>
  );
};
