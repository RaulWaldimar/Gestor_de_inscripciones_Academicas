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
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      emailInstitucional: ['', [Validators.required, Validators.email]],
      nivel: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      fechaNacimiento: ['', Validators.required],
      nombreApoderado: ['', Validators.required],
      telefonoApoderado: ['', [Validators.required, Validators.minLength(9)]],
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
}
