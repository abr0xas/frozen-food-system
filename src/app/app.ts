import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppShell } from './layouts/app-shell/app-shell';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppShell],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true
})
export class App {
  private authService = inject(AuthService);
  
  // Signal para verificar si el usuario está autenticado
  isAuthenticated = this.authService.isAuthenticated;
}
