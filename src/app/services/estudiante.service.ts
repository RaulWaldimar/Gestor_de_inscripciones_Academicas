import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword } from '@angular/fire/auth';
import { Observable, from, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Estudiante } from '../models';

@Injectable({
  providedIn: 'root'
})
export class EstudianteService {
  private estudiantesCollection!: ReturnType<typeof collection>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.estudiantesCollection = collection(this.firestore, 'estudiantes');
  }

  // CRUD Operations
  crearEstudiante(estudiante: Omit<Estudiante, 'id'>): Observable<string> {
    // Si uid está vacío, crear usuario en Firebase Auth
    if (!estudiante.uid) {
      return from(
        createUserWithEmailAndPassword(this.auth, estudiante.emailInstitucional, 'Estudiante123!')
      ).pipe(
        switchMap((userCred) => {
          const uid = userCred.user.uid;
          estudiante.uid = uid;
          
          // Guardar en colección usuarios
          return from(
            setDoc(doc(this.firestore, 'usuarios', uid), {
              nombre: estudiante.nombres,
              apellido: estudiante.apellidos,
              email: estudiante.emailInstitucional,
              rol: 'estudiante',
              uid: uid
            }).then(() => {
              // Luego guardar en colección estudiantes
              return addDoc(this.estudiantesCollection, estudiante);
            })
          ).pipe(
            map(docRef => docRef.id),
            catchError(error => {
              console.error('Error creando estudiante:', error);
              throw error;
            })
          );
        }),
        catchError(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.warn(`Usuario ${estudiante.emailInstitucional} ya existe en Auth`);
            // Si el usuario ya existe en Auth, intentar obtener su uid
            return from(addDoc(this.estudiantesCollection, estudiante)).pipe(
              map(doc => doc.id)
            );
          }
          throw error;
        })
      );
    }
    
    // Si uid ya existe, solo guardar en Firestore
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
        est.nombres.toLowerCase().includes(termino.toLowerCase()) ||
        est.apellidos.toLowerCase().includes(termino.toLowerCase()) ||
        est.emailInstitucional.toLowerCase().includes(termino.toLowerCase())
      ))
    );
  }
}
