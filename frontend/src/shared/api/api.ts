const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api/v1';

interface RequestOptions {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: unknown;
  headers?: Record<string, string>;
  credentials?: RequestCredentials;
}

export interface ApiError {
  message: string;
  statusCode: number;
}

interface ApiErrorResponse {
  message: string;
  statusCode: number;
  [key: string]: unknown;
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
    credentials: 'include', // Include cookies in cross-origin requests
  };

  // Only add body for non-GET requests
  if (options.method !== 'GET' && options.body) {
    config.body = JSON.stringify(options.body);
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);
    
    if (!response.ok) {
      let errorData: ApiErrorResponse = { message: 'Something went wrong', statusCode: response.status };
      
      try {
        errorData = await response.json();
      } catch (e) {
        // If response cannot be parsed as JSON, use default error
        console.error('Error parsing error response:', e);
      }
      
      throw {
        message: errorData.message || 'Something went wrong',
        statusCode: response.status
      } as ApiError;
    }
    
    // Handle empty responses (like for 204 No Content)
    if (response.status === 204) {
      return {} as T;
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
    
  post: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'POST', body }),
    
  put: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PUT', body }),
    
  patch: <T>(endpoint: string, body?: unknown, options?: Omit<RequestOptions, 'method' | 'body'>) => 
    request<T>(endpoint, { ...options, method: 'PATCH', body }),
    
  delete: <T>(endpoint: string, options?: Omit<RequestOptions, 'method'>) => 
    request<T>(endpoint, { ...options, method: 'DELETE' }),

  /**
   * Helper function that handles API calls with fallback data for missing endpoints
   * @param apiCall Function to call the API
   * @param fallbackData Data to return if the API call fails
   * @param logWarning Optional warning message to log if the API call fails
   */
  withFallback: async <T>(
    apiCall: () => Promise<T>,
    fallbackData: T,
    logWarning: string = 'API endpoint not available, using fallback data'
  ): Promise<T> => {
    try {
      return await apiCall();
    } catch (error) {
      console.warn(logWarning, error);
      return fallbackData;
    }
  }
}; 