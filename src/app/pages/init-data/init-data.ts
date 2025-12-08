import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SeedDataService } from '../../services/seed-data.service';

@Component({
  selector: 'app-init-data',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './init-data.html',
  styleUrls: ['./init-data.css']
})
export class InitDataComponent implements OnInit {
  loading = false;
  completed = false;
  error: string | null = null;

  constructor(private seedDataService: SeedDataService) {}

  ngOnInit(): void {
    // Verificar si ya se inicializó
    const initialized = localStorage.getItem('dbInitialized');
    if (initialized === 'true') {
      this.completed = true;
    }
  }

  initializeDatabase(): void {
    this.loading = true;
    this.error = null;

    this.seedDataService.initializeDatabase().subscribe({
      next: () => {
        this.loading = false;
        this.completed = true;
        localStorage.setItem('dbInitialized', 'true');
        console.log('✅ Base de datos inicializada correctamente');
      },
      error: (err) => {
        this.loading = false;
        this.error = 'Error al inicializar la base de datos: ' + err.message;
        console.error('Error:', err);
      }
    });
  }
}
