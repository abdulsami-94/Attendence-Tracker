/**
 * API Service Layer
 * 
 * Purpose:
 * This file serves as the centralized HTTP client for the application, powered by Axios.
 * It provides pre-configured requests, timeout handling, error logging, and hooks for request/response interception.
 * 
 * How to change the Base URL:
 * Update the `baseURL` property in the `axios.create()` configuration below.
 * In a production setup, this should read from environment variables (e.g., process.env.EXPO_PUBLIC_API_URL).
 * 
 * Where authentication will be integrated:
 * Look at the request interceptor block (`apiClient.interceptors.request.use`).
 * Inside that block, fetch the token (e.g., from AsyncStorage or secure storage) and assign it to `config.headers.Authorization`.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create a single Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: 'baseURL: process.env.EXPO_PUBLIC_API_URL,',
  timeout: 10000, // 10000ms request timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // AUTHENTICATION INTEGRATION PLACEHOLDER:
    // 1. Retrieve the JWT or session token (e.g., await AsyncStorage.getItem('token')).
    // 2. If the token exists, attach it to the request headers:
    //    if (token && config.headers) {
    //      config.headers.Authorization = `Bearer ${token}`;
    //    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    // Return successful responses normally
    return response;
  },
  (error) => {
    // Log API errors (ensuring we log only non-sensitive error descriptors in production)
    const status = error.response?.status;
    const message = error.response?.data?.message || error.message;
    console.error(`[API Error] Status: ${status || 'Network Error'} | Message: ${message}`);
    
    // Reject the error to propagate it to the calling service
    return Promise.reject(error);
  }
);

/**
 * Reusable generic helper methods
 */

export const get = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.get<T>(url, config);
  return response.data;
};

export const post = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.post<T>(url, data, config);
  return response.data;
};

export const put = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.put<T>(url, data, config);
  return response.data;
};

export const patch = async <T, D = any>(url: string, data?: D, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.patch<T>(url, data, config);
  return response.data;
};

export const deleteRequest = async <T>(url: string, config?: AxiosRequestConfig): Promise<T> => {
  const response = await apiClient.delete<T>(url, config);
  return response.data;
};

export default apiClient;
export { apiClient };