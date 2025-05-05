import { api } from '@/shared/api/api';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: string;
}

export interface ConversationListResponse {
  conversations: Conversation[];
  total: number;
}

export interface ConversationDetailResponse {
  id: string;
  title: string | null;
  createdAt: Date;
  updatedAt: Date;
  messages: ChatMessage[];
}

export interface ConversationRequest {
  message: string;
  contextId?: string;
}

export interface ConversationResponse {
  id: string;
  message: string;
  contextId: string;
  history?: ChatMessage[];
}

export interface ReportRequest {
  type: 'MONTHLY_SPENDING' | 'INCOME_VS_EXPENSES' | 'CASH_FLOW' | 'GOAL_PROGRESS' | 'CATEGORY_TRENDS';
  startDate?: Date;
  endDate?: Date;
  categoryIds?: string[];
  goalIds?: string[];
  profileIds?: string[];
  format?: 'JSON' | 'CSV' | 'PDF';
}

export interface ReportResponse {
  id: string;
  type: string;
  data: Record<string, unknown>;
  generatedAt: Date;
  format: 'JSON' | 'CSV' | 'PDF';
  url?: string;
}

// Helper function for debugging API responses
const withDebugLogging = async <T>(apiCall: Promise<T>, endpoint: string): Promise<T> => {
  try {
    const result = await apiCall;
    console.debug(`API response from ${endpoint}:`, result);
    return result;
  } catch (error) {
    console.error(`API error from ${endpoint}:`, error);
    throw error;
  }
};

export const aiAssistantApi = {
  // Conversation endpoints
  sendMessage: (data: ConversationRequest) => 
    withDebugLogging(
      api.post<ConversationResponse>('/ai-assistant/chat', data),
      '/ai-assistant/chat'
    ),
  
  // Conversation history endpoints
  getConversations: () => 
    withDebugLogging(
      api.get<ConversationListResponse>('/ai-assistant/conversations'),
      '/ai-assistant/conversations'
    ),
    
  getConversationDetail: (id: string) => 
    withDebugLogging(
      api.get<ConversationDetailResponse>(`/ai-assistant/conversations/${id}`),
      `/ai-assistant/conversations/${id}`
    ),
  
  // Report generation endpoints
  generateReport: (data: ReportRequest) => 
    withDebugLogging(
      api.post<ReportResponse>('/ai-assistant/reports', data),
      '/ai-assistant/reports'
    ),
  
  // Analysis endpoints
  analyzeSpending: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const endpoint = `/ai-assistant/analyze/spending?${params.toString()}`;
    
    return withDebugLogging(
      api.get<Record<string, unknown>>(endpoint),
      endpoint
    );
  },
  
  analyzeIncomeVsExpenses: (startDate?: string, endDate?: string) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    const endpoint = `/ai-assistant/analyze/income-expenses?${params.toString()}`;
    
    return withDebugLogging(
      api.get<Record<string, unknown>>(endpoint),
      endpoint
    );
  },
  
  analyzeGoals: (goalIds?: string[]) => {
    const params = new URLSearchParams();
    if (goalIds && goalIds.length) params.append('goalIds', goalIds.join(','));
    const endpoint = `/ai-assistant/analyze/goals?${params.toString()}`;
    
    return withDebugLogging(
      api.get<Record<string, unknown>>(endpoint),
      endpoint
    );
  },
  
  analyzeCategories: (startDate?: string, endDate?: string, categoryIds?: string[]) => {
    const params = new URLSearchParams();
    if (startDate) params.append('startDate', startDate);
    if (endDate) params.append('endDate', endDate);
    if (categoryIds && categoryIds.length) params.append('categoryIds', categoryIds.join(','));
    const endpoint = `/ai-assistant/analyze/categories?${params.toString()}`;
    
    return withDebugLogging(
      api.get<Record<string, unknown>>(endpoint),
      endpoint
    );
  },
}; 