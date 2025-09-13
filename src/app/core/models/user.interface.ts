export interface User {
  readonly id: string;
  readonly email: string;
  readonly role: 'admin' | 'operario' | 'repartidor';
  readonly created_at: string;
  readonly updated_at: string;
}

export interface AuthState {
  readonly user: User | null;
  readonly isAuthenticated: boolean;
  readonly loading: boolean;
  readonly error: string | null;
}