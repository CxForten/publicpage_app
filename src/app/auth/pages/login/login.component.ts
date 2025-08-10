import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../../core/header/services/auth.service';
import { PlanSelectionService } from '../../../core/header/services/plan-selection.service';
import { PasswordResetService } from '../../../core/header/services/password-reset.service';

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
  recoverMessage = '';
  recoverError = '';
  isLoading = false;
  isRecoverLoading = false;
  floatElements = Array.from({ length: 20 });
  showRecoverModal = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private planSelectionService: PlanSelectionService,
    private passwordResetService: PasswordResetService
  ) {
    this.loginForm = this.fb.group({
      cedula:    ['', [Validators.required]],
      contraseña: ['', [Validators.required]]
    });

    this.recoverForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });

    // Limpiar datos expirados al inicializar el componente
    this.planSelectionService.cleanupOldSelections();
  }

  /** Redirige al formulario de registro */
  goRegister(): void {
    this.router.navigate(['auth/register']);
  }

  /** Envía credenciales y navega a /user tras iniciar sesión */
  iniciarSesion(): void {
    if (!this.loginForm.valid) {
      this.markFormGroupTouched(this.loginForm);
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginForm.value).subscribe({
      next: () => {
        this.isLoading = false;
        // Verificar si hay un plan seleccionado válido y reciente
        const selectedPlan = this.planSelectionService.getSelectedPlan();
        if (selectedPlan) {
          console.log('Plan válido encontrado, redirigiendo a payment:', selectedPlan);
          this.router.navigate(['/user/payment']);
        } else {
          console.log('No hay plan válido, redirigiendo a dashboard');
          this.router.navigate(['/user']);
        }
      },
      error: err => {
        this.isLoading = false;
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
    this.recoverMessage = '';
    this.recoverError = '';
  }

  /** Envía el email de recuperación */
  sendRecoverEmail(): void {
    if (!this.recoverForm.valid) {
      this.markFormGroupTouched(this.recoverForm);
      return;
    }

    this.isRecoverLoading = true;
    this.recoverError = '';
    this.recoverMessage = '';

    const email = this.recoverForm.get('email')?.value;
    
    this.passwordResetService.requestPasswordReset(email).subscribe({
      next: (response) => {
        this.isRecoverLoading = false;
        this.recoverMessage = response.message || 'Se han enviado las instrucciones de recuperación a su correo electrónico. Por favor, revise su bandeja de entrada.';
        
        // Cerrar modal después de 3 segundos
        setTimeout(() => {
          this.closeRecoverModal();
        }, 3000);
      },
      error: (error) => {
        this.isRecoverLoading = false;
        this.recoverError = error.error?.message || 'Error al enviar las instrucciones de recuperación.';
        console.error(error);
      }
    });
  }

  /** Marca todos los campos de un formulario como tocados para mostrar errores */
  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.keys(formGroup.controls).forEach(key => {
      const control = formGroup.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }

  /** Obtiene el mensaje de error para un campo específico */
  getFieldError(formGroup: FormGroup, fieldName: string): string {
    const field = formGroup.get(fieldName);
    
    if (field?.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName === 'email' ? 'El correo electrónico' : 'Este campo'} es requerido.`;
      }
      if (field.errors['email']) {
        return 'Por favor, ingrese un correo electrónico válido.';
      }
    }
    
    return '';
  }
}
