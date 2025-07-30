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
  recoverForm: FormGroup;
  errorMessage = '';
  floatElements = Array.from({ length: 20 });
  showRecoverModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      cedula:    ['', [Validators.required]],
      contraseña: ['', [Validators.required]]
    });

    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
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

  /** Abre el modal de recuperación de contraseña */
  openRecoverModal(): void {
    this.showRecoverModal = true;
  }

  /** Cierra el modal de recuperación de contraseña */
  closeRecoverModal(): void {
    this.showRecoverModal = false;
    this.recoverForm.reset();
  }

  /** Envía el email de recuperación */
  sendRecoverEmail(): void {
    if (!this.recoverForm.valid) {
      return;
    }

    const email = this.recoverForm.get('email')?.value;
    
    // Aquí puedes implementar la lógica real para enviar el email
    console.log('Enviando email de recuperación a:', email);
    
    // Simular envío exitoso
    alert('Se han enviado las instrucciones de recuperación a su correo electrónico.');
    this.closeRecoverModal();
  }
}
