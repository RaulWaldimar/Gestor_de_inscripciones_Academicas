import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterModule, Router } from '@angular/router';
import { AuthService } from './services/auth.service';
import { Usuario } from './models';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  title = 'Gestor de Inscripciones Académicas';
  currentUser: Usuario | null = null;
  menuAbierto = false;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      // Limpiar menú cuando no hay usuario
      if (!user) {
        this.menuAbierto = false;
      }
    });
  }

  logout(): void {
    if (confirm('¿Deseas cerrar sesión?')) {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
          this.menuAbierto = false;
        }
      });
    }
  }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  closeMenu(): void {
    this.menuAbierto = false;
  }
}
