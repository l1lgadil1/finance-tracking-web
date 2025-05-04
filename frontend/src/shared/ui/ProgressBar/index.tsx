import { forwardRef } from 'react';
import { motion } from 'framer-motion';

export interface ProgressBarProps {
  /**
   * The current value of the progress (0-100)
   */
  value: number;
  
  /**
   * Maximum possible value (defaults to 100)
   */
  max?: number;
  
  /**
   * The color variant of the progress bar
   */
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'info';
  
  /**
   * Whether to show the percentage label
   */
  showLabel?: boolean;
  
  /**
   * The size of the progress bar
   */
  size?: 'sm' | 'md' | 'lg';
  
  /**
   * Whether to animate the progress
   */
  animate?: boolean;
  
  /**
   * Custom CSS class
   */
  className?: string;
  
  /**
   * Optional label to display
   */
  label?: string;
}

export const ProgressBar = forwardRef<HTMLDivElement, ProgressBarProps>(
  ({ 
    value, 
    max = 100, 
    variant = 'primary', 
    showLabel = false, 
    size = 'md', 
    animate = true,
    className = '',
    label
  }, ref) => {
    // Ensure value is within bounds
    const normalizedValue = Math.min(Math.max(0, value), max);
    const percentage = (normalizedValue / max) * 100;
    
    // Map variants to tailwind classes
    const variantClasses = {
      primary: 'bg-primary-500',
      success: 'bg-success',
      warning: 'bg-warning',
      error: 'bg-error',
      info: 'bg-info'
    };
    
    // Map sizes to tailwind classes
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-4 rounded-md'
    };
    
    // Determine if we should show the actual value or the percentage
    const displayValue = label || `${Math.round(percentage)}%`;
    
    return (
      <div ref={ref} className={`w-full ${className}`}>
        <div className="flex justify-between items-center mb-1">
          {label && <span className="text-sm font-medium text-foreground">{label}</span>}
          {showLabel && (
            <span className="text-sm font-medium text-muted-foreground">
              {displayValue}
            </span>
          )}
        </div>
        
        <div className={`w-full bg-muted overflow-hidden rounded-full ${sizeClasses[size]}`}>
          {animate ? (
            <motion.div
              className={`${variantClasses[variant]} h-full rounded-full`}
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          ) : (
            <div 
              className={`${variantClasses[variant]} h-full rounded-full`} 
              style={{ width: `${percentage}%` }} 
            />
          )}
        </div>
      </div>
    );
  }
);

ProgressBar.displayName = 'ProgressBar'; 