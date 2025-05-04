import { forwardRef, useState } from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Locale } from '@/shared/lib/i18n';

interface DatePickerProps {
  label?: string;
  placeholder?: string;
  helperText?: string;
  error?: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  disabled?: boolean;
  minDate?: Date;
  maxDate?: Date;
  className?: string;
  locale?: Locale;
}

export const DatePicker = forwardRef<HTMLDivElement, DatePickerProps>(
  ({ 
    label, 
    placeholder = 'Select date', 
    helperText, 
    error, 
    value, 
    onChange, 
    disabled = false, 
    minDate, 
    maxDate,
    className = '',
    locale = 'en'
  }, ref) => {
    const [isOpen, setIsOpen] = useState(false);
    
    const toggleCalendar = () => {
      if (!disabled) {
        setIsOpen(!isOpen);
      }
    };

    const handleDateSelect = (day: number, month: number, year: number) => {
      const newDate = new Date(year, month, day);
      onChange(newDate);
      setIsOpen(false);
    };

    const handleClear = () => {
      onChange(null);
    };

    // Generate days for the current month
    const generateCalendar = () => {
      const currentDate = value || new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();
      
      const firstDayOfMonth = new Date(year, month, 1).getDay();
      const daysInMonth = new Date(year, month + 1, 0).getDate();
      
      const days = [];
      const weekdays = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
      
      // Add weekday headers
      for (let i = 0; i < 7; i++) {
        days.push(
          <div key={`weekday-${i}`} className="text-center text-xs font-medium text-muted-foreground">
            {weekdays[i]}
          </div>
        );
      }
      
      // Add empty days from previous month
      for (let i = 0; i < firstDayOfMonth; i++) {
        days.push(<div key={`empty-${i}`} className="p-2"></div>);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const isSelected = value && date.getDate() === value.getDate() && 
                          date.getMonth() === value.getMonth() && 
                          date.getFullYear() === value.getFullYear();
        const isDisabled = (minDate && date < minDate) || (maxDate && date > maxDate);
        
        days.push(
          <motion.div
            key={`day-${day}`}
            whileHover={{ scale: isDisabled ? 1 : 1.1 }}
            whileTap={{ scale: isDisabled ? 1 : 0.95 }}
            className={`
              text-center p-2 rounded-full cursor-pointer select-none
              ${isSelected ? 'bg-primary-500 text-white' : 
                            'hover:bg-primary-100 dark:hover:bg-primary-900'}
              ${isDisabled ? 'opacity-30 cursor-not-allowed' : ''}
            `}
            onClick={() => !isDisabled && handleDateSelect(day, month, year)}
          >
            {day}
          </motion.div>
        );
      }
      
      return (
        <div className="grid grid-cols-7 gap-1 p-2">
          {days}
        </div>
      );
    };

    return (
      <div ref={ref} className={`relative ${className}`}>
        {label && (
          <label className="block text-sm font-medium text-foreground mb-1">
            {label}
          </label>
        )}
        
        <div
          className={`
            flex items-center border rounded-md px-3 py-2 bg-background
            ${error ? 'border-error' : 'border-border'}
            ${disabled ? 'opacity-60 bg-muted cursor-not-allowed' : 'cursor-pointer hover:border-primary-300'}
          `}
          onClick={toggleCalendar}
        >
          <CalendarIcon className="w-5 h-5 text-muted-foreground mr-2" />
          <span className={value ? 'text-foreground' : 'text-muted-foreground'}>
            {value ? format(value, 'PP') : placeholder}
          </span>
          
          {value && !disabled && (
            <button
              type="button"
              className="ml-auto text-muted-foreground hover:text-foreground"
              onClick={(e) => {
                e.stopPropagation();
                handleClear();
              }}
            >
              ✕
            </button>
          )}
        </div>
        
        {error && (
          <p className="mt-1 text-sm text-error">{error}</p>
        )}
        
        {helperText && !error && (
          <p className="mt-1 text-sm text-muted-foreground">{helperText}</p>
        )}
        
        {isOpen && !disabled && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute z-10 mt-1 w-full bg-card rounded-md shadow-theme border border-border p-3"
          >
            <div className="flex justify-between items-center mb-3">
              <button
                type="button"
                className="p-1 rounded-full hover:bg-card-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  const newDate = new Date(value || new Date());
                  newDate.setMonth(newDate.getMonth() - 1);
                  onChange(newDate);
                }}
              >
                &lt;
              </button>
              
              <span className="font-medium">
                {format(value || new Date(), 'MMMM yyyy')}
              </span>
              
              <button
                type="button"
                className="p-1 rounded-full hover:bg-card-hover"
                onClick={(e) => {
                  e.stopPropagation();
                  const newDate = new Date(value || new Date());
                  newDate.setMonth(newDate.getMonth() + 1);
                  onChange(newDate);
                }}
              >
                &gt;
              </button>
            </div>
            
            {generateCalendar()}
          </motion.div>
        )}
      </div>
    );
  }
);

DatePicker.displayName = 'DatePicker'; 