import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CursoService } from '../../services/curso.service';
import { Curso } from '../../models';

@Component({
  selector: 'app-cursos',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './cursos.html',
  styleUrls: ['./cursos.css']
})
export class CursosComponent implements OnInit {
  cursos: Curso[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  editandoId: string | null = null;
  buscador = '';

  cursoForm!: FormGroup;

  constructor(
    private cursoService: CursoService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarCursos();
  }

  initForm(): void {
    this.cursoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      descripcion: ['', Validators.required],
      grado: ['', Validators.required],
      seccion: ['', Validators.required],
      nivel: ['', Validators.required],
      horario: ['', Validators.required],
      vacantes: ['', [Validators.required, Validators.min(1)]],
      docenteNombre: ['', Validators.required],
      docenteId: ['', Validators.required],
      aula: ['', Validators.required],
      anioAcademico: [new Date().getFullYear(), Validators.required]
    });
  }

  cargarCursos(): void {
    this.loading = true;
    this.error = null;
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

  guardarCurso(): void {
    if (this.cursoForm.invalid) return;

    this.loading = true;
    const dataCurso = this.cursoForm.value;

    if (this.editandoId) {
      this.cursoService.actualizarCurso(this.editandoId, dataCurso).subscribe({
        next: () => {
          this.cargarCursos();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al actualizar el curso';
          this.loading = false;
        }
      });
    } else {
      dataCurso.fechaCreacion = new Date();
      this.cursoService.crearCurso(dataCurso).subscribe({
        next: () => {
          this.cargarCursos();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al crear el curso';
          this.loading = false;
        }
      });
    }
  }

  editarCurso(curso: Curso): void {
    this.editandoId = curso.id || null;
    this.cursoForm.patchValue(curso);
    this.showForm = true;
  }

  eliminarCurso(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este curso?')) {
      this.cursoService.eliminarCurso(id).subscribe({
        next: () => {
          this.cargarCursos();
        },
        error: (err) => {
          this.error = 'Error al eliminar el curso';
        }
      });
    }
  }

  resetForm(): void {
    this.cursoForm.reset({ estado: 'activo' });
    this.editandoId = null;
    this.showForm = false;
  }

  get cursosFiltrados(): Curso[] {
    return this.cursos.filter(c =>
      c.nombre.toLowerCase().includes(this.buscador.toLowerCase()) ||
      c.grado.toLowerCase().includes(this.buscador.toLowerCase())
    );
  }
}
