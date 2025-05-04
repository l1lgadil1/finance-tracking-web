import React, { useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
import { useTranslation } from 'next-i18next';

export interface Category {
  id: string;
  name: string;
  icon?: string;
  color?: string;
  type: 'income' | 'expense' | 'both';
}

export interface CategorySelectorProps {
  categories: Category[];
  selectedCategoryId?: string;
  onChange: (categoryId: string) => void;
  transactionType?: 'income' | 'expense' | 'transfer' | 'debt';
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  className?: string;
  error?: string;
  showSearch?: boolean;
}

export const CategorySelector: React.FC<CategorySelectorProps> = ({
  categories,
  selectedCategoryId,
  onChange,
  transactionType = 'expense',
  label,
  placeholder = 'Select category',
  disabled = false,
  required = false,
  className = '',
  error,
  showSearch = true,
}) => {
  const { t } = useTranslation('common');
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Filter categories based on transaction type
  const filteredCategories = categories.filter(category => {
    // For income, show only income categories
    if (transactionType === 'income') {
      return category.type === 'income' || category.type === 'both';
    }
    // For expense, show only expense categories
    if (transactionType === 'expense') {
      return category.type === 'expense' || category.type === 'both';
    }
    // For debt/transfer, show all categories
    return true;
  });

  // Further filter based on search term
  const searchFilteredCategories = filteredCategories.filter(category => {
    if (!searchTerm) return true;
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
  
  const selectedCategory = categories.find(category => category.id === selectedCategoryId);
  
  const toggleDropdown = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
      setSearchTerm('');
    }
  };

  const handleSelect = (categoryId: string) => {
    onChange(categoryId);
    setIsOpen(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={`relative w-full ${className}`}>
      {label && (
        <label className="block text-sm font-medium mb-1 text-foreground">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      
      <button
        type="button"
        onClick={toggleDropdown}
        disabled={disabled}
        className={`flex items-center justify-between w-full px-3 py-2 text-left bg-background border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/50 ${
          disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'
        } ${error ? 'border-destructive' : 'border-border'}`}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedCategory ? (
          <div className="flex items-center space-x-2">
            <div 
              className="w-5 h-5 rounded-full flex items-center justify-center text-background"
              style={{ backgroundColor: selectedCategory.color || 'var(--primary)' }}
            >
              {selectedCategory.icon ? (
                <span className="text-xs">{selectedCategory.icon}</span>
              ) : null}
            </div>
            <span>{selectedCategory.name}</span>
          </div>
        ) : (
          <span className="text-muted-foreground">{t(placeholder)}</span>
        )}
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-10 w-full mt-1 bg-card border border-border rounded-md shadow-lg max-h-60 overflow-auto">
          {showSearch && (
            <div className="sticky top-0 p-2 bg-card border-b border-border">
              <div className="relative">
                <input
                  type="text"
                  value={searchTerm}
                  onChange={handleSearchChange}
                  placeholder={t('Search categories')}
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-border rounded focus:outline-none focus:ring-2 focus:ring-primary/50 bg-background"
                  onClick={(e) => e.stopPropagation()}
                />
                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              </div>
            </div>
          )}
          
          <ul className="py-1" role="listbox">
            {searchFilteredCategories.length > 0 ? (
              searchFilteredCategories.map((category) => (
                <li
                  key={category.id}
                  role="option"
                  aria-selected={category.id === selectedCategoryId}
                  onClick={() => handleSelect(category.id)}
                  className={`flex items-center justify-between px-3 py-2 cursor-pointer hover:bg-accent ${
                    category.id === selectedCategoryId ? 'bg-accent/50' : ''
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <div 
                      className="w-5 h-5 rounded-full flex items-center justify-center text-background"
                      style={{ backgroundColor: category.color || 'var(--primary)' }}
                    >
                      {category.icon ? (
                        <span className="text-xs">{category.icon}</span>
                      ) : null}
                    </div>
                    <span>{category.name}</span>
                  </div>
                  {category.id === selectedCategoryId && (
                    <Check className="w-4 h-4 text-primary" />
                  )}
                </li>
              ))
            ) : (
              <li className="px-3 py-2 text-muted-foreground text-sm">
                {t('No categories found')}
              </li>
            )}
          </ul>
        </div>
      )}
      
      {error && (
        <p className="mt-1 text-sm text-destructive">{error}</p>
      )}
    </div>
  );
};

export default CategorySelector; 