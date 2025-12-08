import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { MatriculaService } from '../../services/matricula.service';
import { CursoService } from '../../services/curso.service';
import { AuthService } from '../../services/auth.service';
import { EstudianteService } from '../../services/estudiante.service';
import { Matricula, Curso, Estudiante } from '../../models';
import { EstadoMatriculaPipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EstadoMatriculaPipe],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {
  matriculas: Matricula[] = [];
  cursos: Curso[] = [];
  estudiante: Estudiante | null = null;
  loading = true;
  error: string | null = null;
  buscador = '';

  constructor(
    private matriculaService: MatriculaService,
    private cursoService: CursoService,
    private authService: AuthService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.cargarDatos(user.uid);
    }
  }

  cargarDatos(uid: string): void {
    this.estudianteService.obtenerEstudiantePorUid(uid).subscribe({
      next: (est) => {
        if (est) {
          this.estudiante = est;
          this.cargarMatriculas(est.id);
        } else {
          this.error = 'No se encontraron datos del estudiante';
          this.loading = false;
        }
      },
      error: (err) => {
        this.error = 'Error al cargar los datos del estudiante';
        this.loading = false;
      }
    });
  }

  cargarMatriculas(estudianteId: string): void {
    this.matriculaService.obtenerMatriculasPorEstudiante(estudianteId).subscribe({
      next: (matriculas) => {
        this.matriculas = matriculas;
        this.cargarCursos();
      },
      error: (err) => {
        this.error = 'Error al cargar las matrículas';
        this.loading = false;
      }
    });
  }

  cargarCursos(): void {
    this.cursoService.obtenerCursos().subscribe({
      next: (cursos) => {
        this.cursos = cursos;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los cursos';
        this.loading = false;
      }
    });
  }

  obtenerNombreCurso(cursoId: string): string {
    const curso = this.cursos.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'Curso no encontrado';
  }

  obtenerDocente(cursoId: string): string {
    const curso = this.cursos.find(c => c.id === cursoId);
    return curso ? curso.docente : 'N/A';
  }

  obtenerHorario(cursoId: string): string {
    const curso = this.cursos.find(c => c.id === cursoId);
    return curso ? curso.horario : 'N/A';
  }

  get matriculasFiltradas(): Matricula[] {
    if (!this.buscador.trim()) {
      return this.matriculas;
    }
    return this.matriculas.filter(m =>
      this.obtenerNombreCurso(m.cursoId).toLowerCase().includes(this.buscador.toLowerCase())
    );
  }
}