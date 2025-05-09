'use client';
import React, { useState, useEffect } from 'react';
import { FiPlus, FiEdit2, FiTrash2, FiTag, FiAlertCircle, FiFilter } from 'react-icons/fi';
import { Card, CardHeader, CardBody, Button, Dialog } from '@/shared/ui';
import { Locale } from '@/shared/lib/i18n';
import { api } from '@/shared/api';
import { ToastProvider } from '@/shared/ui/Toast/ToastProvider';
import { useQueryClient } from '@tanstack/react-query';

// Define translations
const translations = {
  en: {
    categoryManagement: 'Category Management',
    categories: 'Categories',
    categoryTypes: 'Category Types',
    createCategory: 'Create Category',
    editCategory: 'Edit Category',
    deleteCategory: 'Delete Category',
    name: 'Name',
    icon: 'Icon',
    type: 'Type',
    actions: 'Actions',
    save: 'Save',
    cancel: 'Cancel',
    confirm: 'Confirm',
    noCategories: 'No categories found. Create one to get started.',
    confirmDelete: 'Are you sure you want to delete this category?',
    confirmDeleteText: 'This action cannot be undone. All transactions with this category will be uncategorized.',
    filterByType: 'Filter by Type',
    allTypes: 'All Types',
    namePlaceholder: 'Enter category name',
    iconPlaceholder: 'Enter icon name (e.g., "money", "shopping")',
    selectType: 'Select category type',
    success: 'Success',
    error: 'Error',
    categoryCreated: 'Category created successfully',
    categoryUpdated: 'Category updated successfully',
    categoryDeleted: 'Category deleted successfully',
    errorCreating: 'Error creating category',
    errorUpdating: 'Error updating category',
    errorDeleting: 'Error deleting category',
    errorFetching: 'Error fetching categories',
    systemTypesNote: 'System category types cannot be edited or deleted.',
    income: 'Income',
    expense: 'Expense',
    transfer: 'Transfer',
    debtGive: 'Gave Debt',
    debtTake: 'Took Debt',
    debtRepay: 'Repay Debt',
  },
  ru: {
    categoryManagement: 'Управление категориями',
    categories: 'Категории',
    categoryTypes: 'Типы категорий',
    createCategory: 'Создать категорию',
    editCategory: 'Редактировать категорию',
    deleteCategory: 'Удалить категорию',
    name: 'Название',
    icon: 'Иконка',
    type: 'Тип',
    actions: 'Действия',
    save: 'Сохранить',
    cancel: 'Отмена',
    confirm: 'Подтвердить',
    noCategories: 'Категории не найдены. Создайте категорию, чтобы начать.',
    confirmDelete: 'Вы уверены, что хотите удалить эту категорию?',
    confirmDeleteText: 'Это действие нельзя отменить. Все транзакции с этой категорией станут без категории.',
    filterByType: 'Фильтр по типу',
    allTypes: 'Все типы',
    namePlaceholder: 'Введите название категории',
    iconPlaceholder: 'Введите название иконки (например, "money", "shopping")',
    selectType: 'Выберите тип категории',
    success: 'Успех',
    error: 'Ошибка',
    categoryCreated: 'Категория успешно создана',
    categoryUpdated: 'Категория успешно обновлена',
    categoryDeleted: 'Категория успешно удалена',
    errorCreating: 'Ошибка при создании категории',
    errorUpdating: 'Ошибка при обновлении категории',
    errorDeleting: 'Ошибка при удалении категории',
    errorFetching: 'Ошибка при загрузке категорий',
    systemTypesNote: 'Системные типы категорий нельзя редактировать или удалять.',
    income: 'Доход',
    expense: 'Расход',
    transfer: 'Перевод',
    debtGive: 'Дал в долг',
    debtTake: 'Взял в долг',
    debtRepay: 'Погасить долг',
  }
};

// Define the interface for category
interface Category {
  id: string;
  name: string;
  icon?: string;
  categoryTypeId?: string;
  userId?: string;
}

// Define the interface for category type
interface CategoryType {
  id: string;
  name: string;
  isSystem: boolean;
}

interface CategorySectionProps {
  locale: Locale;
}

// Simple toast interface
interface ToastHandler {
  toast: (props: { title: string; description: string; variant?: string }) => void;
}

// Inner component that uses toast functionality
const CategorySectionContent = ({ locale }: CategorySectionProps) => {
  const queryClient = useQueryClient();
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoryTypes, setCategoryTypes] = useState<CategoryType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [selectedTypeFilter, setSelectedTypeFilter] = useState<string>('');
  const [formData, setFormData] = useState<Partial<Category>>({
    name: '',
    icon: '',
    categoryTypeId: '',
  });
  
  const t = translations[locale];
  
  // Simple fallback toast implementation using alert
  const toast: ToastHandler['toast'] = (props) => {
    console.log(`Toast: ${props.title} - ${props.description}`);
    alert(`${props.title}: ${props.description}`);
  };
  
  // Fetch categories and category types on component mount
  useEffect(() => {
    fetchCategoryTypes();
    fetchCategories();
  }, []);
  
  // Fetch categories from API
  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.get('/categories');
      if (Array.isArray(response) || (response && Array.isArray(response.data))) {
        setCategories(Array.isArray(response) ? response : response.data);
      } else {
        console.error('Unexpected response format when fetching categories:', response);
        setCategories([]);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast({
        title: t.error,
        description: t.errorFetching,
        variant: 'error',
      });
      setCategories([]);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Fetch category types from API
  const fetchCategoryTypes = async () => {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const response: any = await api.get('/category-types');
      if (Array.isArray(response) || (response && Array.isArray(response.data))) {
        setCategoryTypes(Array.isArray(response) ? response : response.data);
      } else {
        console.error('Unexpected response format when fetching category types:', response);
        setCategoryTypes([]);
      }
    } catch (error) {
      console.error('Error fetching category types:', error);
      setCategoryTypes([]);
    }
  };
  
  // Filter categories by selected type
  const filteredCategories = selectedTypeFilter
    ? categories.filter(cat => cat.categoryTypeId === selectedTypeFilter)
    : categories;
  
  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  // Open create category dialog
  const handleCreateClick = () => {
    setFormData({
      name: '',
      icon: '',
      categoryTypeId: categoryTypes.length > 0 ? categoryTypes[0].id : '',
    });
    setIsCreating(true);
  };
  
  // Open edit category dialog
  const handleEditClick = (category: Category) => {
    setSelectedCategory(category);
    setFormData({
      name: category.name,
      icon: category.icon || '',
      categoryTypeId: category.categoryTypeId || '',
    });
    setIsEditing(true);
  };
  
  // Open delete category dialog
  const handleDeleteClick = (category: Category) => {
    setSelectedCategory(category);
    setIsDeleting(true);
  };
  
  // Helper function to get the proper category type name for the categoryTypeNameSnapshot
  const getCategoryTypeNameSnapshot = (typeId?: string) => {
    if (!typeId) return '';
    const type = categoryTypes.find(t => t.id === typeId);
    if (!type) return '';
    
    // Return the exact string name that will be expected by the transaction modal
    let snapshot = '';
    switch (type.name.toLowerCase()) {
      case 'income': snapshot = 'Income'; break;
      case 'expense': snapshot = 'Expense'; break;
      case 'transfer': snapshot = 'Transfer'; break;
      case 'gave debt': snapshot = 'Gave Debt'; break;
      case 'took debt': snapshot = 'Took Debt'; break;
      case 'repay debt': snapshot = 'Repay Debt'; break;
      default: snapshot = type.name; // Fallback to the original name
    }
    
    console.log(`Setting categoryTypeNameSnapshot for type "${type.name}" to "${snapshot}"`);
    return snapshot;
  };
  
  // Create new category
  const handleCreateCategory = async () => {
    if (!formData.name || !formData.categoryTypeId) {
      toast({
        title: t.error,
        description: 'Name and category type are required',
        variant: 'error',
      });
      return;
    }
    
    try {
      // Add the categoryTypeNameSnapshot to the form data
      const categoryTypeNameSnapshot = getCategoryTypeNameSnapshot(formData.categoryTypeId);
      
      await api.post('/categories', {
        ...formData,
        categoryTypeNameSnapshot
      });
      toast({
        title: t.success,
        description: t.categoryCreated,
        variant: 'success',
      });
      
      // Force invalidate the categories cache so transaction modal will refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      setIsCreating(false);
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error creating category:', error);
      toast({
        title: t.error,
        description: t.errorCreating,
        variant: 'error',
      });
    }
  };
  
  // Update existing category
  const handleUpdateCategory = async () => {
    if (!selectedCategory || !formData.name || !formData.categoryTypeId) {
      return;
    }
    
    try {
      // Add the categoryTypeNameSnapshot to the form data
      const categoryTypeNameSnapshot = getCategoryTypeNameSnapshot(formData.categoryTypeId);
      
      await api.patch(`/categories/${selectedCategory.id}`, {
        ...formData,
        categoryTypeNameSnapshot
      });
      toast({
        title: t.success,
        description: t.categoryUpdated,
        variant: 'success',
      });
      
      // Force invalidate the categories cache so transaction modal will refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      setIsEditing(false);
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error updating category:', error);
      toast({
        title: t.error,
        description: t.errorUpdating,
        variant: 'error',
      });
    }
  };
  
  // Delete category
  const handleDeleteCategory = async () => {
    if (!selectedCategory) return;
    
    try {
      await api.delete(`/categories/${selectedCategory.id}`);
      toast({
        title: t.success,
        description: t.categoryDeleted,
        variant: 'success',
      });
      
      // Force invalidate the categories cache so transaction modal will refetch
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      
      setIsDeleting(false);
      fetchCategories(); // Refresh categories
    } catch (error) {
      console.error('Error deleting category:', error);
      toast({
        title: t.error,
        description: t.errorDeleting,
        variant: 'error',
      });
    }
  };
  
  // Get category type name by ID
  const getCategoryTypeName = (typeId?: string) => {
    if (!typeId) return '';
    const type = categoryTypes.find(t => t.id === typeId);
    if (!type) return '';
    
    // Map system type names to translations
    switch (type.name.toLowerCase()) {
      case 'income': return t.income;
      case 'expense': return t.expense;
      case 'transfer': return t.transfer;
      case 'gave debt': return t.debtGive;
      case 'took debt': return t.debtTake;
      case 'repay debt': return t.debtRepay;
      default: return type.name;
    }
  };
  
  return (
    <div className="space-y-8" suppressHydrationWarning>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold">{t.categoryManagement}</h2>
          <Button
            leftIcon={<FiPlus />}
            onClick={handleCreateClick}
            disabled={isLoading || categoryTypes.length === 0}
          >
            {t.createCategory}
          </Button>
        </CardHeader>
        <CardBody>
          {categoryTypes.length === 0 ? (
            <div className="p-4 bg-warning/10 rounded-md border border-warning/30">
              <div className="flex items-start">
                <FiAlertCircle className="text-warning mt-0.5 mr-2 flex-shrink-0" />
                <p className="text-sm">No category types available. System is loading or not properly initialized.</p>
              </div>
            </div>
          ) : (
            <>
              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm font-medium mb-2">
                  <FiFilter className="text-muted-foreground" />
                  {t.filterByType}:
                </label>
                <select
                  value={selectedTypeFilter}
                  onChange={(e) => setSelectedTypeFilter(e.target.value)}
                  className="w-full sm:w-auto p-2 border border-border rounded-md bg-card"
                >
                  <option value="">{t.allTypes}</option>
                  {categoryTypes.map(type => (
                    <option key={type.id} value={type.id}>
                      {getCategoryTypeName(type.id)}
                    </option>
                  ))}
                </select>
              </div>
              
              {filteredCategories.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  {t.noCategories}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="bg-muted/30">
                        <th className="text-left p-3 font-medium">{t.name}</th>
                        <th className="text-left p-3 font-medium">{t.icon}</th>
                        <th className="text-left p-3 font-medium">{t.type}</th>
                        <th className="text-right p-3 font-medium">{t.actions}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredCategories.map(category => (
                        <tr key={category.id} className="border-b border-border">
                          <td className="p-3">{category.name}</td>
                          <td className="p-3">{category.icon || '-'}</td>
                          <td className="p-3">{getCategoryTypeName(category.categoryTypeId)}</td>
                          <td className="p-3 text-right">
                            <div className="flex gap-2 justify-end">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleEditClick(category)}
                                aria-label={`Edit ${category.name}`}
                              >
                                <FiEdit2 className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleDeleteClick(category)}
                                aria-label={`Delete ${category.name}`}
                              >
                                <FiTrash2 className="h-4 w-4 text-error" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              
              <div className="mt-6 text-xs text-muted-foreground">
                <p className="flex items-center gap-1">
                  <FiTag className="text-primary" />
                  {t.systemTypesNote}
                </p>
              </div>
            </>
          )}
        </CardBody>
      </Card>
      
      {/* Create Category Dialog */}
      <Dialog
        isOpen={isCreating}
        onClose={() => setIsCreating(false)}
        title={t.createCategory}
        primaryActionText={t.save}
        onPrimaryAction={handleCreateCategory}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium mb-1">
              {t.name} *
            </label>
            <input
              id="name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder={t.namePlaceholder}
              className="w-full p-2 border border-border rounded-md bg-card"
              required
            />
          </div>
          
          <div>
            <label htmlFor="icon" className="block text-sm font-medium mb-1">
              {t.icon}
            </label>
            <input
              id="icon"
              name="icon"
              type="text"
              value={formData.icon || ''}
              onChange={handleInputChange}
              placeholder={t.iconPlaceholder}
              className="w-full p-2 border border-border rounded-md bg-card"
            />
          </div>
          
          <div>
            <label htmlFor="categoryTypeId" className="block text-sm font-medium mb-1">
              {t.type} *
            </label>
            <select
              id="categoryTypeId"
              name="categoryTypeId"
              value={formData.categoryTypeId || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-border rounded-md bg-card"
              required
            >
              <option value="" disabled>{t.selectType}</option>
              {categoryTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {getCategoryTypeName(type.id)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog
        isOpen={isEditing}
        onClose={() => setIsEditing(false)}
        title={t.editCategory}
        primaryActionText={t.save}
        onPrimaryAction={handleUpdateCategory}
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label htmlFor="edit-name" className="block text-sm font-medium mb-1">
              {t.name} *
            </label>
            <input
              id="edit-name"
              name="name"
              type="text"
              value={formData.name || ''}
              onChange={handleInputChange}
              placeholder={t.namePlaceholder}
              className="w-full p-2 border border-border rounded-md bg-card"
              required
            />
          </div>
          
          <div>
            <label htmlFor="edit-icon" className="block text-sm font-medium mb-1">
              {t.icon}
            </label>
            <input
              id="edit-icon"
              name="icon"
              type="text"
              value={formData.icon || ''}
              onChange={handleInputChange}
              placeholder={t.iconPlaceholder}
              className="w-full p-2 border border-border rounded-md bg-card"
            />
          </div>
          
          <div>
            <label htmlFor="edit-categoryTypeId" className="block text-sm font-medium mb-1">
              {t.type} *
            </label>
            <select
              id="edit-categoryTypeId"
              name="categoryTypeId"
              value={formData.categoryTypeId || ''}
              onChange={handleInputChange}
              className="w-full p-2 border border-border rounded-md bg-card"
              required
            >
              <option value="" disabled>{t.selectType}</option>
              {categoryTypes.map(type => (
                <option key={type.id} value={type.id}>
                  {getCategoryTypeName(type.id)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </Dialog>
      
      {/* Delete Category Dialog */}
      <Dialog
        isOpen={isDeleting}
        onClose={() => setIsDeleting(false)}
        title={t.deleteCategory}
        size="md"
        footer={
          <div className="flex justify-end gap-3">
            <Button 
              variant="ghost" 
              onClick={() => setIsDeleting(false)}
            >
              {t.cancel}
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDeleteCategory}
            >
              {t.confirm}
            </Button>
          </div>
        }
      >
        <p>{t.confirmDelete}</p>
        {selectedCategory && (
          <div className="my-4 p-3 bg-error/10 border border-error/30 rounded-md">
            <p className="font-medium">{selectedCategory.name}</p>
          </div>
        )}
        <p className="text-sm text-muted-foreground">{t.confirmDeleteText}</p>
      </Dialog>
    </div>
  );
};

// Main component that wraps the content with ToastProvider
export const CategorySection = ({ locale }: CategorySectionProps) => {
  return (
    <ToastProvider>
      <CategorySectionContent locale={locale} />
    </ToastProvider>
  );
}; 