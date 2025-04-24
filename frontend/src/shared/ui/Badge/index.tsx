import { ReactNode } from 'react';

type BadgeVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info';
type BadgeSize = 'sm' | 'md' | 'lg';

interface BadgeProps {
  children: ReactNode;
  variant?: BadgeVariant;
  size?: BadgeSize;
  rounded?: boolean;
  className?: string;
}

export const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  rounded = false,
  className = '',
}: BadgeProps) => {
  const baseStyles = 'inline-flex items-center justify-center font-medium';
  
  const variantStyles = {
    primary: 'bg-primary-100 text-primary-800 dark:bg-primary-800 dark:text-primary-100',
    secondary: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100',
    success: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    error: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    info: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
  };
  
  const sizeStyles = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1',
  };
  
  const roundedStyles = rounded ? 'rounded-full' : 'rounded';
  
  return (
    <span className={`${baseStyles} ${variantStyles[variant]} ${sizeStyles[size]} ${roundedStyles} ${className}`}>
      {children}
    </span>
  );
}; 