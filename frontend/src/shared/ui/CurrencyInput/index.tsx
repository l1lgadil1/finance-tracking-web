import { forwardRef, useState, ChangeEvent, useRef, useEffect } from 'react';
import { Input, InputProps } from '../Input';

interface CurrencyInputProps extends Omit<InputProps, 'value' | 'onChange'> {
  /**
   * Current value in cents/smallest currency unit (e.g., 1050 for $10.50)
   */
  value: number;
  
  /**
   * Handler called when value changes
   */
  onChange: (value: number) => void;
  
  /**
   * Currency symbol to display (default: $)
   */
  currencySymbol?: string;
  
  /**
   * Whether to show cents/decimal places (default: true)
   */
  showDecimals?: boolean;
  
  /**
   * Number of decimal places to show (default: 2)
   */
  decimalPlaces?: number;
  
  /**
   * Decimal separator (default: .)
   */
  decimalSeparator?: string;
  
  /**
   * Thousands separator (default: ,)
   */
  thousandsSeparator?: string;
  
  /**
   * Maximum value allowed (in cents/smallest currency unit)
   */
  max?: number;
  
  /**
   * Minimum value allowed (in cents/smallest currency unit)
   */
  min?: number;
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({
    value,
    onChange,
    currencySymbol = '$',
    showDecimals = true,
    decimalPlaces = 2,
    decimalSeparator = '.',
    thousandsSeparator = ',',
    max,
    min = 0,
    disabled = false,
    onBlur,
    onFocus,
    ...inputProps
  }, ref) => {
    // Convert cents to display format
    const formatValueForDisplay = (valueInCents: number): string => {
      // Convert to base unit
      const divisor = Math.pow(10, decimalPlaces);
      const valueInBaseUnit = valueInCents / divisor;
      
      // Format the number with locale
      const formatter = new Intl.NumberFormat('en-US', {
        minimumFractionDigits: showDecimals ? decimalPlaces : 0,
        maximumFractionDigits: showDecimals ? decimalPlaces : 0,
        useGrouping: true,
      });
      
      // Get formatted number and replace with our separators if different
      let formatted = formatter.format(valueInBaseUnit);
      
      if (decimalSeparator !== '.') {
        formatted = formatted.replace(/\./g, decimalSeparator);
      }
      
      if (thousandsSeparator !== ',') {
        formatted = formatted.replace(/,/g, thousandsSeparator);
      }
      
      return formatted;
    };
    
    // Initialize display value
    const [displayValue, setDisplayValue] = useState<string>(formatValueForDisplay(value));
    const [isFocused, setIsFocused] = useState<boolean>(false);
    
    // Input ref for cursor management
    const inputRef = useRef<HTMLInputElement | null>(null);
    const cursorPositionRef = useRef<number | null>(null);
    
    // Update display value when prop value changes
    useEffect(() => {
      if (!isFocused) {
        setDisplayValue(formatValueForDisplay(value));
      }
    }, [value, isFocused]);
    
    // Parse display value to cents
    const parseDisplayValue = (display: string): number => {
      // Remove currency symbol and any non-numeric chars except decimal separator
      let cleaned = display.replace(new RegExp(`[^0-9${decimalSeparator}]`, 'g'), '');
      
      // Replace decimal separator with dot for JS number parsing
      if (decimalSeparator !== '.') {
        cleaned = cleaned.replace(new RegExp(decimalSeparator, 'g'), '.');
      }
      
      // Parse to float and convert to smallest currency unit
      const multiplier = Math.pow(10, decimalPlaces);
      const valueInCents = Math.round(parseFloat(cleaned || '0') * multiplier);
      
      // Apply min/max constraints
      if (max !== undefined && valueInCents > max) {
        return max;
      }
      
      if (min !== undefined && valueInCents < min) {
        return min;
      }
      
      return valueInCents;
    };
    
    // Handle input change
    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      const input = e.target;
      const newDisplayValue = input.value;
      const cursorPosition = input.selectionStart;
      
      // Store cursor position for restoration
      cursorPositionRef.current = cursorPosition;
      
      // Update the display value
      setDisplayValue(newDisplayValue);
      
      // Update actual value (in cents)
      const newValueInCents = parseDisplayValue(newDisplayValue);
      onChange(newValueInCents);
    };
    
    // Restore cursor position after render
    useEffect(() => {
      if (isFocused && inputRef.current && cursorPositionRef.current !== null) {
        inputRef.current.setSelectionRange(cursorPositionRef.current, cursorPositionRef.current);
      }
    }, [displayValue, isFocused]);
    
    // Update ref
    const handleRefChange = (element: HTMLInputElement | null) => {
      inputRef.current = element;
      
      // If forwarded ref is a function
      if (typeof ref === 'function') {
        ref(element);
      } 
      // If it's a mutable ref object
      else if (ref) {
        ref.current = element;
      }
    };
    
    // Format on blur
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false);
      setDisplayValue(formatValueForDisplay(value));
      
      // Call the original onBlur if it exists
      if (onBlur) {
        onBlur(e);
      }
    };
    
    // Prepare for editing on focus
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true);
      
      // Call the original onFocus if it exists
      if (onFocus) {
        onFocus(e);
      }
    };
    
    return (
      <Input
        {...inputProps}
        ref={handleRefChange}
        value={currencySymbol + displayValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        disabled={disabled}
        inputMode="decimal"
        type="text"
        placeholder={inputProps.placeholder || `${currencySymbol}0${showDecimals ? decimalSeparator + '00' : ''}`}
      />
    );
  }
);

CurrencyInput.displayName = 'CurrencyInput'; 