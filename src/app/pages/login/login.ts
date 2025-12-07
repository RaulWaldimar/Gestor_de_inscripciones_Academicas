import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { Router } from '@angular/router';
import { NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf
  ]
})

export class LoginComponent {

  loginForm: FormGroup;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  async login() {
    const { email, password } = this.loginForm.value;

    try {
      await this.authService.login(email, password);
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      this.errorMessage = error.message;
    }
  }
}
