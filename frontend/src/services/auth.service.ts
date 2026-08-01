import { post } from './api';
import { AuthResponse, LoginCredentials } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Assuming backend returns { token, user: { ... } }
    return await post<AuthResponse>('/auth/login', credentials);
  },
};
