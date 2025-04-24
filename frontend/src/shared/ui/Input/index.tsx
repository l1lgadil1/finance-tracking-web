import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      error,
      leftIcon,
      rightIcon,
      className = '',
      size = 'md',
      fullWidth = false,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const baseInputStyles = 'bg-transparent text-foreground placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-300 transition-all rounded-md border';
    const borderStyles = error
      ? 'border-error focus:border-error'
      : 'border-border focus:border-primary-400';
    
    const sizeStyles = {
      sm: 'text-sm p-1.5',
      md: 'text-base p-2',
      lg: 'text-lg p-3',
    };
    
    const widthStyles = fullWidth ? 'w-full' : '';
    const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const iconPaddingLeft = leftIcon ? 'pl-10' : '';
    const iconPaddingRight = rightIcon ? 'pr-10' : '';
    
    return (
      <div className={`${widthStyles} ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {leftIcon}
            </div>
          )}
          
          <input
            ref={ref}
            className={`${baseInputStyles} ${borderStyles} ${sizeStyles[size]} ${widthStyles} ${disabledStyles} ${iconPaddingLeft} ${iconPaddingRight}`}
            disabled={disabled}
            {...rest}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <p className={`mt-1 text-sm ${error ? 'text-error' : 'text-gray-500'}`}>
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 