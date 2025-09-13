import { Injectable, inject, signal, computed } from '@angular/core';
import { SupabaseService } from './supabase';
import { User, AuthState } from '../models/user.interface';
import { LoginCredentials } from '../../features/auth/models/auth.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly supabase = inject(SupabaseService);

  private readonly authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true,
    error: null
  });

  readonly user = computed(() => this.authState().user);
  readonly isAuthenticated = computed(() => this.authState().isAuthenticated);
  readonly loading = computed(() => this.authState().loading);
  readonly error = computed(() => this.authState().error);
  readonly state = this.authState.asReadonly();

  constructor() {
    this.initAuthListener();
    this.checkInitialAuth();
  }

  private initAuthListener(): void {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.authState.update(state => ({
          ...state,
          user: session.user as User,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      } else {
        this.authState.update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        }));
      }
    });
  }

  private async checkInitialAuth(): Promise<void> {
    try {
      const { data: { user } } = await this.supabase.auth.getUser();
      
      if (user) {
        this.authState.update(state => ({
          ...state,
          user: user as User,
          isAuthenticated: true,
          loading: false,
          error: null
        }));
      } else {
        this.authState.update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false,
          error: null
        }));
      }
    } catch (error) {
      this.authState.update(state => ({
        ...state,
        user: null,
        isAuthenticated: false,
        loading: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }));
    }
  }

  async signIn(credentials: LoginCredentials): Promise<void> {
    this.authState.update(state => ({ 
      ...state, 
      loading: true, 
      error: null 
    }));
    
    try {
      const { error } = await this.supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        this.authState.update(state => ({ 
          ...state, 
          loading: false,
          error: error.message 
        }));
        throw error;
      }

      // State will be updated by the auth listener
    } catch (error) {
      this.authState.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }));
      throw error;
    }
  }

  async signOut(): Promise<void> {
    this.authState.update(state => ({ ...state, loading: true }));
    
    try {
      const { error } = await this.supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      this.authState.update(state => ({
        ...state,
        loading: false,
        error: error instanceof Error ? error.message : 'Logout failed'
      }));
      throw error;
    }
  }

  clearError(): void {
    this.authState.update(state => ({ ...state, error: null }));
  }
}
