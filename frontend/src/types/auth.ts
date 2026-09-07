export interface User {
  id: string;
  email: string;
  name: string;
  role: 'STUDENT' | 'TEACHER'
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
