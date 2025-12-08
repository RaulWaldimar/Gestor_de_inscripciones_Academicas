import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, collectionData } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Curso } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CursoService {
  private cursosCollection!: ReturnType<typeof collection>;

  constructor(private firestore: Firestore) {
    this.cursosCollection = collection(this.firestore, 'cursos');
  }

  // CRUD Operations
  crearCurso(curso: Omit<Curso, 'id'>): Observable<string> {
    return from(addDoc(this.cursosCollection, curso)).pipe(
      map(doc => doc.id)
    );
  }

  obtenerCursos(): Observable<Curso[]> {
    return from(getDocs(this.cursosCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Curso)))
    );
  }

  obtenerCursoPorId(id: string): Observable<Curso | null> {
    return from(getDoc(doc(this.firestore, 'cursos', id))).pipe(
      map(doc => doc.exists() ? { ...doc.data(), id: doc.id } as Curso : null)
    );
  }

  actualizarCurso(id: string, datos: Partial<Curso>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'cursos', id), datos));
  }

  eliminarCurso(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'cursos', id)));
  }

  // Filtros y búsqueda
  obtenerCursosPorSemestre(semestre: number): Observable<Curso[]> {
    return from(getDocs(query(this.cursosCollection, where('semestre', '==', semestre)))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Curso)))
    );
  }

  obtenerCursosActivos(): Observable<Curso[]> {
    return from(getDocs(query(this.cursosCollection, where('estado', '==', 'activo')))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Curso)))
    );
  }

  buscarCursos(termino: string): Observable<Curso[]> {
    return this.obtenerCursos().pipe(
      map(cursos => cursos.filter(curso =>
        curso.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        curso.descripcion.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }

  incrementarInscritos(id: string): Observable<void> {
    // Ya no es necesario tracking de inscritos manual
    return of(undefined);
  }

  decrementarInscritos(id: string): Observable<void> {
    // Ya no es necesario tracking de inscritos manual
    return of(undefined);
  }
}
