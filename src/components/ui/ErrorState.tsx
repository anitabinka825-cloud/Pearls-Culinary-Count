import React from 'react';
import { AlertCircle, RotateCcw } from 'lucide-react';
import { Button } from './Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
  className?: string;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  title = 'Something unexpected occurred',
  message = 'We could not complete your request at this moment. Please check your connection or contact our team directly on WhatsApp.',
  onRetry,
  className = '',
}) => {
  return (
    <div
      className={`rounded-2xl border border-rose-200 bg-rose-50/50 p-8 sm:p-10 text-center max-w-lg mx-auto ${className}`}
    >
      <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h3 className="font-serif text-xl font-bold text-neutral-900 mb-2">
        {title}
      </h3>
      <p className="text-sm text-neutral-600 mb-6 leading-relaxed">
        {message}
      </p>
      {onRetry && (
        <Button variant="primary" size="sm" onClick={onRetry} icon={<RotateCcw className="w-4 h-4" />}>
          Try Again
        </Button>
      )}
    </div>
  );
};
