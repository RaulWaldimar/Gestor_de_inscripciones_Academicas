import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DocenteService } from '../../services/docente.service';
import { Docente } from '../../models';

@Component({
  selector: 'app-docentes',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './docentes.html',
  styleUrls: ['./docentes.css']
})
export class DocentesComponent implements OnInit {
  docentes: Docente[] = [];
  loading = true;
  error: string | null = null;
  showForm = false;
  editandoId: string | null = null;
  buscador = '';

  docenteForm!: FormGroup;

  constructor(
    private docenteService: DocenteService,
    private fb: FormBuilder
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cargarDocentes();
  }

  initForm(): void {
    this.docenteForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.minLength(3)]],
      apellidos: ['', [Validators.required, Validators.minLength(3)]],
      emailInstitucional: ['', [Validators.required, Validators.email]],
      telefono: ['', [Validators.required, Validators.minLength(9)]],
      nivel: ['', Validators.required],
      estado: ['activo', Validators.required]
    });
  }

  cargarDocentes(): void {
    this.loading = true;
    this.error = null;
    this.docenteService.obtenerDocentes().subscribe({
      next: (docentes) => {
        this.docentes = docentes;
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al cargar los docentes';
        this.loading = false;
      }
    });
  }

  guardarDocente(): void {
    if (this.docenteForm.invalid) return;

    this.loading = true;
    const dataDocente = this.docenteForm.value;

    if (this.editandoId) {
      this.docenteService.actualizarDocente(this.editandoId, dataDocente).subscribe({
        next: () => {
          this.cargarDocentes();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al actualizar el docente';
          this.loading = false;
        }
      });
    } else {
      this.docenteService.crearDocente(dataDocente).subscribe({
        next: () => {
          this.cargarDocentes();
          this.resetForm();
        },
        error: (err) => {
          this.error = 'Error al crear el docente';
          this.loading = false;
        }
      });
    }
  }

  editarDocente(docente: Docente): void {
    this.editandoId = docente.id || null;
    this.docenteForm.patchValue(docente);
    this.showForm = true;
  }

  eliminarDocente(id: string): void {
    if (confirm('¿Estás seguro de que deseas eliminar este docente?')) {
      this.docenteService.eliminarDocente(id).subscribe({
        next: () => {
          this.cargarDocentes();
        },
        error: (err) => {
          this.error = 'Error al eliminar el docente';
        }
      });
    }
  }

  resetForm(): void {
    this.docenteForm.reset({ estado: 'activo' });
    this.showForm = false;
    this.editandoId = null;
  }

  get docentesFiltrados(): Docente[] {
    return this.docentes.filter(d => {
      const nombres = `${d.nombres} ${d.apellidos}`.toLowerCase();
      return nombres.includes(this.buscador.toLowerCase()) ||
             d.emailInstitucional.toLowerCase().includes(this.buscador.toLowerCase());
    });
  }
}
