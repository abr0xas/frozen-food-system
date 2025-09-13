import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatBadgeModule } from '@angular/material/badge';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationItem } from '../../models/layout.interface';

@Component({
  selector: 'app-navigation',
  imports: [
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    RouterModule,
    CommonModule
  ],
  templateUrl: './navigation.html',
  styleUrl: './navigation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NavigationComponent {
  // Inputs - Solo datos que vienen del container
  navigationItems = input<NavigationItem[]>([]);

  // Outputs - Eventos que emite al container
  navigate = output<void>();

  // Métodos solo para UI - delegan al container
  handleNavigate(): void {
    this.navigate.emit();
  }
}
