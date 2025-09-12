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
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }

    .dashboard-header {
      text-align: center;
      margin-bottom: 3rem;
    }

    .dashboard-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 1rem;
      margin: 0;
      color: #1976d2;
    }

    .dashboard-content {
      display: grid;
      grid-template-columns: 1fr 2fr;
      gap: 2rem;
      align-items: start;
    }

    @media (max-width: 768px) {
      .dashboard-content {
        grid-template-columns: 1fr;
      }
    }

    .action-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }

    .action-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-start;
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