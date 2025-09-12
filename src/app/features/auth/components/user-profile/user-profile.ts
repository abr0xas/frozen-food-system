import { Component, ChangeDetectionStrategy, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { User } from '../../../../core/models/user.interface';

@Component({
  selector: 'app-user-profile',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    DatePipe,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule
  ],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.scss'
})
export class UserProfileComponent {
  user = input.required<User>();
  loading = input<boolean>(false);
  
  onLogout = output<void>();

  getRoleDisplayName(role: string): string {
    const roleMap = {
      admin: 'Administrador',
      operario: 'Operario',
      repartidor: 'Repartidor'
    };
    
    return roleMap[role as keyof typeof roleMap] || role;
  }

  getRoleColor(role: string): 'primary' | 'accent' | 'warn' {
    const colorMap = {
      admin: 'warn' as const,
      operario: 'primary' as const,
      repartidor: 'accent' as const
    };
    
    return colorMap[role as keyof typeof colorMap] || 'primary';
  }

  logout(): void {
    this.onLogout.emit();
  }
}
