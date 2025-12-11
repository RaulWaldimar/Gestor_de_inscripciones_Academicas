import { Injectable, inject } from '@angular/core';
import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from '@angular/fire/auth';
import { Firestore, collection, addDoc, doc, getDoc, updateDoc, deleteDoc, query, where, getDocs, setDoc } from '@angular/fire/firestore';
import { BehaviorSubject, Observable, from } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';
import { Usuario } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<Usuario | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private authInitializedSubject = new BehaviorSubject<boolean>(false);
  public authInitialized$ = this.authInitializedSubject.asObservable();

  private auth = inject(Auth);
  private firestore = inject(Firestore);

  constructor() {
    this.initAuthStateListener();
  }

  private initAuthStateListener(): void {
    onAuthStateChanged(this.auth, async (user) => {
      console.log('Auth state changed:', user ? `User: ${user.uid}` : 'No user');
      
      if (user) {
        try {
          const userDoc = await getDoc(doc(this.firestore, 'usuarios', user.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as Usuario;
            console.log('User document found:', userData.nombre);
            this.currentUserSubject.next(userData);
          } else {
            // Usuario en Firebase pero no en Firestore
            console.warn('User not found in Firestore');
            this.currentUserSubject.next(null);
            await signOut(this.auth);
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          this.currentUserSubject.next(null);
        }
      } else {
        console.log('No authenticated user');
        this.currentUserSubject.next(null);
      }
      
      // Marcar que la autenticación ha sido inicializada
      console.log('Auth initialized');
      this.authInitializedSubject.next(true);
    });
  }

  register(email: string, password: string, nombre: string, apellido: string, rol: 'estudiante' | 'docente' | 'admin'): Observable<Usuario> {
    return from(
      createUserWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) => {
        const userData: Usuario = {
          uid: user.uid,
          email,
          nombre,
          apellido,
          rol
        };
        return from(setDoc(doc(this.firestore, 'usuarios', user.uid), userData)).pipe(
          map(() => userData),
          tap(data => this.currentUserSubject.next(data))
        );
      })
    );
  }

  login(email: string, password: string): Observable<Usuario | null> {
    return from(
      signInWithEmailAndPassword(this.auth, email, password)
    ).pipe(
      switchMap(({ user }) => {
        return from(getDoc(doc(this.firestore, 'usuarios', user.uid))).pipe(
          map(doc => {
            if (doc.exists()) {
              const userData = doc.data() as Usuario;
              this.currentUserSubject.next(userData);
              return userData;
            }
            return null;
          })
        );
      })
    );
  }

  logout(): Observable<void> {
    return from(signOut(this.auth)).pipe(
      tap(() => this.currentUserSubject.next(null))
    );
  }

  getCurrentUser(): Usuario | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): Observable<boolean> {
    return this.currentUser$.pipe(map(user => !!user));
  }

  getUserRole(): 'estudiante' | 'docente' | 'admin' | null {
    return this.currentUserSubject.value?.rol || null;
  }
}
