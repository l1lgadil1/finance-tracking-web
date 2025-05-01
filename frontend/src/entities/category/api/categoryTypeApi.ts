import { api } from '@/shared/api/api';

export interface CategoryType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  userId: string;
  isSystem: boolean;
}

/**
 * API client for system category types
 * These are global types that don't require authentication
 */
export const categoryTypeApi = {
  getAll: () => api.get<CategoryType[]>('/category-types'),
  getById: (id: string) => api.get<CategoryType>(`/category-types/${id}`),
}; 