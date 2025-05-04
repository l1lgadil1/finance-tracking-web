import { api } from '@/shared/api/api';

export interface Subscription {
  id: string;
  userId: string;
  planId: string;
  planNameSnapshot: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'cancelled' | 'expired';
  autoRenew: boolean;
  price: number;
}

export interface BillingHistory {
  id: string;
  subscriptionId: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  userId: string;
}

export const subscriptionApi = {
  getCurrentSubscription: () => 
    api.get<Subscription>('/subscriptions/current'),
    
  getAvailablePlans: () => 
    api.get<Array<{
      id: string;
      name: string;
      price: number;
      interval: string; // monthly, yearly
      description: string;
      features: string[];
      isPopular?: boolean;
    }>>('/subscriptions/plans'),
    
  subscribe: (planId: string) => 
    api.post<Subscription>('/subscriptions', { planId }),
    
  cancelSubscription: (subscriptionId: string) => 
    api.delete<{ success: boolean }>(`/subscriptions/${subscriptionId}`),
    
  updateSubscription: (subscriptionId: string, data: { autoRenew?: boolean }) => 
    api.patch<Subscription>(`/subscriptions/${subscriptionId}`, data),
    
  getBillingHistory: () => 
    api.get<BillingHistory[]>('/subscriptions/billing-history'),
}; 