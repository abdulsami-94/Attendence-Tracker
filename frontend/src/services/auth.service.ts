import { post, get } from './api';
import { AuthResponse, LoginCredentials, User } from '../types/auth';

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    // Assuming backend returns { token, user: { ... } }
    return await post<AuthResponse>('/auth/login', credentials);
  },
  me: async (): Promise<User> => {
    return await get<User>('/auth/me');
  },
};
