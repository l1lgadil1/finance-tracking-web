import { api } from '@/shared/api/api';

export interface UserCredentials {
  email: string;
  password: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Profile {
  id: string;
  name: string;
  userId: string;
}

export const userApi = {
  login: (credentials: UserCredentials) => 
    api.post<{ token: string; user: UserProfile }>('/auth/login', credentials),
      
  register: (userData: UserCredentials) => 
    api.post<{ token: string; user: UserProfile }>('/auth/register', userData),
    
  getProfile: () => api.get<UserProfile>('/auth/profile'),

  updateProfile: (profileData: {
    name?: string;
    email?: string;
    phone?: string;
  }) => api.patch<UserProfile>('/auth/profile', profileData),

  getProfiles: () => api.get<Profile[]>('/profiles'),
}; 