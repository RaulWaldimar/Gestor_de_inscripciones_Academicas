import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatriculaService } from '../../services/matricula.service';
import { EstudianteService } from '../../services/estudiante.service';
import { CursoService } from '../../services/curso.service';
import { Matricula, Estudiante, Curso } from '../../models';
import { EstadoMatriculaPipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EstadoMatriculaPipe],
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.css']
})
export class MatriculasComponent implements OnInit {
  matriculas: Matricula[] = [];
  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  buscador = '';
  filtroEstado = '';

  matriculaForm!: FormGroup;

  constructor(
    private matriculaService: MatriculaService,
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDatos();
  }

  initForm(): void {
    this.matriculaForm = this.fb.group({
      estudianteId: ['', Validators.required],
      cursoId: ['', Validators.required],
      estado: ['activa', Validators.required]
    });
  }

  cargarDatos(): void {
    this.loading = true;
    this.error = null;

    Promise.all([
      this.matriculaService.obtenerMatriculas().toPromise(),
      this.estudianteService.obtenerEstudiantes().toPromise(),
      this.cursoService.obtenerCursos().toPromise()
    ]).then(([matriculas, estudiantes, cursos]) => {
      this.matriculas = matriculas || [];
      this.estudiantes = estudiantes || [];
      this.cursos = cursos || [];
      this.loading = false;
    }).catch((err) => {
      this.error = 'Error al cargar los datos';
      this.loading = false;
    });
  }

  guardarMatricula(): void {
    if (this.matriculaForm.invalid) return;

    this.loading = true;
    const dataMatricula = this.matriculaForm.value;
    dataMatricula.fechaInscripcion = new Date();
    dataMatricula.calificacion = 0;

    // Validar duplicación
    this.matriculaService.validarDuplicacion(dataMatricula.estudianteId, dataMatricula.cursoId).subscribe({
      next: (noDuplicado) => {
        if (!noDuplicado) {
          this.error = 'Este estudiante ya está matriculado en este curso';
          this.loading = false;
          return;
        }

        this.matriculaService.crearMatricula(dataMatricula).subscribe({
          next: () => {
            this.cargarDatos();
            this.resetForm();
          },
          error: (err) => {
            this.error = 'Error al crear la matrícula';
            this.loading = false;
          }
        });
      }
    });
  }

  cancelarMatricula(id: string): void {
    if (confirm('¿Estás seguro de que deseas cancelar esta matrícula?')) {
      this.matriculaService.actualizarMatricula(id, { estado: 'cancelada' }).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => {
          this.error = 'Error al cancelar la matrícula';
        }
      });
    }
  }

  resetForm(): void {
    this.matriculaForm.reset({ estado: 'activa' });
    this.showForm = false;
  }

  obtenerNombreEstudiante(estudianteId: string): string {
    const est = this.estudiantes.find(e => e.id === estudianteId);
    return est ? `${est.nombre} ${est.apellido}` : 'Estudiante no encontrado';
  }

  obtenerNombreCurso(cursoId: string): string {
    const curso = this.cursos.find(c => c.id === cursoId);
    return curso ? curso.nombre : 'Curso no encontrado';
  }

  get matriculasFiltradas(): Matricula[] {
    return this.matriculas.filter(m => {
      const coincideEstado = this.filtroEstado === '' || m.estado === this.filtroEstado;
      const coincideBusqueda = this.buscador === '' ||
        this.obtenerNombreEstudiante(m.estudianteId).toLowerCase().includes(this.buscador.toLowerCase()) ||
        this.obtenerNombreCurso(m.cursoId).toLowerCase().includes(this.buscador.toLowerCase());
      return coincideEstado && coincideBusqueda;
    });
  }
}
