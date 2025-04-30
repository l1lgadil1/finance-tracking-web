import React, { useState, useEffect } from 'react';
import { Modal } from '@/shared/ui/Modal';
import { categoryApi } from '@/entities/category/api/categoryApi';
import { Button } from '@/shared/ui/Button';

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
    save: 'Save',
    cancel: 'Cancel',
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
    save: 'Сохранить',
    cancel: 'Отмена',
  },
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
    type: initialData?.type || 'expense',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setForm({
        name: initialData?.name || '',
        description: initialData?.description || '',
        color: initialData?.color || '#8884d8',
        icon: initialData?.icon || '',
        profileId: initialData?.profileId || profileId,
        type: initialData?.type || 'expense',
      });
      setError(null);
    }
  }, [isOpen, initialData, profileId]);

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
    try {
      if (initialData?.id) {
        await categoryApi.update(initialData.id, form);
      } else {
        await categoryApi.create(form);
      }
      setLoading(false);
      onSuccess?.();
      onClose();
    } catch (err: unknown) {
      if (typeof err === 'object' && err && 'message' in err) {
        setError((err as { message?: string }).message || 'Error');
      } else {
        setError('Error');
      }
      setLoading(false);
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
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="w-full rounded-lg border px-3 py-2"
            required
          >
            <option value="income">{t.income}</option>
            <option value="expense">{t.expense}</option>
          </select>
        </div>
        <div className="flex justify-end space-x-2 pt-2">
          <Button variant="secondary" onClick={onClose} type="button">
            {t.cancel}
          </Button>
          <Button type="submit" isLoading={loading} disabled={loading}>
            {t.save}
          </Button>
        </div>
        {error && <div className="text-red-500 text-sm pt-2">{error}</div>}
      </form>
    </Modal>
  );
}; 