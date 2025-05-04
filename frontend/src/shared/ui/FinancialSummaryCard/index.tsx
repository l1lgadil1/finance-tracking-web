import { forwardRef, ReactNode } from 'react';
import { Card, CardHeader, CardBody } from '../Card';
import { motion } from 'framer-motion';

export interface FinancialSummaryCardProps {
  /**
   * The title of the card
   */
  title: string;
  
  /**
   * The primary value to display (e.g., balance, amount)
   */
  value: string | number;
  
  /**
   * Optional subtitle or label
   */
  subtitle?: string;
  
  /**
   * Optional icon to display next to the title
   */
  icon?: ReactNode;
  
  /**
   * Optional change value (e.g., percentage or amount change)
   */
  change?: {
    value: string | number;
    positive?: boolean;
  };
  
  /**
   * Optional trend data for visualization
   */
  trendData?: number[];
  
  /**
   * Optional footer content
   */
  footer?: ReactNode;
  
  /**
   * Optional onClick handler
   */
  onClick?: () => void;
  
  /**
   * Additional CSS class
   */
  className?: string;
}

export const FinancialSummaryCard = forwardRef<HTMLDivElement, FinancialSummaryCardProps>(
  ({ 
    title, 
    value, 
    subtitle, 
    icon, 
    change, 
    trendData,
    footer,
    onClick,
    className = '' 
  }, ref) => {
    // Format numeric value if needed
    const displayValue = typeof value === 'number' 
      ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : value;
    
    // Format change value if needed
    const displayChange = change && typeof change.value === 'number'
      ? change.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })
      : change?.value;
    
    // Generate mini sparkline from trend data if available
    const renderTrend = () => {
      if (!trendData || trendData.length < 2) return null;
      
      const min = Math.min(...trendData);
      const max = Math.max(...trendData);
      const range = max - min;
      const height = 30;
      const width = trendData.length * 4;
      
      // Generate SVG path for the trend line
      const points = trendData.map((value, index) => {
        const x = (index / (trendData.length - 1)) * width;
        const normalizedValue = range === 0 ? 0.5 : (value - min) / range;
        const y = height - (normalizedValue * height);
        return `${x},${y}`;
      }).join(' ');
      
      const isPositive = trendData[trendData.length - 1] >= trendData[0];
      const strokeColor = isPositive ? 'var(--success)' : 'var(--error)';
      
      return (
        <div className="mt-2">
          <svg width={width} height={height} className="overflow-visible">
            <polyline
              points={points}
              fill="none"
              stroke={strokeColor}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      );
    };
    
    return (
      <motion.div
        ref={ref}
        whileHover={onClick ? { scale: 1.01 } : undefined}
        whileTap={onClick ? { scale: 0.99 } : undefined}
        className={`w-full ${className}`}
      >
        <Card 
          className={`overflow-hidden ${onClick ? 'cursor-pointer hover:bg-card-hover transition-colors' : ''}`}
          onClick={onClick}
        >
          <CardHeader className="flex justify-between">
            <div className="flex items-center gap-2">
              {icon && <div className="text-primary-500">{icon}</div>}
              <span className="font-medium text-muted-foreground">{title}</span>
            </div>
            
            {change && (
              <div className={`text-sm font-medium ${change.positive !== false ? 'text-success' : 'text-error'}`}>
                {change.positive !== false ? '↑' : '↓'} {displayChange}
              </div>
            )}
          </CardHeader>
          
          <CardBody className="pt-0">
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">{displayValue}</span>
              {subtitle && <span className="mt-1 text-sm text-muted-foreground">{subtitle}</span>}
              
              {trendData && renderTrend()}
              
              {footer && <div className="mt-4">{footer}</div>}
            </div>
          </CardBody>
        </Card>
      </motion.div>
    );
  }
);

FinancialSummaryCard.displayName = 'FinancialSummaryCard'; 