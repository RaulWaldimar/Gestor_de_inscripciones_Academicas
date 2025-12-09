import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EstudianteService } from '../../services/estudiante.service';
import { Estudiante } from '../../models';
import { EstadoEstudiantePipe } from '../../pipes/custom.pipes';

@Component({
  selector: 'app-estudiantes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, EstadoEstudiantePipe],
  templateUrl: './estudiantes.html',
  styleUrls: ['./estudiantes.css']
})
export class EstudiantesComponent implements OnInit {
  estudiantes: Estudiante[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  editandoId: string | null = null;
  buscador = '';
  
  // Paginación
  paginaActual = 1;
  registrosPorPagina = 5;

  estudianteForm!: FormGroup;

  constructor(
    private estudianteService: EstudianteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarEstudiantes();
  }

  initForm(): void {
    this.estudianteForm = this.fb.group({
      nombres: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]],
      apellidos: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.maxLength(50),
        Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/)
      ]],
      emailInstitucional: ['', [
        Validators.required, 
        Validators.email,
        Validators.pattern(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
      ]],
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', [
        Validators.required,
        Validators.pattern(/^[A-Za-z0-9]$/)
      ]],
      fechaNacimiento: ['', Validators.required],
      nombreApoderado: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      telefonoApoderado: ['', [
        Validators.required, 
        Validators.minLength(9),
        Validators.maxLength(15),
        Validators.pattern(/^[0-9]{9,15}$/)
      ]],
      estado: ['activo', Validators.required]
    });
  }

  cargarEstudiantes(): void {
    this.loading = true;
    this.error = null;
    this.estudianteService.obtenerEstudiantes().subscribe({
      next: (estudiantes) => {
        this.estudiantes = estudiantes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los estudiantes';
        this.loading = false;
      }
    });
  }

  guardarEstudiante(): void {
    if (this.estudianteForm.invalid) return;

    this.loading = true;
    const dataEstudiante = this.estudianteForm.value;

    if (this.editandoId) {
      this.estudianteService.actualizarEstudiante(this.editandoId, dataEstudiante).subscribe({
        next: () => {
          this.cargarEstudiantes();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al actualizar el estudiante';
          this.loading = false;
        }
      });
    } else {
      dataEstudiante.uid = '';
      this.estudianteService.crearEstudiante(dataEstudiante).subscribe({
        next: () => {
          this.cargarEstudiantes();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al crear el estudiante';
          this.loading = false;
        }
      });
    }
  }

  editarEstudiante(estudiante: Estudiante): void {
    this.editandoId = estudiante.id || null;
    this.estudianteForm.patchValue(estudiante);
    this.showForm = true;
  }

  eliminarEstudiante(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este estudiante?')) {
      this.estudianteService.eliminarEstudiante(id).subscribe({
        next: () => {
          this.cargarEstudiantes();
        },
        error: (err) => {
          this.error = 'Error al eliminar el estudiante';
        }
      });
    }
  }

  resetForm(): void {
    this.estudianteForm.reset({ estado: 'activo' });
    this.editandoId = null;
    this.showForm = false;
  }

  get estudiantesFiltrados(): Estudiante[] {
    return this.estudiantes.filter(e =>
      e.nombres.toLowerCase().includes(this.buscador.toLowerCase()) ||
      e.apellidos.toLowerCase().includes(this.buscador.toLowerCase()) ||
      e.emailInstitucional.toLowerCase().includes(this.buscador.toLowerCase())
    );
  }

  get totalPaginas(): number {
    return Math.ceil(this.estudiantesFiltrados.length / this.registrosPorPagina);
  }

  get estudiantesPaginados(): Estudiante[] {
    const inicio = (this.paginaActual - 1) * this.registrosPorPagina;
    const fin = inicio + this.registrosPorPagina;
    return this.estudiantesFiltrados.slice(inicio, fin);
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