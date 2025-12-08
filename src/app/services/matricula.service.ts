import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Matricula } from '../models';
import { CursoService } from './curso.service';

@Injectable({
  providedIn: 'root'
})
export class MatriculaService {
  private matriculasCollection!: ReturnType<typeof collection>;

  constructor(
    private firestore: Firestore,
    private cursoService: CursoService
  ) {
    this.matriculasCollection = collection(this.firestore, 'matriculas');
  }

  // CRUD Operations
  crearMatricula(matricula: Omit<Matricula, 'id'>): Observable<string> {
    return from(addDoc(this.matriculasCollection, matricula)).pipe(
      switchMap(doc => {
        return this.cursoService.incrementarInscritos(matricula.cursoId).pipe(
          map(() => doc.id)
        );
      })
    );
  }

  obtenerMatriculas(): Observable<Matricula[]> {
    return from(getDocs(this.matriculasCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Matricula)))
    );
  }

  obtenerMatriculaPorId(id: string): Observable<Matricula | null> {
    return from(getDoc(doc(this.firestore, 'matriculas', id))).pipe(
      map(doc => doc.exists() ? { ...doc.data(), id: doc.id } as Matricula : null)
    );
  }

  actualizarMatricula(id: string, datos: Partial<Matricula>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'matriculas', id), datos));
  }

  eliminarMatricula(id: string): Observable<void> {
    return from(this.obtenerMatriculaPorId(id)).pipe(
      switchMap(matricula => {
        if (matricula) {
          return this.cursoService.decrementarInscritos(matricula.cursoId).pipe(
            switchMap(() => from(deleteDoc(doc(this.firestore, 'matriculas', id))))
          );
        }
        return of(undefined);
      })
    );
  }

  // Obtener matrículas por estudiante
  obtenerMatriculasPorEstudiante(estudianteId: string): Observable<Matricula[]> {
    return from(getDocs(query(this.matriculasCollection, where('estudianteId', '==', estudianteId)))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Matricula)))
    );
  }

  // Obtener matrículas por curso
  obtenerMatriculasPorCurso(cursoId: string): Observable<Matricula[]> {
    return from(getDocs(query(this.matriculasCollection, where('cursoId', '==', cursoId)))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Matricula)))
    );
  }

  // Obtener matrículas activas
  obtenerMatriculasActivas(): Observable<Matricula[]> {
    return from(getDocs(query(this.matriculasCollection, where('estado', '==', 'activa')))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Matricula)))
    );
  }

  // Validar duplicación
  validarDuplicacion(estudianteId: string, cursoId: string): Observable<boolean> {
    return from(
      getDocs(
        query(
          this.matriculasCollection,
          where('estudianteId', '==', estudianteId),
          where('cursoId', '==', cursoId),
          where('estado', '==', 'activa')
        )
      )
    ).pipe(
      map(snapshot => snapshot.empty)
    );
  }
}
