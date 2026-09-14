import React from 'react';
import { MessageCircle } from 'lucide-react';
import { BUSINESS_CONFIG, createWhatsAppUrl } from '../../config/business';

interface WhatsAppButtonProps {
  message?: string;
  label?: string;
  variant?: 'primary' | 'outline' | 'subtle';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  className?: string;
}

export const WhatsAppButton: React.FC<WhatsAppButtonProps> = ({
  message,
  label = 'Order on WhatsApp',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  className = '',
}) => {
  const url = createWhatsAppUrl(message);

  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 active:scale-[0.98] select-none';

  const variantStyles = {
    primary:
      'bg-[#DE1B76] hover:bg-[#B8125C] text-white shadow-sm hover:shadow-md',
    outline:
      'border border-[#DE1B76] text-[#DE1B76] hover:bg-[#FDF2F7] bg-white',
    subtle:
      'bg-[#FDF2F7] hover:bg-[#FCE7F3] text-[#DE1B76] border border-[#F9A8D4]/40',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${label} with ${BUSINESS_CONFIG.name} (${BUSINESS_CONFIG.phoneFormatted})`}
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
    >
      <MessageCircle className="w-4 h-4 fill-white/20 flex-shrink-0" />
      <span>{label}</span>
    </a>
  );
};
