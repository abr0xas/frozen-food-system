import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../../../environments/environment';
import { Database } from '../../shared/models/database.interface';

@Injectable({
  providedIn: 'root'
})
export class SupabaseService {
  private supabase: SupabaseClient<Database>;

  constructor() {
    this.supabase = createClient<Database>(
      environment.supabase.url,
      environment.supabase.anonKey
    );
  }

  get client(): SupabaseClient<Database> {
    return this.supabase;
  }

  get auth() {
    return this.supabase.auth;
  }

  get from() {
    return this.supabase.from.bind(this.supabase);
  }

  get rpc() {
    return this.supabase.rpc.bind(this.supabase);
  }

  async testConnection(): Promise<{ success: boolean; message: string }> {
    try {
      // Test with a simple query to profiles table
      const { error } = await this.supabase
        .from('profiles')
        .select('count')
        .limit(1);
      
      if (error && error.code === 'PGRST116') {
        // Table doesn't exist, likely need to run migrations
        return { 
          success: false, 
          message: 'Schema no encontrado. Ejecutar migraciones primero.' 
        };
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

  async testDatabaseSchema(): Promise<{ success: boolean; message: string; tables?: string[] }> {
    try {
      // Test all main tables exist
      const tablesToTest = [
        'profiles', 'customers', 'ingredients', 'products', 'recipes',
        'orders', 'order_items', 'deliveries', 'financial_transactions'
      ];
      
      const existingTables: string[] = [];
      const missingTables: string[] = [];
      
      for (const table of tablesToTest) {
        try {
          const { error } = await this.supabase
            .from(table as keyof Database['public']['Tables'])
            .select('count')
            .limit(1);
            
          if (error && error.code === 'PGRST116') {
            missingTables.push(table);
          } else if (!error) {
            existingTables.push(table);
          }
        } catch {
          missingTables.push(table);
        }
      }
      
      if (missingTables.length === 0) {
        return { 
          success: true, 
          message: `Schema completo. ${existingTables.length} tablas verificadas.`,
          tables: existingTables 
        };
      } else {
        return { 
          success: false, 
          message: `Faltan ${missingTables.length} tablas: ${missingTables.join(', ')}`,
          tables: existingTables 
        };
      }
    } catch (error) {
      return { 
        success: false, 
        message: `Error verificando schema: ${error instanceof Error ? error.message : 'Desconocido'}` 
      };
    }
  }
}
