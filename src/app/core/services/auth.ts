import { Injectable, inject, signal } from '@angular/core';
import { SupabaseService } from './supabase';
import { User, AuthState } from '../models/user.interface';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private supabase = inject(SupabaseService);

  private authState = signal<AuthState>({
    user: null,
    isAuthenticated: false,
    loading: true
  });

  readonly user = this.authState.asReadonly();

  constructor() {
    this.initAuthListener();
  }

  private initAuthListener() {
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        this.authState.update(state => ({
          ...state,
          user: session.user as User,
          isAuthenticated: true,
          loading: false
        }));
      } else {
        this.authState.update(state => ({
          ...state,
          user: null,
          isAuthenticated: false,
          loading: false
        }));
      }
    });
  }

  async signIn(email: string, password: string) {
    this.authState.update(state => ({ ...state, loading: true }));
    
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      this.authState.update(state => ({ ...state, loading: false }));
      throw error;
    }

    return data;
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut();
    if (error) throw error;
  }

  getCurrentUser() {
    return this.supabase.auth.getUser();
  }
}
