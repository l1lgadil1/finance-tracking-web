import { api } from '@/shared/api/api';

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ip?: string;
}

export const securityApi = {
  getActiveSessions: () => 
    api.get<ActiveSession[]>('/security/sessions'),
    
  terminateSession: (sessionId: string) => 
    api.delete<{ success: boolean }>(`/security/sessions/${sessionId}`),
    
  terminateAllSessions: () => 
    api.delete<{ success: boolean }>('/security/sessions'),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.post<{ success: boolean }>('/auth/change-password', data),
}; 