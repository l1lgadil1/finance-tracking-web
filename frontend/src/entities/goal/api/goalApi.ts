import { api } from '@/shared/api/api';

export interface Goal {
  id: string;
  title: string;
  target: number;
  current: number;
  deadline: string;
  userId: string;
}

export const goalApi = {
  getAll: () => 
    api.get<Goal[]>('/goals'),
    
  getById: (id: string) => 
    api.get<Goal>(`/goals/${id}`),
    
  create: (data: Omit<Goal, 'id' | 'userId'>) => 
    api.post<Goal>('/goals', data),
    
  update: (id: string, data: Partial<Omit<Goal, 'id' | 'userId'>>) => 
    api.patch<Goal>(`/goals/${id}`, data),
    
  delete: (id: string) => 
    api.delete<{ success: boolean }>(`/goals/${id}`),
}; 