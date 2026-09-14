import React from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Button } from './Button';

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionText?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  title = 'No items found',
  description = 'We could not find any items matching your selected criteria. Try adjusting your search or category filter.',
  actionText = 'View All Products',
  onAction,
  icon,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-dashed border-neutral-200 p-8 sm:p-12 text-center max-w-lg mx-auto bg-neutral-50/50 ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-[#FDF2F7] text-[#DE1B76] flex items-center justify-center mx-auto mb-4 border border-[#F9A8D4]/40">
        {icon || <Sparkles className="w-6 h-6 text-[#C5A059]" />}
      </div>
      <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
        {description}
      </p>
      {onAction && (
        <Button variant="primary" size="sm" onClick={onAction} icon={<ArrowRight className="w-4 h-4" />}>
          {actionText}
        </Button>
      )}
    </div>
  );
};
