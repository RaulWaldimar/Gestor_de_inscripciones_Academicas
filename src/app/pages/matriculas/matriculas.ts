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
  
  // Paginación
  paginaActual = 1;
  registrosPorPagina = 5;

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

    const dataMatricula = this.matriculaForm.value;
    const estudiante = this.estudiantesMap.get(dataMatricula.estudianteId);
    const curso = this.cursosMap.get(dataMatricula.cursoId);

    // Validar que el estudiante existe
    if (!estudiante) {
      this.error = 'Estudiante no encontrado';
      return;
    }

    // Validar que el curso existe
    if (!curso) {
      this.error = 'Curso no encontrado';
      return;
    }

    // Validar que el grado y sección del estudiante coincidan con el curso
    if (estudiante.grado !== curso.grado || estudiante.seccion !== curso.seccion) {
      this.error = `El estudiante es del grado ${estudiante.grado} sección ${estudiante.seccion}, pero el curso es del grado ${curso.grado} sección ${curso.seccion}. No puede matricularse en este curso.`;
      return;
    }

    this.loading = true;
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

  revertirCancelacion(id: string): void {
    if (confirm('¿Deseas reactivar esta matrícula a estado activo?')) {
      this.matriculaService.actualizarMatricula(id, { estado: 'activa' }).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => {
          console.error('Error reactivando matrícula:', err);
          this.error = 'Error al reactivar la matrícula';
        }
      });
    }
  }

  eliminarMatricula(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar esta matrícula? Esta acción no se puede deshacer.')) {
      this.matriculaService.eliminarMatricula(id).subscribe({
        next: () => {
          this.cargarDatos();
        },
        error: (err) => {
          console.error('Error eliminando matrícula:', err);
          this.error = 'Error al eliminar la matrícula';
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

  get cursosDisponibles(): Curso[] {
    const estudianteId = this.matriculaForm.get('estudianteId')?.value;
    if (!estudianteId) {
      return [];
    }
    
    const estudiante = this.estudiantesMap.get(estudianteId);
    if (!estudiante) {
      return [];
    }

    // Filtrar cursos que coincidan con grado y sección del estudiante
    return this.cursos.filter(curso => 
      curso.grado === estudiante.grado && curso.seccion === estudiante.seccion
    );
  }

  get estudianteSeleccionado(): Estudiante | null {
    const estudianteId = this.matriculaForm.get('estudianteId')?.value;
    return estudianteId ? this.estudiantesMap.get(estudianteId) || null : null;
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

  get gradosUnicos(): string[] {
    const grados = [...new Set(this.matriculasFiltradas.map(m => {
      const estudiante = this.estudiantesMap.get(m.estudianteId);
      return estudiante?.grado || '';
    }).filter(g => g))];
    return grados.sort((a, b) => {
      const numA = parseInt(a.match(/\d+/)?.[0] || '0');
      const numB = parseInt(b.match(/\d+/)?.[0] || '0');
      return numA - numB;
    });
  }

  obtenerMatriculasPorGrado(grado: string): MatriculaConDatos[] {
    return this.matriculasFiltradas.filter(m => {
      const estudiante = this.estudiantesMap.get(m.estudianteId);
      return estudiante?.grado === grado;
    });
  }

  get totalPaginas(): number {
    return Math.ceil(this.matriculasFiltradas.length / this.registrosPorPagina);
  }

  get matriculasPaginadas(): MatriculaConDatos[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.matriculasFiltradas.slice(inicio, fin);
  }

  irAPagina(pagina: number): void {
    if (pagina >= 1 && pagina <= this.totalPaginas) {
      this.paginaActual = pagina;
    }
  }

  siguientePagina(): void {
    this.irAPagina(this.paginaActual + 1);
  }

  paginaAnterior(): void {
    this.irAPagina(this.paginaActual - 1);
  }
}
