import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  registerForm!: FormGroup;
  showRegister = false;
  loading = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.initForms();
  }

  initForms(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      nombre: ['', [Validators.required, Validators.minLength(2)]],
      apellido: ['', [Validators.required, Validators.minLength(2)]],
      rol: ['estudiante', Validators.required]
    });
  }

  login(): void {
    if (this.loginForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password } = this.loginForm.value;
    this.authService.login(email, password).subscribe({
      next: (user) => {
        if (user) {
          // Redirigir según el rol
          if (user.rol === 'admin') {
            this.router.navigate(['/admin-dashboard']);
          } else if (user.rol === 'docente') {
            this.router.navigate(['/docente']);
          } else {
            this.router.navigate(['/dashboard']);
          }
        } else {
          this.error = 'Credenciales inválidas';
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.loading = false;
      }
    });
  }

  register(): void {
    if (this.registerForm.invalid) return;

    this.loading = true;
    this.error = null;

    const { email, password, nombre, apellido, rol } = this.registerForm.value;
    this.authService.register(email, password, nombre, apellido, rol).subscribe({
      next: (user) => {
        // Redirigir según el rol
        if (user.rol === 'admin') {
          this.router.navigate(['/admin-dashboard']);
        } else if (user.rol === 'docente') {
          this.router.navigate(['/docente']);
        } else {
          this.router.navigate(['/dashboard']);
        }
        this.loading = false;
      },
      error: (err) => {
        this.error = this.getErrorMessage(err);
        this.loading = false;
      }
    });
  }

  toggleForm(): void {
    this.showRegister = !this.showRegister;
    this.error = null;
  }

  private getErrorMessage(error: any): string {
    if (error.code === 'auth/user-not-found') {
      return 'Usuario no encontrado';
    } else if (error.code === 'auth/wrong-password') {
      return 'Contraseña incorrecta';
    } else if (error.code === 'auth/email-already-in-use') {
      return 'El email ya está registrado';
    } else if (error.code === 'auth/weak-password') {
      return 'La contraseña es muy débil';
    }
    return error.message || 'Error al procesar la solicitud';
  }

  get emailError(): string {
    const control = this.showRegister ? 
      this.registerForm.get('email') : 
      this.loginForm.get('email');
    if (control?.hasError('required')) {
      return 'El email es requerido';
    }
    if (control?.hasError('email')) {
      return 'El email no es válido';
    }
    return '';
  }

  get passwordError(): string {
    const control = this.showRegister ? 
      this.registerForm.get('password') : 
      this.loginForm.get('password');
    if (control?.hasError('required')) {
      return 'La contraseña es requerida';
    }
    if (control?.hasError('minlength')) {
      return 'La contraseña debe tener mínimo 6 caracteres';
    }
    return '';
  }
}
