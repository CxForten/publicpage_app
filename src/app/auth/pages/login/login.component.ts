import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/header/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage = '';
  floatElements = Array.from({ length: 20 });

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cedula:    ['', [Validators.required]],
      contraseña: ['', [Validators.required]]
    });
  }

  /** Redirige al formulario de registro */
  goRegister(): void {
    this.router.navigate(['auth/register']);
  }

  /** Envía credenciales y navega a /user tras iniciar sesión */
  iniciarSesion(): void {
    if (!this.loginForm.valid) {
      return;
    }

    this.authService.login(this.loginForm.value).subscribe({
      next: () => this.router.navigate(['/user']),
      error: err => {
        this.errorMessage = err.error?.message ?? 'Error al iniciar sesión';
        console.error(err);
      }
    });
  }
}
