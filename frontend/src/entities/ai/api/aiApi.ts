import { api } from '@/shared/api/api';

export interface AIInsight {
  id: string;
  type: 'highExpense' | 'savingOpportunity' | 'budgetAlert' | 'positiveTrend';
  message: string;
  icon: string;
  userId: string;
  createdAt: string;
}

export interface AIRecommendation {
  insights: AIInsight[];
  tips: string[];
}

export const aiApi = {
  getInsights: () => 
    api.get<AIRecommendation>('/ai-recommendations'),
    
  generateInsights: () => 
    api.post<AIRecommendation>('/ai-recommendations/generate', {}),
}; 