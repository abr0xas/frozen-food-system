import { ChangeDetectionStrategy, Component, OnInit, signal, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SupabaseService } from './core/services/supabase';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class App implements OnInit {
  protected readonly title = signal('frozen-food-system');
  protected readonly connectionStatus = signal<string>('Probando conexión...');

  private readonly supabase = inject(SupabaseService);

  async ngOnInit() {
    const result = await this.supabase.testConnection();
    this.connectionStatus.set(
      result.success ? '✅ ' + result.message : '❌ ' + result.message
    );
  }
}
