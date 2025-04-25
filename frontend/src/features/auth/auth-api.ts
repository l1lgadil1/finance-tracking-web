import { api } from '@/shared/api/api';

// Types
export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
}

export interface UserProfile {
  id: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

// Auth API
export const authApi = {
  /**
   * Register a new user
   * @param credentials User registration credentials
   */
  register: (credentials: RegisterCredentials) => 
    api.post<AuthResponse>('/auth/register', credentials),
  
  /**
   * Login a user
   * @param credentials User login credentials
   */
  login: (credentials: LoginCredentials) => 
    api.post<AuthResponse>('/auth/login', credentials),
  
  /**
   * Get the current user's profile
   */
  getProfile: () => 
    api.get<UserProfile>('/auth/profile'),
    
  /**
   * Store auth token in localStorage
   */
  saveToken: (token: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
    }
  },
  
  /**
   * Get auth token from localStorage
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('auth_token');
    }
    return null;
  },
  
  /**
   * Remove auth token from localStorage
   */
  removeToken: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
    }
  }
}; 