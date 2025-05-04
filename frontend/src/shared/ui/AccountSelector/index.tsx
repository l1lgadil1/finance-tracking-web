'use client';
  
import React, { useState, useRef, useEffect, KeyboardEvent } from 'react';
import { Check, ChevronDown } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  color?: string;
}

export interface AccountSelectorProps {
  accounts: Account[];
  selectedAccountId?: string;
  onChange: (accountId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  id?: string;
}

export const AccountSelector: React.FC<AccountSelectorProps> = ({
  accounts,
  selectedAccountId,
  onChange,
  label,
  placeholder = 'Select account',
  disabled = false,
  required = false,
  className = '',
  error,
  id: providedId,
}) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const optionsRef = useRef<(HTMLLIElement | null)[]>([]);
  
  // Generate unique IDs for accessibility
  const uniqueId = providedId || `account-selector-${Math.random().toString(36).substring(2, 9)}`;
  const labelId = `${uniqueId}-label`;
  const listboxId = `${uniqueId}-listbox`;
  
  const selectedAccount = accounts.find(account => account.id === selectedAccountId);
  
  // Handle dropdown toggle
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      if (!isOpen) {
        const selectedIndex = accounts.findIndex(account => account.id === selectedAccountId);
        setFocusedIndex(selectedIndex >= 0 ? selectedIndex : 0);
      }
    }
  };

  // Handle account selection
  const handleSelect = (accountId: string) => {
    onChange(accountId);
    setIsOpen(false);
    // Focus back on the button after selection
    const button = dropdownRef.current?.querySelector('button');
    if (button) button.focus();
  };

  // Format currency values
  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;
    
    switch (e.key) {
      case 'Escape':
        setIsOpen(false);
        break;
      case 'ArrowDown':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(prev => (prev < accounts.length - 1 ? prev + 1 : prev));
        } else {
          setIsOpen(true);
        }
        break;
      case 'ArrowUp':
        if (isOpen) {
          e.preventDefault();
          setFocusedIndex(prev => (prev > 0 ? prev - 1 : prev));
        }
        break;
      case 'Enter':
      case ' ':
        if (isOpen && focusedIndex >= 0) {
          e.preventDefault();
          handleSelect(accounts[focusedIndex].id);
        } else {
          e.preventDefault();
          toggleDropdown();
        }
        break;
      case 'Tab':
        if (isOpen) {
          setIsOpen(false);
        }
        break;
      default:
        // If user types a letter, focus on the first matching account
        if (/^[a-zA-Z]$/.test(e.key) && isOpen) {
          const index = accounts.findIndex(account => 
            account.name.toLowerCase().startsWith(e.key.toLowerCase())
          );
          if (index >= 0) {
            setFocusedIndex(index);
          }
        }
        break;
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Update focus when focused index changes
  useEffect(() => {
    if (isOpen && focusedIndex >= 0 && optionsRef.current[focusedIndex]) {
      optionsRef.current[focusedIndex]?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [focusedIndex, isOpen]);

  // Initialize optionsRef array when accounts change
  useEffect(() => {
    optionsRef.current = optionsRef.current.slice(0, accounts.length);
  }, [accounts]);

  return (
    <div 
      className={`relative w-full ${className}`} 
      ref={dropdownRef}
      onKeyDown={handleKeyDown}
    >
      {label && (
        <label 
          id={labelId}
          htmlFor={uniqueId}
          className="block text-sm font-medium mb-1 text-foreground"
        >
          {label}
          {required && (
            <span className="text-destructive ml-1" aria-hidden="true">*</span>
          )}
          {required && <span className="sr-only"> (Required)</span>}
        </label>
      )}
      
      <button
        id={uniqueId}
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-3 py-2 text-left bg-background border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        } ${error ? 'border-destructive' : 'border-border'}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-labelledby={label ? labelId : undefined}
        aria-describedby={error ? `${uniqueId}-error` : undefined}
        aria-required={required}
      >
        {selectedAccount ? (
          <div className="flex items-center space-x-2">
            <div 
              className="w-3 h-3 rounded-full" 
              style={{ backgroundColor: selectedAccount.color || 'var(--primary)' }}
              aria-hidden="true"
            />
            <span className="mr-2">{selectedAccount.name}</span>
            <span className="text-muted-foreground text-sm">
              {formatCurrency(selectedAccount.balance, selectedAccount.currency)}
            </span>
          </div>
        ) : (
          <span className="text-muted-foreground">{t(placeholder)}</span>
        )}
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} 
          aria-hidden="true"
        />
      </button>

      {isOpen && (
        <div 
          className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto"
          role="presentation"
        >
          <ul 
            id={listboxId}
            ref={listboxRef}
            className="py-1" 
            role="listbox"
            aria-labelledby={labelId}
            tabIndex={-1}
          >
            {accounts.map((account, index) => (
              <li
                key={account.id}
                ref={el => optionsRef.current[index] = el}
                role="option"
                aria-selected={account.id === selectedAccountId}
                tabIndex={focusedIndex === index ? 0 : -1}
                id={`${uniqueId}-option-${account.id}`}
                onClick={() => handleSelect(account.id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleSelect(account.id);
                  }
                }}
                className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent ${
                  account.id === selectedAccountId ? 'bg-accent/50' : ''
                } ${focusedIndex === index ? 'bg-accent/70 outline-none ring-1 ring-primary' : ''}`}
              >
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: account.color || 'var(--primary)' }}
                    aria-hidden="true"
                  />
                  <span>{account.name}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-muted-foreground text-sm">
                    {formatCurrency(account.balance, account.currency)}
                  </span>
                  {account.id === selectedAccountId && (
                    <Check className="w-4 h-4 text-primary" aria-hidden="true" />
                  )}
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {error && (
        <p 
          id={`${uniqueId}-error`}
          className="mt-1 text-sm text-destructive"
          aria-live="polite"
        >
          {error}
        </p>
      )}
    </div>
  );
};

export default AccountSelector; 