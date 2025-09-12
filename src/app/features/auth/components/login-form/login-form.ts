import { Component, ChangeDetectionStrategy, input, output, signal } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { LoginFormData } from '../../models/auth.interface';

@Component({
  selector: 'app-login-form',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './login-form.html',
  styleUrl: './login-form.scss'
})
export class LoginFormComponent {
  loading = input<boolean>(false);
  error = input<string | null>(null);
  
  submitForm = output<LoginFormData>();
  clearError = output<void>();

  private readonly fb = new FormBuilder();
  private readonly hidePassword = signal<boolean>(true);

  readonly loginForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    rememberMe: [false]
  });

  get hidePasswordValue(): boolean {
    return this.hidePassword();
  }

  togglePasswordVisibility(): void {
    this.hidePassword.update(current => !current);
  }

  onFormSubmit(): void {
    if (this.loginForm.valid) {
      const formValue = this.loginForm.value;
      this.submitForm.emit({
        email: formValue.email || '',
        password: formValue.password || '',
        rememberMe: formValue.rememberMe || false
      });
    } else {
      this.loginForm.markAllAsTouched();
    }
  }

  onClearError(): void {
    this.clearError.emit();
  }

  getEmailErrorMessage(): string {
    const emailControl = this.loginForm.get('email');
    
    if (emailControl?.hasError('required')) {
      return 'El email es requerido';
    }
    
    if (emailControl?.hasError('email')) {
      return 'Ingresa un email válido';
    }
    
    return '';
  }

  getPasswordErrorMessage(): string {
    const passwordControl = this.loginForm.get('password');
    
    if (passwordControl?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    
    if (passwordControl?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    
    return '';
  }
}
