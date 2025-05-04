import { ReactNode, ButtonHTMLAttributes, forwardRef } from 'react';
import { motion } from 'framer-motion';
import { cva, type VariantProps } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:opacity-50 disabled:pointer-events-none cursor-pointer",
  {
    variants: {
      variant: {
        primary: "bg-primary-500 text-white hover:bg-primary-600 focus-visible:ring-primary-400 dark:focus-visible:ring-primary-300",
        secondary: "bg-muted text-muted-foreground hover:bg-gray-300 dark:hover:bg-gray-700 focus-visible:ring-gray-400",
        outline: "bg-transparent border border-border text-foreground hover:bg-card-hover focus-visible:ring-primary-400",
        ghost: "bg-transparent text-foreground hover:bg-card-hover focus-visible:ring-primary-400",
        link: "bg-transparent text-primary-500 hover:underline p-0 h-auto focus-visible:ring-0 underline-offset-4",
        destructive: "bg-error text-error-foreground hover:opacity-90 focus-visible:ring-error",
      },
      size: {
        sm: "h-8 text-sm px-3 py-1.5 rounded-md",
        md: "h-10 text-base px-4 py-2 rounded-md",
        lg: "h-12 text-lg px-6 py-3 rounded-md",
      },
      fullWidth: {
        true: "w-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
      fullWidth: false,
    },
  }
);

export interface ButtonProps 
  extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'className'>,
    VariantProps<typeof buttonVariants> {
  children: ReactNode;
  isLoading?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  className?: string;
}

// Create a specialized motion component type for button
type MotionButtonType = typeof motion.button;

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant, 
    size, 
    fullWidth,
    isLoading = false, 
    leftIcon, 
    rightIcon, 
    className = "", 
    disabled,
    ...props 
  }, ref) => {
    // Extract the motion-specific props we need
    const motionProps = {
      whileTap: { scale: disabled || isLoading ? 1 : 0.98 }
    };

    return (
      <motion.button
        ref={ref}
        className={buttonVariants({ variant, size, fullWidth, className })} 
        disabled={disabled || isLoading}
        aria-disabled={disabled || isLoading}
        // Type assertion is safer with a specific component type
        {...motionProps}
        {...props as React.ComponentProps<MotionButtonType>}
      >
        {isLoading && (
          <svg
            className="mr-2 h-4 w-4 animate-spin"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {!isLoading && leftIcon && <span className="mr-2" aria-hidden="true">{leftIcon}</span>}
        <span>{children}</span>
        {!isLoading && rightIcon && <span className="ml-2" aria-hidden="true">{rightIcon}</span>}
      </motion.button>
    );
  }
);

Button.displayName = "Button";

export { Button, buttonVariants }; 