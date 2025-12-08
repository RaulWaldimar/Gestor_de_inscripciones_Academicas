import { Injectable } from '@angular/core';
import { Observable, combineLatest, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { EstadisticasAdmin } from '../models';
import { EstudianteService } from './estudiante.service';
import { CursoService } from './curso.service';
import { MatriculaService } from './matricula.service';

@Injectable({
  providedIn: 'root'
})
export class EstadisticasService {
  constructor(
    private estudianteService: EstudianteService,
    private cursoService: CursoService,
    private matriculaService: MatriculaService
  ) {}

  obtenerEstadisticas(): Observable<EstadisticasAdmin> {
    return combineLatest([
      this.estudianteService.obtenerEstudiantes(),
      this.cursoService.obtenerCursos(),
      this.matriculaService.obtenerMatriculas()
    ]).pipe(
      map(([estudiantes, cursos, matriculas]) => {
        const estudiantesActivos = estudiantes.filter(e => e.estado === 'activo').length;
        const cursosActivos = cursos.filter(c => c.estado === 'activo').length;
        const matriculasActivas = matriculas.filter(m => m.estado === 'activa').length;
        const capacidadTotal = cursos.reduce((acc, c) => acc + c.capacidad, 0);

        return {
          totalEstudiantes: estudiantes.length,
          totalCursos: cursos.length,
          totalMatriculas: matriculas.length,
          estudiantesActivos,
          cursosActivos,
          matriculasActivas,
          tasaOcupacion: capacidadTotal > 0 ? Math.round((matriculasActivas / capacidadTotal) * 100) : 0
        };
      })
    );
  }

  obtenerMatriculasPorCurso(): Observable<{ [key: string]: number }> {
    return combineLatest([
      this.cursoService.obtenerCursos(),
      this.matriculaService.obtenerMatriculas()
    ]).pipe(
      map(([cursos, matriculas]) => {
        const resultado: { [key: string]: number } = {};
        cursos.forEach(curso => {
          resultado[curso.nombre] = matriculas.filter(m => m.cursoId === curso.id && m.estado === 'activa').length;
        });
        return resultado;
      })
    );
  }
}
