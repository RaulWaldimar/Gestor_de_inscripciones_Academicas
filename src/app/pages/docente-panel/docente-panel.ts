import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { DocenteService } from '../../services/docente.service';
import { CursoService } from '../../services/curso.service';
import { MatriculaService } from '../../services/matricula.service';
import { EstudianteService } from '../../services/estudiante.service';
import { Curso, Matricula, Usuario, Docente, Estudiante } from '../../models';
import { EstadoMatriculaPipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-docente-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, EstadoMatriculaPipe],
  templateUrl: './docente-panel.html',
  styleUrls: ['./docente-panel.css']
})
export class DocentePanelComponent implements OnInit {
  usuario: Usuario | null = null;
  docente: Docente | null = null;
  cursos: Curso[] = [];
  matriculas: Matricula[] = [];
  estudiantes: Map<string, Estudiante> = new Map();
  loading = true;
  error: string | null = null;
  selectedCursoId: string | null = null;
  buscador = '';

  constructor(
    private authService: AuthService,
    private docenteService: DocenteService,
    private cursoService: CursoService,
    private matriculaService: MatriculaService,
    private estudianteService: EstudianteService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.usuario = user;
        this.cargarDatos();
      }
    });
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = null;

    // Cargar información del docente
    if (this.usuario?.uid) {
      this.docenteService.obtenerDocentePorUid(this.usuario.uid).subscribe({
        next: (docente) => {
          this.docente = docente;
          // Cargar todos los cursos
          this.cursoService.obtenerCursos().subscribe({
            next: (cursos) => {
              // Filtrar solo los cursos del docente actual
              this.cursos = cursos.filter(c => c.docenteId === this.usuario?.uid);

              if (this.cursos.length > 0) {
                this.selectedCursoId = this.cursos[0].id || null;
                this.cargarMatriculas();
              } else {
                this.loading = false;
              }
            },
            error: (err) => {
              this.error = 'Error al cargar los cursos';
              this.loading = false;
            }
          });
        },
        error: (err) => {
          this.error = 'Error al cargar información del docente';
          this.loading = false;
        }
      });
    }
  }

  cargarMatriculas(): void {
    if (!this.selectedCursoId) return;

    this.matriculaService.obtenerMatriculasPorCurso(this.selectedCursoId).subscribe({
      next: (matriculas) => {
        this.matriculas = matriculas;
        // Cargar información de los estudiantes
        this.cargarEstudiantes();
      },
      error: (err) => {
        this.error = 'Error al cargar las matrículas';
        this.loading = false;
      }
    });
  }

  cargarEstudiantes(): void {
    this.estudiantes.clear();
    const uids = this.matriculas.map(m => m.estudianteId);

    if (uids.length === 0) {
      this.loading = false;
      return;
    }

    // Cargar todos los estudiantes
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (estudiantes) => {
        estudiantes.forEach(est => {
          if (est.uid && uids.includes(est.uid)) {
            this.estudiantes.set(est.uid, est);
          }
        });
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar datos de estudiantes';
        this.loading = false;
      }
    });
  }

  onCursoChange(): void {
    this.cargarMatriculas();
  }

  get matriculasFiltradas(): Matricula[] {
    return this.matriculas.filter(m => {
      const estudiante = this.estudiantes.get(m.estudianteId);
      if (!estudiante) return true;
      return (
        estudiante.nombres.toLowerCase().includes(this.buscador.toLowerCase()) ||
        estudiante.apellidos.toLowerCase().includes(this.buscador.toLowerCase())
      );
    });
  }

  get cursoSeleccionado(): Curso | undefined {
    return this.cursos.find(c => c.id === this.selectedCursoId);
  }

  obtenerNombreEstudiante(uid: string): string {
    const estudiante = this.estudiantes.get(uid);
    return estudiante ? `${estudiante.nombres} ${estudiante.apellidos}` : 'Desconocido';
  }
}
