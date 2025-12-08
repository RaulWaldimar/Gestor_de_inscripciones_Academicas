import { Injectable } from '@angular/core';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private auth: Auth) {}

  // Login
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  // Registrar usuarios (si lo necesitas)
register(email: string, password: string, role: string = 'estudiante') {
  return createUserWithEmailAndPassword(this.auth, email, password);
}

  // Logout
  logout() {
    return signOut(this.auth);
  }

  // Usuario actual
  get user() {
    return this.auth.currentUser;
  }
  // Verificar si el usuario está autenticado
  isLoggedIn(): boolean {
    return this.auth.currentUser !== null;
  }
}