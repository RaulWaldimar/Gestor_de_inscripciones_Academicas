import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstadisticasService } from '../../services/estadisticas.service';
import { EstadisticasAdmin } from '../../models';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './estadisticas.html',
  styleUrls: ['./estadisticas.css']
})
export class EstadisticasComponent implements OnInit {
  estadisticas: EstadisticasAdmin | null = null;
  matriculasPorCurso: { [key: string]: number } = {};
  loading = true;
  error: string | null = null;
  Object = Object; // Exponemos Object para usarlo en el template

  constructor(private estadisticasService: EstadisticasService) {}

  ngOnInit(): void {
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = null;

    this.estadisticasService.obtenerEstadisticas().subscribe({
      next: (stats) => {
        this.estadisticas = stats;
        this.cargarMatriculasPorCurso();
      },
      error: (err) => {
        this.error = 'Error al cargar las estadísticas';
        this.loading = false;
      }
    });
  }

  cargarMatriculasPorCurso(): void {
    this.estadisticasService.obtenerMatriculasPorCurso().subscribe({
      next: (matriculas) => {
        this.matriculasPorCurso = matriculas;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar las matrículas por curso';
        this.loading = false;
      }
    });
  }
}
