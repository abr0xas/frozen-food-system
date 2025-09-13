import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-placeholder',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './placeholder.html',
  styleUrl: './placeholder.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class PlaceholderComponent {
  private route = inject(ActivatedRoute);
  
  readonly title = this.route.snapshot.data['title'] || 'Módulo';
  readonly description = this.route.snapshot.data['description'] || 'Este módulo será implementado próximamente';
}
