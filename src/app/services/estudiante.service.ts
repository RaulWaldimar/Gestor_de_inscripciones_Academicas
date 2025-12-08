import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { Estudiante } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudiantesCollection!: ReturnType<typeof collection>;

  constructor(private firestore: Firestore) {
    this.estudiantesCollection = collection(this.firestore, 'estudiantes');
  }

  // CRUD Operations
  crearEstudiante(estudiante: Omit<Estudiante, 'id'>): Observable<string> {
    return from(addDoc(this.estudiantesCollection, estudiante)).pipe(
      map(doc => doc.id)
    );
  }

  obtenerEstudiantes(): Observable<Estudiante[]> {
    return from(getDocs(this.estudiantesCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Estudiante)))
    );
  }

  obtenerEstudiantePorId(id: string): Observable<Estudiante | null> {
    return from(getDoc(doc(this.firestore, 'estudiantes', id))).pipe(
      map(doc => doc.exists() ? { ...doc.data(), id: doc.id } as Estudiante : null)
    );
  }

  obtenerEstudiantePorUid(uid: string): Observable<Estudiante | null> {
    return from(getDocs(query(this.estudiantesCollection, where('uid', '==', uid)))).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return { ...doc.data(), id: doc.id } as Estudiante;
        }
        return null;
      })
    );
  }

  actualizarEstudiante(id: string, datos: Partial<Estudiante>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'estudiantes', id), datos));
  }

  eliminarEstudiante(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'estudiantes', id)));
  }

  // Filtros y búsqueda
  obtenerEstudiantesPorSemestre(semestre: number): Observable<Estudiante[]> {
    return from(getDocs(query(this.estudiantesCollection, where('semestre', '==', semestre)))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Estudiante)))
    );
  }

  obtenerEstudiantesActivos(): Observable<Estudiante[]> {
    return from(getDocs(query(this.estudiantesCollection, where('estado', '==', 'activo')))).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Estudiante)))
    );
  }

  buscarEstudiantes(termino: string): Observable<Estudiante[]> {
    return this.obtenerEstudiantes().pipe(
      map(estudiantes => estudiantes.filter(est =>
        est.nombre.toLowerCase().includes(termino.toLowerCase()) ||
        est.apellido.toLowerCase().includes(termino.toLowerCase()) ||
        est.email.toLowerCase().includes(termino.toLowerCase()) ||
        est.matricula.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }
}
