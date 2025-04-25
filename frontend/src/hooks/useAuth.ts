'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  authApi, 
  LoginCredentials, 
  RegisterCredentials, 
  UserProfile 
} from '@/features/auth/auth-api';

// API error interface
interface ApiError {
  statusCode: number;
  message: string;
}

interface UseAuthReturn {
  user: UserProfile | null;
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  fetchUser: () => Promise<void>;
}

export const useAuth = (locale: string = 'en'): UseAuthReturn => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const fetchUser = useCallback(async () => {
    const token = authApi.getToken();
    
    if (!token) {
      setUser(null);
      return;
    }

    setIsLoading(true);
    
    try {
      const userData = await authApi.getProfile();
      setUser(userData);
    } catch {
      // Token is invalid, remove it
      authApi.removeToken();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize by checking if the user is logged in
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.login(credentials);
      authApi.saveToken(response.accessToken);
      await fetchUser(); // Fetch user profile after successful login
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Login failed');
      } else {
        setError('Login failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await authApi.register(credentials);
      authApi.saveToken(response.accessToken);
      await fetchUser(); // Fetch user profile after successful registration
      router.push(`/${locale}/dashboard`);
    } catch (err: unknown) {
      if (err && typeof err === 'object' && 'message' in err) {
        const apiError = err as ApiError;
        setError(apiError.message || 'Registration failed');
      } else {
        setError('Registration failed');
      }
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    authApi.removeToken();
    setUser(null);
    router.push(`/${locale}/auth/login`);
  };
  
  return {
    user,
    isLoading,
    error,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    fetchUser,
  };
}; 