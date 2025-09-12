import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../core/services/auth';
import { UserProfileComponent } from '../auth/components/user-profile/user-profile';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    UserProfileComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="profile-container">
      <div class="profile-header">
        <h1>
          <mat-icon>person</mat-icon>
          Mi Perfil
        </h1>
        <button mat-button (click)="goBack()">
          <mat-icon>arrow_back</mat-icon>
          Volver al Dashboard
        </button>
      </div>

      <div class="profile-content">
        @if (user()) {
          <app-user-profile
            [user]="user()!"
            [loading]="authLoading()"
            (logout)="onLogout()">
          </app-user-profile>
        }

        <mat-card>
          <mat-card-header>
            <mat-card-title>Configuración</mat-card-title>
          </mat-card-header>
          <mat-card-content>
            <p>Aquí podrás configurar tus preferencias y ajustes del sistema.</p>
            <div class="config-buttons">
              <button mat-stroked-button>
                <mat-icon>settings</mat-icon>
                Configuración General
              </button>
              <button mat-stroked-button>
                <mat-icon>notifications</mat-icon>
                Notificaciones
              </button>
              <button mat-stroked-button>
                <mat-icon>security</mat-icon>
                Seguridad
              </button>
            </div>
          </mat-card-content>
        </mat-card>
      </div>
    </div>
  `,
  styles: [`
    .profile-container {
      padding: 2rem;
      max-width: 800px;
      margin: 0 auto;
    }

    .profile-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .profile-header h1 {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin: 0;
      color: #1976d2;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 2rem;
    }

    .config-buttons {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      margin-top: 1rem;
    }

    .config-buttons button {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      justify-content: flex-start;
    }

    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }
    }
  `]
})
export class ProfileComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  readonly user = this.authService.user;
  readonly authLoading = this.authService.loading;

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }

  async onLogout(): Promise<void> {
    try {
      await this.authService.signOut();
      this.router.navigate(['/auth/login']);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }
}