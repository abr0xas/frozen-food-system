import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient;

  constructor() {
    this.supabase = createClient(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client(): SupabaseClient {
    return this.supabase;
  }

  get auth() {
    return this.supabase.auth;
  }

  get from() {
    return this.supabase.from.bind(this.supabase);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      const { error } = await this.supabase
        .from('_supabase_migrations')
        .select('*')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, but connection works
        return { success: true, message: 'Conexión exitosa con Supabase' };
      }
      
      if (error) {
        return { success: false, message: `Error: ${error.message}` };
      }
      
      return { success: true, message: 'Conexión exitosa con Supabase' };
    } catch (error) {
      return { 
        success: false, 
        message: `Error de conexión: ${error instanceof Error ? error.message : 'Desconocido'}` 
      };
    }
  }
}
