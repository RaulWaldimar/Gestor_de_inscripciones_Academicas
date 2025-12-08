import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatriculaService } from '../../services/matricula.service';
import { EstudianteService } from '../../services/estudiante.service';
import { CursoService } from '../../services/curso.service';
import { Matricula, Estudiante, Curso } from '../../models';
import { EstadoMatriculaPipe } from '../../pipes/custom.pipes';
import { SafeDatePipe } from '../../pipes/timestamp.pipe';
import { forkJoin } from 'rxjs';

interface MatriculaConDatos extends Matricula {
  nombreEstudiante?: string;
  nombreCurso?: string;
}

@Component({
  selector: 'app-matriculas',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EstadoMatriculaPipe, SafeDatePipe],
  templateUrl: './matriculas.html',
  styleUrls: ['./matriculas.css']
})
export class MatriculasComponent implements OnInit {
  matriculas: MatriculaConDatos[] = [];
  estudiantes: Estudiante[] = [];
  cursos: Curso[] = [];
  estudiantesMap: Map<string, Estudiante> = new Map();
  cursosMap: Map<string, Curso> = new Map();
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

    forkJoin({
      matriculas: this.matriculaService.obtenerMatriculas(),
      estudiantes: this.estudianteService.obtenerEstudiantes(),
      cursos: this.cursoService.obtenerCursos()
    }).subscribe({
      next: (resultado) => {
        const matriculas = resultado.matriculas || [];
        const estudiantes = resultado.estudiantes || [];
        const cursos = resultado.cursos || [];

        // Guardar para el formulario
        this.estudiantes = estudiantes;
        this.cursos = cursos;

        // Crear mapas para búsqueda rápida
        this.estudiantesMap.clear();
        this.cursosMap.clear();

        estudiantes.forEach(e => {
          if (e.id) this.estudiantesMap.set(e.id, e);
        });

        cursos.forEach(c => {
          if (c.id) this.cursosMap.set(c.id, c);
        });

        // Enriquecer matrículas con datos
        this.matriculas = matriculas.map(m => ({
          ...m,
          nombreEstudiante: this.obtenerNombreEstudiante(m.estudianteId),
          nombreCurso: this.obtenerNombreCurso(m.cursoId)
        }));

        console.log('✅ Datos cargados:');
        console.log('   Matrículas:', this.matriculas.length);
        console.log('   Estudiantes:', this.estudiantesMap.size);
        console.log('   Cursos:', this.cursosMap.size);
        console.log('   Matrículas válidas:', this.matriculas.filter(m => m.nombreEstudiante !== 'Estudiante no encontrado').length);
        
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error cargando datos:', err);
        this.error = 'Error al cargar los datos. Por favor, recarga la página.';
        this.loading = false;
      }
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
            console.error('Error creando matrícula:', err);
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
          console.error('Error cancelando matrícula:', err);
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
    const est = this.estudiantesMap.get(estudianteId);
    if (est) {
      return `${est.nombres} ${est.apellidos}`;
    }
    return 'Estudiante no encontrado';
  }

  obtenerNombreCurso(cursoId: string): string {
    const curso = this.cursosMap.get(cursoId);
    return curso ? curso.nombre : 'Curso no encontrado';
  }

  get matriculasFiltradas(): MatriculaConDatos[] {
    return this.matriculas.filter(m => {
      const coincideEstado = this.filtroEstado === '' || m.estado === this.filtroEstado;
      const coincideBusqueda = this.buscador === '' ||
        (m.nombreEstudiante?.toLowerCase().includes(this.buscador.toLowerCase()) ?? false) ||
        (m.nombreCurso?.toLowerCase().includes(this.buscador.toLowerCase()) ?? false);
      return coincideEstado && coincideBusqueda;
    });
  }
}
