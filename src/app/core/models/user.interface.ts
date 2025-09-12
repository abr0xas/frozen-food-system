export interface User {
  id: string;
  email: string;
  role: 'admin' | 'operario' | 'repartidor';
  created_at: string;
  updated_at: string;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
}