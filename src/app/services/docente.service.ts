import { Injectable } from '@angular/core';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { Docente } from '../models';

@Injectable({
  providedIn: 'root'
})
export class DocenteService {
  private docentesCollection!: ReturnType<typeof collection>;

  constructor(private firestore: Firestore) {
    this.docentesCollection = collection(this.firestore, 'docentes');
  }

  // CRUD Operations
  crearDocente(docente: Omit<Docente, 'id'>): Observable<string> {
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
