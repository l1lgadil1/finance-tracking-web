import { api } from '@/shared/api/api';

export interface AccountType {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  userId: string;
}

export const accountTypeApi = {
  getAll: () => api.get<AccountType[]>('/account-types'),
  getById: (id: string) => api.get<AccountType>(`/account-types/${id}`),
  create: (data: Omit<AccountType, 'id' | 'userId'>) => api.post<AccountType>('/account-types', data),
  update: (id: string, data: Partial<Omit<AccountType, 'id' | 'userId'>>) => api.patch<AccountType>(`/account-types/${id}`, data),
  delete: (id: string) => api.delete<{ success: boolean }>(`/account-types/${id}`),
}; 