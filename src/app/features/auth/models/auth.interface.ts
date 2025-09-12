export interface LoginCredentials {
  readonly email: string;
  readonly password: string;
}

export interface RegisterCredentials extends LoginCredentials {
  readonly role: 'admin' | 'operario' | 'repartidor';
}

export interface AuthResponse {
  readonly user: unknown;
  readonly session: unknown;
  readonly error?: string;
}

export interface LoginFormData {
  readonly email: string;
  readonly password: string;
  readonly rememberMe: boolean;
}