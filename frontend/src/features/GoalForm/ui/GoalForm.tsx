import { FC, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useGoalsStore, Goal, GoalStatus } from '@/store/goals-store';
import { Input } from '@/shared/ui/Input';
import { Button } from '@/shared/ui/Button';
import { DatePicker } from '@/shared/ui/DatePicker';
import { Badge } from '@/shared/ui/Badge';
import { Locale } from '@/shared/lib/i18n';

interface GoalFormProps {
  initialData?: Goal;
  onCancel: () => void;
  onSubmit: () => void;
  locale: Locale;
}

const goalFormTranslations = {
  en: {
    addGoal: 'Add Goal',
    editGoal: 'Edit Goal',
    titleLabel: 'Title',
    titlePlaceholder: 'Enter goal title',
    descriptionLabel: 'Description (optional)',
    descriptionPlaceholder: 'Add a description',
    targetAmountLabel: 'Target Amount',
    currentAmountLabel: 'Current Amount',
    targetDateLabel: 'Target Date (optional)',
    pickDate: 'Pick a date',
    statusLabel: 'Status',
    status: {
      ongoing: 'Ongoing',
      completed: 'Completed',
      paused: 'Paused'
    },
    cancel: 'Cancel',
    save: 'Save',
    create: 'Create',
    submitting: 'Submitting...',
    titleRequired: 'Title is required',
    amountRequired: 'Target amount is required',
    currentAmountRequired: 'Current amount is required'
  },
  ru: {
    addGoal: 'Добавить цель',
    editGoal: 'Изменить цель',
    titleLabel: 'Название',
    titlePlaceholder: 'Введите название цели',
    descriptionLabel: 'Описание (необязательно)',
    descriptionPlaceholder: 'Добавьте описание',
    targetAmountLabel: 'Целевая сумма',
    currentAmountLabel: 'Текущая сумма',
    targetDateLabel: 'Целевая дата (необязательно)',
    pickDate: 'Выберите дату',
    statusLabel: 'Статус',
    status: {
      ongoing: 'В процессе',
      completed: 'Завершено',
      paused: 'Приостановлено'
    },
    cancel: 'Отмена',
    save: 'Сохранить',
    create: 'Создать',
    submitting: 'Отправка...',
    titleRequired: 'Название обязательно',
    amountRequired: 'Целевая сумма обязательна',
    currentAmountRequired: 'Текущая сумма обязательна'
  }
};

export const GoalForm: FC<GoalFormProps> = ({ initialData, onCancel, onSubmit, locale }) => {
  const t = goalFormTranslations[locale] || goalFormTranslations.en;
  
  const { addGoal, updateGoal, isLoading } = useGoalsStore();
  
  const [title, setTitle] = useState(initialData?.title || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [target, setTarget] = useState(initialData?.target || 0);
  const [saved, setSaved] = useState(initialData?.saved || 0);
  const [targetDate, setTargetDate] = useState<Date | null>(initialData?.targetDate || null);
  const [status, setStatus] = useState<GoalStatus>(initialData?.status || 'ongoing');
  const [formError, setFormError] = useState<string | null>(null);
  
  const [errors, setErrors] = useState<{
    title?: string;
    target?: string;
    saved?: string;
  }>({});
  
  // Update status if saved reaches target
  useEffect(() => {
    if (saved >= target && target > 0) {
      setStatus('completed');
    } else if (status === 'completed' && saved < target) {
      setStatus('ongoing');
    }
  }, [saved, target, status]);
  
  const statuses: GoalStatus[] = ['ongoing', 'completed', 'paused'];
  
  const validateForm = () => {
    const newErrors: {
      title?: string;
      target?: string;
      saved?: string;
    } = {};
    
    if (!title.trim()) {
      newErrors.title = t.titleRequired;
    }
    
    if (!target || target <= 0) {
      newErrors.target = t.amountRequired;
    }
    
    if (saved === undefined || saved < 0) {
      newErrors.saved = t.currentAmountRequired;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    try {
      setFormError(null);
      
      const goalData = {
        title,
        description: description || undefined,
        target,
        saved,
        targetDate: targetDate || undefined,
        status,
        // Use default category as 'savings' since we're removing the category selection
        category: initialData?.category || 'savings',
        colorHex: initialData?.colorHex || '#4f46e5'
      };
      
      if (initialData) {
        await updateGoal(initialData.id, goalData);
      } else {
        await addGoal(goalData);
      }
      
      onSubmit();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'An error occurred while saving the goal');
    }
  };
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="space-y-4"
    >
      <h2 className="text-xl font-semibold">
        {initialData ? t.editGoal : t.addGoal}
      </h2>
      
      {formError && (
        <div className="p-3 bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md">
          {formError}
        </div>
      )}
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="title">
          {t.titleLabel}*
        </label>
        <Input
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t.titlePlaceholder}
          className={errors.title ? 'border-red-500' : ''}
          disabled={isLoading}
        />
        {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="description">
          {t.descriptionLabel}
        </label>
        <Input
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={t.descriptionPlaceholder}
          disabled={isLoading}
        />
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="target">
            {t.targetAmountLabel}*
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
            <Input
              id="target"
              value={target}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value === '') {
                  setTarget(0);
                } else {
                  setTarget(parseInt(value, 10));
                }
              }}
              className={`pl-7 ${errors.target ? 'border-red-500' : ''}`}
              disabled={isLoading}
              type="text"
              inputMode="numeric"
            />
          </div>
          {errors.target && <p className="text-red-500 text-xs mt-1">{errors.target}</p>}
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="saved">
            {t.currentAmountLabel}*
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2">$</span>
            <Input
              id="saved"
              value={saved}
              onChange={(e) => {
                const value = e.target.value.replace(/[^\d]/g, '');
                if (value === '') {
                  setSaved(0);
                } else {
                  setSaved(parseInt(value, 10));
                }
              }}
              className={`pl-7 ${errors.saved ? 'border-red-500' : ''}`}
              disabled={isLoading}
              type="text"
              inputMode="numeric"
            />
          </div>
          {errors.saved && <p className="text-red-500 text-xs mt-1">{errors.saved}</p>}
        </div>
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1" htmlFor="targetDate">
          {t.targetDateLabel}
        </label>
        <DatePicker
          value={targetDate}
          onChange={setTargetDate}
          placeholder={t.pickDate}
          className="w-full"
          disabled={isLoading}
        />
      </div>
      
      <div>
        <label className="block text-sm font-medium mb-1">
          {t.statusLabel}
        </label>
        <div className="flex flex-wrap gap-2">
          {statuses.map((stat) => (
            <div
              key={stat}
              onClick={() => !isLoading && setStatus(stat)}
              className={`cursor-pointer ${isLoading ? 'opacity-60' : ''}`}
            >
              <Badge
                variant={status === stat ? 'primary' : 'secondary'}
                className="cursor-pointer"
              >
                {t.status[stat]}
              </Badge>
            </div>
          ))}
        </div>
      </div>
      
      <div className="flex justify-end space-x-2 pt-4">
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {t.cancel}
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={isLoading}>
          {isLoading ? t.submitting : initialData ? t.save : t.create}
          {isLoading && (
            <span className="ml-2 inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          )}
        </Button>
      </div>
    </motion.div>
  );
}; 