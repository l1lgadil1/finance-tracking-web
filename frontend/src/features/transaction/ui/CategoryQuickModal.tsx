import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { categoryApi } from '@/entities/category/api/categoryApi';
import { Button } from '@/shared/ui/Button';
import { useTransactionModal } from '../model/useTransactionModal';
import { api } from '@/shared/api/api';

interface CategoryQuickModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: {
    id?: string;
    name?: string;
    description?: string;
    color?: string;
    icon?: string;
    profileId?: string;
    type?: string;
    categoryTypeId?: string;
    categoryTypeNameSnapshot?: string;
  };
  locale: 'en' | 'ru';
  onSuccess?: () => void;
  profileId: string;
}

const translations = {
  en: {
    addTitle: 'Add Category',
    editTitle: 'Edit Category',
    name: 'Name',
    description: 'Description',
    color: 'Color',
    icon: 'Icon',
    type: 'Type',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    gaveDebt: 'Gave Debt',
    tookDebt: 'Took Debt',
    repayDebt: 'Repay Debt',
    save: 'Save',
    cancel: 'Cancel',
    selectType: 'Select type',
  },
  ru: {
    addTitle: 'Добавить категорию',
    editTitle: 'Редактировать категорию',
    name: 'Название',
    description: 'Описание',
    color: 'Цвет',
    icon: 'Иконка',
    type: 'Тип',
    income: 'Доход',
    expense: 'Расход',
    transfer: 'Перевод',
    gaveDebt: 'Дал в долг',
    tookDebt: 'Взял в долг',
    repayDebt: 'Возврат долга',
    save: 'Сохранить',
    cancel: 'Отмена',
    selectType: 'Выберите тип',
  },
};

// Helper function to get a valid category type ID
const getValidCategoryTypeId = async (desiredTypeName = 'Income') => {
  try {
    // Direct API call to get all category types
    const response = await api.get('/category-types');
    console.log('Available category types from direct API call:', response);
    
    if (Array.isArray(response) && response.length > 0) {
      // First try to find by name
      const matchByName = response.find(type => type.name === desiredTypeName);
      if (matchByName) return matchByName.id;
      
      // Otherwise return the first one
      return response[0].id;
    }
    return null;
  } catch (error) {
    console.error('Error fetching category types:', error);
    return null;
  }
};

export const CategoryQuickModal: React.FC<CategoryQuickModalProps> = ({
  isOpen,
  onClose,
  initialData,
  locale,
  onSuccess,
  profileId,
}) => {
  const t = translations[locale] || translations.en;
  const [form, setForm] = useState({
    name: initialData?.name || '',
    description: initialData?.description || '',
    color: initialData?.color || '#8884d8',
    icon: initialData?.icon || '',
    profileId: initialData?.profileId || profileId,
    categoryTypeId: initialData?.categoryTypeId || '',
    type: initialData?.type || '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    categoryTypes,
    isCategoryTypesLoading,
    isCategoryTypesError,
  } = useTransactionModal();

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        description: initialData?.description || '',
        color: initialData?.color || '#8884d8',
        icon: initialData?.icon || '',
        profileId: initialData?.profileId || profileId,
        categoryTypeId: initialData?.categoryTypeId || '',
        type: initialData?.type || '',
      });
      setError(null);
      
      // Debug available category types
      console.log('Available category types:', categoryTypes);
    }
  }, [isOpen, initialData, profileId, categoryTypes]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    // Log the form data for debugging
    console.log('Submitting category form data:', form);
    
    try {
      // Get a valid category type ID
      let categoryTypeId = form.categoryTypeId;
      
      // Try to get a valid category type ID if submission fails
      const submitWithRetry = async () => {
        try {
          if (initialData?.id) {
            await categoryApi.update(initialData.id, {
              name: form.name,
              description: form.description,
              color: form.color,
              icon: form.icon,
              profileId: form.profileId,
              categoryTypeId: categoryTypeId,
            });
          } else {
            await categoryApi.create({
              name: form.name,
              description: form.description,
              color: form.color,
              icon: form.icon,
              profileId: form.profileId,
              categoryTypeId: categoryTypeId,
            });
          }
          return true;
        } catch (submitError) {
          console.error('Submission failed with ID:', categoryTypeId, submitError);
          return false;
        }
      };
      
      // First attempt with provided ID
      let success = await submitWithRetry();
      
      // If first attempt fails, try with a valid category type ID
      if (!success) {
        console.log('First attempt failed, trying with a valid category type...');
        const validId = await getValidCategoryTypeId(form.type === 'income' ? 'Income' : 'Expense');
        
        if (validId) {
          console.log('Got valid category type ID:', validId);
          categoryTypeId = validId;
          success = await submitWithRetry();
        }
      }
      
      if (success) {
        setLoading(false);
        onSuccess?.();
        onClose();
      } else {
        throw new Error('Failed to create category after retry');
      }
    } catch (err: unknown) {
      console.error('Error creating/updating category:', err);
      
      // Detailed error logging
      if (typeof err === 'object' && err !== null) {
        console.error('Error details:', JSON.stringify(err, null, 2));
      }
      
      // Display appropriate error message
      if (typeof err === 'object' && err && 'message' in err) {
        const errorMessage = (err as { message?: string }).message || '';
        
        if (errorMessage.includes('Category type not found') || 
            (typeof err === 'object' && 'statusCode' in err && (err as { statusCode?: number }).statusCode === 404)) {
          setError('The system could not find a valid category type. Please contact support.');
        } else {
          setError(errorMessage || 'Error creating category');
        }
      } else {
        setError('Error creating category');
      }
      
      setLoading(false);
    }
  };

  // Helper function to get localized category type name
  const getLocalizedTypeName = (typeName: string) => {
    switch (typeName) {
      case 'Income': return t.income;
      case 'Expense': return t.expense;
      case 'Transfer': return t.transfer;
      case 'Gave Debt': return t.gaveDebt;
      case 'Took Debt': return t.tookDebt;
      case 'Repay Debt': return t.repayDebt;
      default: return typeName;
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData?.id ? t.editTitle : t.addTitle}>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm font-medium mb-1">{t.name}</label>
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.description}</label>
          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            rows={2}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.color}</label>
          <input
            name="color"
            type="color"
            value={form.color}
            onChange={handleChange}
            className="w-12 h-8 p-0 border rounded"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.icon}</label>
          <input
            name="icon"
            value={form.icon}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            placeholder="e.g. fa-solid fa-star"
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">{t.type}</label>
          <div className="flex gap-2 items-center">
            <select
              name="categoryTypeId"
              value={form.categoryTypeId || ''}
              onChange={handleChange}
              className="w-full rounded-lg border px-3 py-2"
              required
              disabled={isCategoryTypesLoading || isCategoryTypesError}
            >
              <option value="">
                {isCategoryTypesLoading 
                  ? 'Loading...' 
                  : isCategoryTypesError 
                    ? 'Error loading types' 
                    : t.selectType}
              </option>
              {categoryTypes && categoryTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {getLocalizedTypeName(type.name)}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            {t.cancel}
          </Button>
          {initialData?.id && (
            <Button
              variant="secondary"
              type="button"
              className="text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
              onClick={async () => {
                if (window.confirm('Are you sure you want to delete this category?')) {
                  setLoading(true);
                  setError(null);
                  try {
                    await categoryApi.delete(initialData.id!);
                    setLoading(false);
                    onSuccess?.();
                    onClose();
                  } catch {
                    setError('Error deleting category');
                    setLoading(false);
                  }
                }
              }}
              disabled={loading}
            >
              Delete
            </Button>
          )}
          <Button type="submit" isLoading={loading} disabled={loading}>
            {t.save}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
      </form>
    </Modal>
  );
}; 