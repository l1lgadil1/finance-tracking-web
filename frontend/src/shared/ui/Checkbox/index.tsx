import { forwardRef, InputHTMLAttributes } from 'react';
import { FiCheck } from 'react-icons/fi';

interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  fullWidth?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      label,
      error,
      className = '',
      fullWidth = false,
      disabled = false,
      ...rest
    },
    ref
  ) => {
    const baseStyles = 'h-5 w-5 rounded border-2 appearance-none cursor-pointer transition-all';
    const checkedStyles = 'checked:bg-primary-500 checked:border-primary-500';
    const borderStyles = error
      ? 'border-error focus:border-error'
      : 'border-border focus:border-primary-400';
    const disabledStyles = disabled ? 'opacity-60 cursor-not-allowed' : '';
    const widthStyles = fullWidth ? 'w-full' : '';

    return (
      <div className={`inline-flex items-center ${widthStyles} ${className}`}>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            ref={ref}
            className={`${baseStyles} ${checkedStyles} ${borderStyles} ${disabledStyles}`}
            disabled={disabled}
            {...rest}
          />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none text-white">
            <FiCheck className="w-3 h-3" />
          </div>
          {label && (
            <span className={`ml-2 text-sm ${disabled ? 'text-gray-400' : 'text-foreground'}`}>
              {label}
            </span>
          )}
        </label>
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
      </div>
    );
  }
);

Checkbox.displayName = 'Checkbox'; 