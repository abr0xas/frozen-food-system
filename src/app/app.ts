import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LayoutContainer } from './layouts/containers/layout-container/layout-container';
import { AuthService } from './core/services/auth';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LayoutContainer],
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
