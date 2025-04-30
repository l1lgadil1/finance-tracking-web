import { api } from '@/shared/api/api';

export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  color?: string;
  profileId: string;
}

export const categoryApi = {
  getAll: () => 
    api.get<Category[]>('/categories'),
    
  getById: (id: string) => 
    api.get<Category>(`/categories/${id}`),
    
  create: (data: Omit<Category, 'id'>) => 
    api.post<Category>('/categories', data),
    
  update: (id: string, data: Partial<Omit<Category, 'id'>>) => 
    api.put<Category>(`/categories/${id}`, data),
    
  delete: (id: string) => 
    api.delete<{ success: boolean }>(`/categories/${id}`),
}; 