import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { Auth, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';
import { Observable, from } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { Docente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private docentesCollection!: ReturnType<typeof collection>;

  constructor(private firestore: Firestore, private auth: Auth) {
    this.docentesCollection = collection(this.firestore, 'docentes');
  }

  // CRUD Operations
  crearDocente(docente: Omit<Docente, 'id'>): Observable<string> {
    // Si uid está vacío, crear usuario en Firebase Auth
    if (!docente.uid) {
      return from(
        createUserWithEmailAndPassword(this.auth, docente.emailInstitucional, 'Docente123!')
      ).pipe(
        switchMap((userCred) => {
          const uid = userCred.user.uid;
          docente.uid = uid;
          
          // Guardar en colección usuarios
          return from(
            setDoc(doc(this.firestore, 'usuarios', uid), {
              nombre: docente.nombres,
              apellido: docente.apellidos,
              email: docente.emailInstitucional,
              rol: 'docente',
              uid: uid
            }).then(() => {
              // Luego guardar en colección docentes
              return addDoc(this.docentesCollection, docente);
            }).then((docRef) => {
              // Hacer logout para que no quede logeado el docente nuevo
              return signOut(this.auth).then(() => docRef.id);
            })
          );
        }),
        catchError(error => {
          if (error.code === 'auth/email-already-in-use') {
            console.warn(`Usuario ${docente.emailInstitucional} ya existe en Auth`);
            // Si el usuario ya existe en Auth, solo guardar en Firestore
            return from(addDoc(this.docentesCollection, docente)).pipe(
              map(doc => doc.id)
            );
          }
          throw error;
        })
      );
    }
    
    // Si uid ya existe, solo guardar en Firestore
    return from(addDoc(this.docentesCollection, docente)).pipe(
      map(doc => doc.id)
    );
  }

  obtenerDocentes(): Observable<Docente[]> {
    return from(getDocs(this.docentesCollection)).pipe(
      map(snapshot => snapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as Docente)))
    );
  }

  obtenerDocentePorId(id: string): Observable<Docente | null> {
    return from(getDoc(doc(this.firestore, 'docentes', id))).pipe(
      map(doc => doc.exists() ? { ...doc.data(), id: doc.id } as Docente : null)
    );
  }

  obtenerDocentePorUid(uid: string): Observable<Docente | null> {
    return from(getDocs(query(this.docentesCollection, where('uid', '==', uid)))).pipe(
      map(snapshot => {
        if (!snapshot.empty) {
          const doc = snapshot.docs[0];
          return { ...doc.data(), id: doc.id } as Docente;
        }
        return null;
      })
    );
  }

  actualizarDocente(id: string, datos: Partial<Docente>): Observable<void> {
    return from(updateDoc(doc(this.firestore, 'docentes', id), datos));
  }

  eliminarDocente(id: string): Observable<void> {
    return from(deleteDoc(doc(this.firestore, 'docentes', id)));
  }
}
