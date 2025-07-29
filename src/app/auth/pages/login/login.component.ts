import { AuthService } from '../../../core/header/services/auth.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cedula: ['', [Validators.required]],
      contraseña: ['', [Validators.required]]
    });
  }

    // Funcionalidad: redirige al formulario de registro
  goRegister(): void {
    this.router.navigate(['auth/register']);
  }



  iniciarSesion() {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe({
        next: () => this.router.navigate(['/user']),
        error: err => {
          this.errorMessage = err.error.message || 'Error al iniciar sesión';
          console.error(err);
        }
      });
    }
  }
}
