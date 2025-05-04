import { api } from '@/shared/api/api';

export interface Account {
  id: string;
  name: string;
  balance: number;
  currency: string;
  type?: 'cash' | 'bank' | 'credit';
  accountTypeId: string;
  icon?: string;
  userId: string;
}

export const accountApi = {
  getAll: () => 
    api.get<Account[]>('/accounts'),
    
  getById: (id: string) => 
    api.get<Account>(`/accounts/${id}`),
    
  create: (data: Omit<Account, 'id' | 'userId'>) => 
    api.post<Account>('/accounts', data),
    
  update: (id: string, data: Partial<Omit<Account, 'id' | 'userId'>>) => 
    api.patch<Account>(`/accounts/${id}`, data),
    
  delete: (id: string) => 
    api.delete<{ success: boolean }>(`/accounts/${id}`),
}; 