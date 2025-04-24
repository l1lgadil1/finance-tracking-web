const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Base API request function
 */
export async function request<T>(
  endpoint: string, 
  options: RequestOptions = { method: 'GET' }
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('auth_token') : null;
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config: RequestInit = {
    method: options.method,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      const errorData = await response.json();
      throw {
        message: errorData.message || 'Something went wrong',
        statusCode: response.status
      } as ApiError;
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    throw error;
  }
}

/**
 * API service with convenience methods for CRUD operations
 */
export const api = {
  get: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'GET' }),
    
  post: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
}; 