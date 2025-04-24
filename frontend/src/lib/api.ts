const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  body?: any;
  headers?: Record<string, string>;
}

interface ApiError {
  message: string;
  statusCode: number;
}

/**
 * Base API request function
 */
async function request<T>(
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
    
  post: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body: any, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),
    
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/login', { email, password }),
      
    register: (email: string, password: string) => 
      api.post('/auth/register', { email, password }),
    
    getProfile: () => api.get('/profile'),
  },
  
  // Add other API endpoints as needed
  transactions: {
    getAll: (filters?: any) => api.get('/transactions', { body: filters }),
    getById: (id: string) => api.get(`/transactions/${id}`),
    create: (data: any) => api.post('/transactions', data),
    update: (id: string, data: any) => api.put(`/transactions/${id}`, data),
    delete: (id: string) => api.delete(`/transactions/${id}`),
  },
  
  accounts: {
    getAll: () => api.get('/accounts'),
    getById: (id: string) => api.get(`/accounts/${id}`),
    create: (data: any) => api.post('/accounts', data),
    update: (id: string, data: any) => api.put(`/accounts/${id}`, data),
    delete: (id: string) => api.delete(`/accounts/${id}`),
  },
}; 