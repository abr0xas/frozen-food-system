import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserProfileComponent } from '../auth/components/user-profile/user-profile';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-dashboard',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserProfileComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="dashboard-container">
      <div class="dashboard-header">
        <h1>
          <mat-icon>dashboard</mat-icon>
          Dashboard - Sistema de Comida Congelada
        </h1>
        <p>Bienvenido al sistema de gestión</p>
      </div>

      <div class="dashboard-content">
        <div class="user-section">
          @if (user()) {
            <app-user-profile
              [user]="user()!"
              [loading]="authLoading()"
              (logout)="onLogout()">
            </app-user-profile>
          }
        </div>

        <div class="quick-actions">
          <mat-card>
            <mat-card-header>
              <mat-card-title>Acciones Rápidas</mat-card-title>
            </mat-card-header>
            <mat-card-content>
              <div class="action-buttons">
                <button mat-raised-button color="primary">
                  <mat-icon>inventory</mat-icon>
                  Gestión de Stock
                </button>
                <button mat-raised-button color="accent">
                  <mat-icon>shopping_cart</mat-icon>
                  Gestión de Pedidos
                </button>
                <button mat-raised-button>
                  <mat-icon>local_shipping</mat-icon>
                  Seguimiento
                </button>
              </div>
            </mat-card-content>
          </mat-card>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-container {
      padding: 1rem;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: var(--mat-sys-surface);
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 1.5rem;
      padding-bottom: 1rem;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.25rem;
      color: var(--mat-sys-primary);
      flex-wrap: wrap;
      line-height: 1.3;
    }

    .dashboard-header p {
      margin: 0.5rem 0 0 0;
      font-size: 0.875rem;
      color: var(--mat-sys-on-surface-variant);
    }

    .dashboard-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .user-section {
      width: 100%;
    }

    .quick-actions {
      width: 100%;
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      justify-content: flex-start;
      padding: 1rem;
      min-height: 48px;
      width: 100%;
      text-align: left;
      border-radius: 8px;
    }

    .action-buttons mat-icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    @media (min-width: 768px) {
      .dashboard-container {
        padding: 2rem;
        max-width: 1200px;
        margin: 0 auto;
      }

      .dashboard-header {
        margin-bottom: 2.5rem;
      }

      .dashboard-header h1 {
        font-size: 1.75rem;
        gap: 1rem;
        flex-wrap: nowrap;
      }

      .dashboard-content {
        display: grid;
        grid-template-columns: 1fr 2fr;
        gap: 2rem;
        align-items: start;
      }

      .action-buttons {
        gap: 1rem;
      }

      .action-buttons button {
        padding: 1.25rem;
        border-radius: 12px;
      }
    }

    @media (min-width: 1024px) {
      .dashboard-container {
        padding: 3rem;
      }

      .dashboard-header h1 {
        font-size: 2rem;
      }

      .dashboard-content {
        gap: 3rem;
      }

      .action-buttons {
        gap: 1.25rem;
      }

      .action-buttons button {
        padding: 1.5rem;
        border-radius: 16px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .action-buttons button:hover {
        transform: translateY(-2px);
        box-shadow: var(--mat-sys-elevation-level-4);
      }
    }

    @media (hover: none) and (pointer: coarse) {
      .action-buttons button:hover {
        transform: none;
        box-shadow: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .action-buttons button {
        transition: none;
      }

      .action-buttons button:hover {
        transform: none;
      }
    }
  `]
})
export class DashboardComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly authLoading = this.authService.loading;

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}