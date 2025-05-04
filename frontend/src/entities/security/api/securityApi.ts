import { api } from '@/shared/api/api';

export interface ActiveSession {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  isCurrent: boolean;
  ip?: string;
}

export interface TwoFactorAuthStatus {
  enabled: boolean;
  verifiedAt?: string;
}

export const securityApi = {
  getActiveSessions: () => 
    api.get<ActiveSession[]>('/security/sessions'),
    
  terminateSession: (sessionId: string) => 
    api.delete<{ success: boolean }>(`/security/sessions/${sessionId}`),
    
  terminateAllSessions: () => 
    api.delete<{ success: boolean }>('/security/sessions'),
    
  getTwoFactorStatus: () => 
    api.get<TwoFactorAuthStatus>('/security/two-factor'),
    
  enableTwoFactor: () => 
    api.post<{ secret: string; qrCodeUrl: string }>('/security/two-factor/enable'),
    
  verifyTwoFactor: (code: string) => 
    api.post<{ success: boolean }>('/security/two-factor/verify', { code }),
    
  disableTwoFactor: (code: string) => 
    api.post<{ success: boolean }>('/security/two-factor/disable', { code }),
    
  changePassword: (data: { currentPassword: string; newPassword: string }) => 
    api.post<{ success: boolean }>('/auth/change-password', data),
}; 