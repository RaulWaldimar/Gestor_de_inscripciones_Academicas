import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EstudianteService } from '../../services/estudiante.service';
import { CursoService } from '../../services/curso.service';
import { DocenteService } from '../../services/docente.service';
import { MatriculaService } from '../../services/matricula.service';
import { AuthService } from '../../services/auth.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.css']
})
export class AdminDashboardComponent implements OnInit {
  totalEstudiantes = 0;
  totalDocentes = 0;
  totalCursos = 0;
  totalMatriculas = 0;
  matriculasActivas = 0;
  loading = true;
  error: string | null = null;
  usuario: any = null;

  constructor(
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private docenteService: DocenteService,
    private matriculaService: MatriculaService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.usuario = user;
    });
    this.cargarEstadisticas();
  }

  cargarEstadisticas(): void {
    this.loading = true;
    this.error = null;

    // Cargar estudiantes
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (estudiantes) => {
        this.totalEstudiantes = estudiantes.length;
        this.cargarDocentes();
      },
      error: (err) => {
        this.error = 'Error al cargar estudiantes';
        this.loading = false;
      }
    });
  }

  private cargarDocentes(): void {
    this.docenteService.obtenerDocentes().subscribe({
      next: (docentes) => {
        this.totalDocentes = docentes.length;
        this.cargarCursos();
      },
      error: (err) => {
        this.error = 'Error al cargar docentes';
        this.loading = false;
      }
    });
  }

  private cargarCursos(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (cursos) => {
        this.totalCursos = cursos.length;
        this.cargarMatriculas();
      },
      error: (err) => {
        this.error = 'Error al cargar cursos';
        this.loading = false;
      }
    });
  }

  private cargarMatriculas(): void {
    this.matriculaService.obtenerMatriculas().subscribe({
      next: (matriculas) => {
        this.totalMatriculas = matriculas.length;
        this.matriculasActivas = matriculas.filter(m => m.estado === 'activa').length;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar matrículas';
        this.loading = false;
      }
    });
  }
}
