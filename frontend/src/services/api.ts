/**
 * API Service Layer
 * 
 * Purpose:
 * This file serves as the centralized HTTP client for the application, powered by Axios.
 * It provides pre-configured requests, timeout handling, error logging, and hooks for request/response interception.
 * 
 * Why Expo uses the `EXPO_PUBLIC_` prefix:
 * Expo React Native environment variables MUST be prefixed with `EXPO_PUBLIC_` for the bundler (Metro) to
 * expose them to the client-side JavaScript code. Any variable without this prefix is omitted from the frontend
 * bundle for security, preventing secret exposure.
 * 
 * How to change the API URL:
 * 1. Android Emulator: Use http://10.0.2.2:8080/api (10.0.2.2 is a special alias mapping to the host machine's localhost).
 * 2. iOS Simulator: Use http://localhost:8080/api (shares the host network interface).
 * 3. Physical Device: Use http://<your-computer-local-ip>:8080/api (e.g. http://192.168.1.5:8080/api), ensuring both
 *    your computer and physical device are on the exact same Wi-Fi network.
 * 4. Production Server: Use the actual hosted server URL (e.g., https://api.yourdomain.com/api).
 * 
 * Where authentication will be integrated:
 * Look at the request interceptor block (`apiClient.interceptors.request.use`).
 * Inside that block, fetch the token (e.g., from AsyncStorage or secure storage) and assign it to `config.headers.Authorization`.
 */

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Load baseURL from environment variable, with a safe fallback to Android emulator interface if not set
const apiBaseURL = process.env.EXPO_PUBLIC_API_URL;

if (!apiBaseURL) {
  console.warn(
    '[API Warning]: EXPO_PUBLIC_API_URL environment variable is not defined. ' +
    'Falling back to default Android Emulator API URL (http://10.0.2.2:8080/api).'
  );
}

// Create a single Axios instance with default settings
const apiClient: AxiosInstance = axios.create({
  baseURL: apiBaseURL || 'http://10.0.2.2:8080/api',
  timeout: 10000, // 10000ms request timeout
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request Interceptor
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Error fetching token for API request:', error);
    }
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