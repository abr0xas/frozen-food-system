import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../../core/services/auth';
import { LoginFormComponent } from '../../components/login-form/login-form';
import { LoginFormData } from '../../models/auth.interface';

@Component({
  selector: 'app-login-container',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [LoginFormComponent],
  templateUrl: './login-container.html',
  styleUrl: './login-container.scss'
})
export class LoginContainerComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  readonly loading = this.authService.loading;
  readonly error = this.authService.error;
  readonly isAuthenticated = this.authService.isAuthenticated;

  constructor() {
    // Redirect if already authenticated
    if (this.isAuthenticated()) {
      this.redirectAfterLogin();
    }
  }

  async onLogin(formData: LoginFormData): Promise<void> {
    try {
      await this.authService.signIn({
        email: formData.email,
        password: formData.password
      });
      
      // Redirect after successful login
      this.redirectAfterLogin();
    } catch (error) {
      // Error is handled by the AuthService
      console.error('Login failed:', error);
    }
  }

  onClearError(): void {
    this.authService.clearError();
  }

  private redirectAfterLogin(): void {
    const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
    this.router.navigate([returnUrl]);
  }
}
