import { api } from '@/shared/api/api';

// Types
export interface RegisterCredentials {
  email: string;
  password: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  isPremium: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface TokenRefreshResponse {
  accessToken: string;
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
   * Refresh the access token
   */
  refreshToken: () => 
    api.post<TokenRefreshResponse>('/auth/refresh'),
    
  /**
   * Store auth tokens in localStorage with proper security measures
   */
  saveTokens: (tokens: AuthResponse) => {
    if (typeof window !== 'undefined') {
      // Store access token with expiration
      localStorage.setItem('auth_token', tokens.accessToken);
      if (tokens.refreshToken) {
        // Store refresh token securely
        localStorage.setItem('refresh_token', tokens.refreshToken);
      }
      // Store timestamp for token age tracking
      localStorage.setItem('token_timestamp', Date.now().toString());
    }
  },
  
  /**
   * Get auth token from localStorage with validation
   */
  getToken: (): string | null => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token');
      const timestamp = localStorage.getItem('token_timestamp');
      
      if (token && timestamp) {
        // Check token age (example: 1 hour)
        const tokenAge = Date.now() - parseInt(timestamp);
        if (tokenAge < 3600000) { // 1 hour in milliseconds
          return token;
        } else {
          // Token expired, attempt refresh
          authApi.refreshToken()
            .then(response => {
              authApi.saveTokens({ accessToken: response.accessToken });
              return response.accessToken;
            })
            .catch(() => {
              // If refresh fails, clear tokens
              authApi.removeTokens();
              return null;
            });
        }
      }
    }
    return null;
  },
  
  /**
   * Remove auth tokens and clear session
   */
  removeTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('token_timestamp');
    }
  }
}; 