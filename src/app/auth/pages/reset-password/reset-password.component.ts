import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { PasswordResetService } from '../../../core/header/services/password-reset.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  token = '';
  newPassword = '';
  confirmPassword = '';
  loading = true;
  submitting = false;
  isValidToken = false;
  userName = '';
  message = '';
  messageType = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private passwordResetService: PasswordResetService
  ) {}

  ngOnInit() {
    this.token = this.route.snapshot.queryParams['token'];
    if (this.token) {
      this.validateToken();
    } else {
      this.message = 'Token de restablecimiento no válido';
      this.messageType = 'error';
      this.loading = false;
    }
  }

  validateToken() {
    this.passwordResetService.validateResetToken(this.token).subscribe({
      next: (response) => {
        this.isValidToken = true;
        this.userName = `${response.user.nombres} ${response.user.apellidos}`;
        this.loading = false;
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = error.error?.message || 'Token inválido o expirado';
        this.loading = false;
      }
    });
  }

  onSubmit() {
    if (this.newPassword !== this.confirmPassword) {
      this.messageType = 'error';
      this.message = 'Las contraseñas no coinciden';
      return;
    }

    if (this.newPassword.length < 6) {
      this.messageType = 'error';
      this.message = 'La contraseña debe tener al menos 6 caracteres';
      return;
    }

    this.submitting = true;
    this.message = '';
    
    this.passwordResetService.resetPassword(this.token, this.newPassword).subscribe({
      next: (response) => {
        this.messageType = 'success';
        this.message = response.message || 'Contraseña actualizada exitosamente. Redirigiendo al login...';
        this.submitting = false;
        
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/auth/login']);
        }, 3000);
      },
      error: (error) => {
        this.messageType = 'error';
        this.message = error.error?.message || 'Error al restablecer contraseña';
        this.submitting = false;
      }
    });
  }

  goToLogin() {
    this.router.navigate(['/auth/login']);
  }
}
