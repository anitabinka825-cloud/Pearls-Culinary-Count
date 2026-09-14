import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'subtle' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  icon,
  iconPosition = 'right',
  className = '',
  disabled,
  ...props
}) => {
  const baseStyles =
    'inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed select-none active:scale-[0.98]';

  const variantStyles = {
    primary:
      'bg-[#DE1B76] hover:bg-[#B8125C] text-white shadow-xs hover:shadow-md focus-visible:ring-[#DE1B76]',
    secondary:
      'bg-[#121214] hover:bg-neutral-800 text-white shadow-xs focus-visible:ring-neutral-900',
    outline:
      'border border-neutral-200 hover:border-neutral-900 text-neutral-800 hover:bg-neutral-50 focus-visible:ring-neutral-400 bg-white',
    subtle:
      'bg-[#FDF2F7] hover:bg-[#FCE7F3] text-[#DE1B76] border border-[#F9A8D4]/40 focus-visible:ring-[#DE1B76]',
    ghost:
      'text-neutral-700 hover:text-[#DE1B76] hover:bg-neutral-50 focus-visible:ring-neutral-300',
  };

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${
        fullWidth ? 'w-full' : ''
      } ${className}`}
      disabled={disabled}
      {...props}
    >
      {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
      <span>{children}</span>
      {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
    </button>
  );
};
