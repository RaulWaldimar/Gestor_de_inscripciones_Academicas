import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InitService } from '../../services/init.service';
import { CleanupService } from '../../services/cleanup.service';

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
  cleaning = false;
  cleaningResults: { eliminados: number; errores: number } | null = null;

  constructor(
    private initService: InitService,
    private cleanupService: CleanupService
  ) {}

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

    this.initService.inicializarDatos().subscribe({
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

  limpiarDuplicados(): void {
    if (!confirm('⚠️ Esto eliminará todos los duplicados (cuentas con tildes y cursos duplicados). ¿Estás seguro?')) {
      return;
    }

    this.cleaning = true;
    this.error = null;
    this.cleaningResults = null;

    this.cleanupService.limpiarDuplicados().subscribe({
      next: (results) => {
        this.cleaning = false;
        this.cleaningResults = results;
        console.log(`✅ Limpieza completada: ${results.eliminados} eliminados, ${results.errores} errores`);
      },
      error: (err) => {
        this.cleaning = false;
        this.error = 'Error durante la limpieza: ' + err.message;
        console.error('Error:', err);
      }
    });
  }
}
