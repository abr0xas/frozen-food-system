export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  role: 'admin' | 'operario' | 'repartidor';
}

export interface AuthResponse {
  user: any;
  session: any;
  error?: string;
}