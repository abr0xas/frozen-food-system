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
      padding: 1rem;
      width: 100%;
      min-height: 100vh;
      min-height: 100dvh;
      background-color: var(--mat-sys-surface);
    }

    .profile-header {
      display: flex;
      flex-direction: column;
      gap: 1rem;
      text-align: center;
      margin-bottom: 1.5rem;
    }

    .profile-header h1 {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
      margin: 0;
      font-size: 1.25rem;
      color: var(--mat-sys-primary);
      flex-wrap: wrap;
    }

    .profile-header button {
      align-self: center;
      min-height: 40px;
    }

    .profile-content {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .config-buttons {
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
      margin-top: 1rem;
    }

    .config-buttons button {
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

    .config-buttons mat-icon {
      flex-shrink: 0;
      font-size: 1.25rem;
      width: 1.25rem;
      height: 1.25rem;
    }

    @media (min-width: 768px) {
      .profile-container {
        padding: 2rem;
        max-width: 800px;
        margin: 0 auto;
      }

      .profile-header {
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        text-align: left;
        margin-bottom: 2rem;
      }

      .profile-header h1 {
        font-size: 1.75rem;
        gap: 1rem;
        justify-content: flex-start;
        flex-wrap: nowrap;
      }

      .profile-header button {
        align-self: auto;
      }

      .profile-content {
        gap: 2rem;
      }

      .config-buttons {
        gap: 1rem;
      }

      .config-buttons button {
        padding: 1.25rem;
        border-radius: 12px;
      }
    }

    @media (min-width: 1024px) {
      .profile-container {
        padding: 3rem;
      }

      .profile-header h1 {
        font-size: 2rem;
      }

      .config-buttons {
        gap: 1.25rem;
      }

      .config-buttons button {
        padding: 1.5rem;
        border-radius: 16px;
        transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
      }

      .config-buttons button:hover {
        transform: translateY(-2px);
        box-shadow: var(--mat-sys-elevation-level-4);
      }
    }

    @media (hover: none) and (pointer: coarse) {
      .config-buttons button:hover {
        transform: none;
        box-shadow: none;
      }
    }

    @media (prefers-reduced-motion: reduce) {
      .config-buttons button {
        transition: none;
      }

      .config-buttons button:hover {
        transform: none;
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