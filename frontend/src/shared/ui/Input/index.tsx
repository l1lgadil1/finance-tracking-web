import { InputHTMLAttributes, ReactNode, forwardRef } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

const inputVariants = cva(
  "w-full transition-colors bg-input text-input-foreground placeholder:text-muted-foreground rounded-md border border-border focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-400 focus-visible:border-primary-400",
  {
    variants: {
      size: {
        sm: "h-8 text-sm px-3 py-1",
        md: "h-10 text-base px-3 py-2",
        lg: "h-12 text-lg px-4 py-2",
      },
      variant: {
        default: "",
        filled: "bg-muted border-transparent",
        outline: "bg-transparent border-border",
      },
      state: {
        default: "",
        error: "border-error focus-visible:ring-error focus-visible:border-error",
        success: "border-success focus-visible:ring-success focus-visible:border-success",
      },
      isDisabled: {
        true: "opacity-50 cursor-not-allowed",
      },
      hasLeftIcon: {
        true: "pl-10",
      },
      hasRightIcon: {
        true: "pr-10",
      }
    },
    defaultVariants: {
      size: "md",
      variant: "default",
      state: "default",
      isDisabled: false,
      hasLeftIcon: false,
      hasRightIcon: false,
    },
  }
);

export interface InputProps 
  extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'state'>,
    Omit<VariantProps<typeof inputVariants>, 'isDisabled'> {
  label?: string;
  helperText?: string;
  error?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
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
      size,
      variant,
      state,
      disabled = false,
      hasLeftIcon,
      hasRightIcon,
      fullWidth = false,
      id,
      ...rest
    },
    ref
  ) => {
    // Generate a unique ID if one isn't provided
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    const errorId = error ? `${inputId}-error` : undefined;
    const helperId = helperText && !error ? `${inputId}-helper` : undefined;

    // Set state to error if error is provided
    const inputState = error ? "error" : state;
    
    // Set icon flags based on the presence of icons
    const hasLeftIconFlag = leftIcon ? true : hasLeftIcon;
    const hasRightIconFlag = rightIcon ? true : hasRightIcon;
    
    const wrapperClasses = fullWidth ? 'w-full' : '';
    
    return (
      <div className={`${wrapperClasses} ${className}`}>
        {label && (
          <label 
            htmlFor={inputId}
            className="block text-sm font-medium text-foreground mb-1.5"
          >
            {label}
          </label>
        )}
        
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              {leftIcon}
            </div>
          )}
          
          <input
            id={inputId}
            ref={ref}
            className={inputVariants({ 
              size, 
              variant, 
              state: inputState, 
              isDisabled: disabled, 
              hasLeftIcon: hasLeftIconFlag, 
              hasRightIcon: hasRightIconFlag 
            })}
            aria-invalid={error ? "true" : "false"}
            aria-describedby={error ? errorId : helperId}
            disabled={disabled}
            {...rest}
          />
          
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground pointer-events-none">
              {rightIcon}
            </div>
          )}
        </div>
        
        {(helperText || error) && (
          <p 
            id={error ? errorId : helperId}
            className={`mt-1.5 text-sm ${error ? 'text-error' : 'text-muted-foreground'}`}
          >
            {error || helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input'; 