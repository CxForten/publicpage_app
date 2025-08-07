import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { Observable, of, delay, catchError, throwError } from 'rxjs';
import { AuthService } from '../../../core/header/services/auth.service';
import { PlanSelectionService } from '../../../core/services/plan-selection.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,HttpClientModule,  RouterModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  animations: [
    trigger('slideIn', [
      transition(':enter', [
        style({
          opacity: 0,
          transform: 'translateY(-20px) scaleY(0.8)',
          height: '0px',
          overflow: 'hidden'
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 1,
          transform: 'translateY(0) scaleY(1)',
          height: '*'
        }))
      ]),
      transition(':leave', [
        style({
          opacity: 1,
          transform: 'translateY(0) scaleY(1)',
          height: '*',
          overflow: 'hidden'
        }),
        animate('400ms cubic-bezier(0.4, 0, 0.2, 1)', style({
          opacity: 0,
          transform: 'translateY(-20px) scaleY(0.8)',
          height: '0px'
        }))
      ])
    ])
  ]
})

export class RegisterComponent {
  registerForm: FormGroup;
  cedulaValida = false;
  validandoCedula = false;
  mostrarEmpresa = false;
  floatElements = Array.from({ length: 20 });
  showTermsModal = false;
  
  // Propiedades para mostrar mensajes en la página
  mensajeError = '';
  mensajeExito = '';
  mostrandoMensaje = false;

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router, private authService: AuthService, private planSelectionService: PlanSelectionService) {
    this.registerForm = this.fb.group({
      cedula: [
        '',
        [Validators.required, Validators.pattern(/^\d{10}$/)] // Solo validar que sea 10 dígitos
      ],
      nombres_completos: [
        '',
        [Validators.required]
      ],
      correo: [
        '',
        [Validators.required, Validators.email]
      ],
      contraseña: [
        '',
        [Validators.required, Validators.minLength(6)]
      ],
      confirmar: [
        '',
        [Validators.required]
      ],
      nombre_empresa: [''],
      ruc: [''],
      correo_empresarial: [''],
      cargo: [''],
      terminos: [
        false,
        [Validators.requiredTrue]
      ]
    });

    // Validador personalizado para confirmar contraseña
    this.registerForm.get('confirmar')?.setValidators([
      Validators.required,
      this.confirmarContrasenaValidator.bind(this)
    ]);

    // Escuchar cambios en el campo cédula para resetear validación
    this.registerForm.get('cedula')?.valueChanges.subscribe(() => {
      this.cedulaValida = false;
      this.registerForm.patchValue({ nombres_completos: '' });
    });
  }

  // Validador para confirmar contraseña
  confirmarContrasenaValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;
    
    const contrasena = this.registerForm?.get('contraseña')?.value;
    const confirmar = control.value;
    
    return contrasena === confirmar ? null : { contrasenaNoCoincide: true };
  }

  // Métodos para mostrar mensajes en la página
  mostrarError(mensaje: string): void {
    this.mensajeError = mensaje;
    this.mensajeExito = '';
    this.mostrandoMensaje = true;
    
    // Auto-ocultar después de 5 segundos
    setTimeout(() => {
      this.ocultarMensajes();
    }, 5000);
  }

  mostrarExito(mensaje: string): void {
    this.mensajeExito = mensaje;
    this.mensajeError = '';
    this.mostrandoMensaje = true;
    
    // Auto-ocultar después de 3 segundos
    setTimeout(() => {
      this.ocultarMensajes();
    }, 3000);
  }

  ocultarMensajes(): void {
    this.mensajeError = '';
    this.mensajeExito = '';
    this.mostrandoMensaje = false;
  }

  getMensajeErrorLineas(): string[] {
    return this.mensajeError.split('\n').filter(linea => linea.trim() !== '');
  }

  validarCedula(): void {
    const cedula = this.registerForm.get('cedula')?.value;
    
    if (!cedula) {
      this.mostrarError('Por favor ingrese una cédula');
      return;
    }

    // Validar formato básico (10 dígitos y provincia válida)
    if (!this.esFormatoCedulaValido(cedula)) {
      this.mostrarError('La cédula ingresada no es válida. Verifique que tenga 10 dígitos y sea una cédula ecuatoriana válida.');
      return;
    }

    this.validandoCedula = true;
    this.ocultarMensajes(); // Limpiar mensajes anteriores
    
    // Consultar API del Registro Civil de Ecuador
    this.consultarRegistroCivil(cedula)
      .subscribe({
        next: (data) => {
          if (data && (data.nombres || data.apellidos)) {
            // Manejar diferentes formatos de respuesta de la API
            let nombresCompletos = '';
            
            if (data.nombres && data.apellidos) {
              nombresCompletos = `${data.nombres} ${data.apellidos}`;
            } else if (data.nombres) {
              nombresCompletos = data.nombres;
            } else if (data.apellidos) {
              nombresCompletos = data.apellidos;
            }
            
            this.registerForm.patchValue({
              nombres_completos: nombresCompletos.trim()
            });
            this.cedulaValida = true;
            this.validandoCedula = false;
            this.mostrarExito('Cédula validada correctamente');
            
            console.log('Datos obtenidos de la API:', data);
          } else {
            this.mostrarError('No se encontraron datos para esta cédula');
            this.cedulaValida = false;
            this.validandoCedula = false;
          }
        },
        error: (error) => {
          console.error('Error al consultar registro civil:', error);
          this.mostrarError('Error al consultar los datos. Verifique la cédula e intente nuevamente.');
          this.cedulaValida = false;
          this.validandoCedula = false;
        }
      });
  }

  // Método para validar formato básico de cédula (más permisivo para testing)
  private esFormatoCedulaValido(cedula: string): boolean {
    if (!cedula || cedula.length !== 10) {
      return false;
    }

    // Verificar que todos los caracteres sean dígitos
    if (!/^\d{10}$/.test(cedula)) {
      return false;
    }

    const provincia = parseInt(cedula.substring(0, 2));
    
    // Verificar provincia válida
    if (provincia < 1 || provincia > 24) {
      return false;
    }

    // Para cédulas de prueba, ser más permisivo
    const cedulasPrueba = ['0123456789', '0987654321', '1234567890', '0102030405'];
    if (cedulasPrueba.includes(cedula)) {
      return true;
    }

    // Para cédulas reales, aplicar el algoritmo completo
    return this.esCedulaEcuatorianaValida(cedula);
  }

  // Método para validar cédula ecuatoriana
  private esCedulaEcuatorianaValida(cedula: string): boolean {
    if (!cedula || cedula.length !== 10) {
      return false;
    }

    const digitos = cedula.split('').map(Number);
    const provincia = parseInt(cedula.substring(0, 2));
    
    if (provincia < 1 || provincia > 24) {
      return false;
    }

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      let resultado = digitos[i] * coeficientes[i];
      if (resultado > 9) {
        resultado -= 9;
      }
      suma += resultado;
    }

    const digitoVerificador = digitos[9];
    const residuo = suma % 10;
    const digitoCalculado = residuo === 0 ? 0 : 10 - residuo;

    return digitoCalculado === digitoVerificador;
  }

  // Método para consultar la API del Registro Civil
  private consultarRegistroCivil(cedula: string): Observable<{ nombres: string; apellidos: string }> {
    // Intentar primero con la API real en localhost:3001
    return this.http.get<{ nombres: string; apellidos: string }>(
      `http://localhost:3001/ciudadanos/${cedula}`
    ).pipe(
      // Si falla la API real, usar datos de prueba como fallback
      catchError((error) => {
        console.log('API no disponible, usando datos de prueba', error);
        
        // Simulación de datos para testing - fallback cuando la API no está disponible
        const datosPrueba: { [key: string]: { nombres: string; apellidos: string } } = {
          '0123456789': { nombres: 'Juan Carlos', apellidos: 'Pérez González' },
          '0987654321': { nombres: 'María Elena', apellidos: 'López Martínez' },
          '1234567890': { nombres: 'Pedro Antonio', apellidos: 'Rodríguez Silva' },
          '0102030405': { nombres: 'Carlos Eduardo', apellidos: 'Morales Vega' },
          '1714616123': { nombres: 'Ana Sofía', apellidos: 'García Torres' },
          '0926687856': { nombres: 'Luis Miguel', apellidos: 'Sánchez Ruiz' },
          '1313700120': { nombres: 'Christofer Javier', apellidos: 'Chavarria Vera' },
        };

        // Simular respuesta de API con datos de prueba
        if (datosPrueba[cedula]) {
          return of(datosPrueba[cedula]).pipe(delay(500)); // Simular delay de red más corto para fallback
        } else {
          // Si no hay datos de prueba, lanzar error
          return throwError(() => new Error('Cédula no encontrada en los registros'));
        }
      })
    );
  }

  registrar(): void {
    if (!this.registerForm.valid) {
      this.mostrarErroresFormulario();
      return;
    }

    if (!this.cedulaValida) {
      this.mostrarError('Debe validar la cédula antes de registrarse');
      return;
    }

    // Preparar los datos para envío
    const formData = { ...this.registerForm.value };
    
    // Separar nombres completos en nombres y apellidos para el backend si es necesario
    const nombresCompletos = formData.nombres_completos.split(' ');
    const nombres = nombresCompletos.slice(0, Math.ceil(nombresCompletos.length / 2)).join(' ');
    const apellidos = nombresCompletos.slice(Math.ceil(nombresCompletos.length / 2)).join(' ');
    
    formData.nombres = nombres;
    formData.apellidos = apellidos;
    delete formData.nombres_completos;
    delete formData.confirmar; // No enviar confirmación de contraseña

    this.http
      .post('http://localhost:3000/api/auth/register', formData)
      .subscribe({
        next: (response: any) => {
          this.mostrarExito('Usuario registrado exitosamente');
          this.registerForm.reset();
          this.cedulaValida = false;
          
          // Auto-login después del registro exitoso
          if (response.token) {
            // Si la API de registro devuelve un token, usarlo directamente
            this.authService.setAuthenticationState(response.token);
            
            setTimeout(() => {
              // Verificar si hay un plan seleccionado
              if (this.planSelectionService.hasSelectedPlan()) {
                this.router.navigate(['/user/payment']);
              } else {
                this.router.navigate(['/user']);
              }
            }, 1500);
          } else {
            // Si no hay token en la respuesta, hacer login automático
            const loginData = {
              cedula: formData.cedula,
              contraseña: formData.contraseña
            };
            
            this.authService.login(loginData).subscribe({
              next: () => {
                setTimeout(() => {
                  // Verificar si hay un plan seleccionado
                  if (this.planSelectionService.hasSelectedPlan()) {
                    this.router.navigate(['/user/payment']);
                  } else {
                    this.router.navigate(['/user']);
                  }
                }, 1500);
              },
              error: (loginError) => {
                console.error('Error en auto-login:', loginError);
                // Si falla el auto-login, redirigir a login manual
                setTimeout(() => {
                  this.router.navigate(['/auth/login']);
                }, 1500);
              }
            });
          }
        },
        error: err => {
          console.error('Error al registrar:', err);
          this.mostrarError('Error al registrar: ' + (err.error?.message || err.message));
        }
      });
  }

  private mostrarErroresFormulario(): void {
    const errores = [];
    
    if (this.registerForm.get('cedula')?.invalid) {
      if (this.registerForm.get('cedula')?.errors?.['required']) {
        errores.push('La cédula es requerida');
      }
      if (this.registerForm.get('cedula')?.errors?.['pattern']) {
        errores.push('La cédula debe tener 10 dígitos');
      }
    }
    
    if (this.registerForm.get('nombres_completos')?.invalid) {
      errores.push('Los nombres y apellidos son requeridos');
    }
    
    if (this.registerForm.get('correo')?.invalid) {
      if (this.registerForm.get('correo')?.errors?.['required']) {
        errores.push('El correo electrónico es requerido');
      }
      if (this.registerForm.get('correo')?.errors?.['email']) {
        errores.push('El correo electrónico no es válido');
      }
    }
    
    if (this.registerForm.get('contraseña')?.invalid) {
      if (this.registerForm.get('contraseña')?.errors?.['required']) {
        errores.push('La contraseña es requerida');
      }
      if (this.registerForm.get('contraseña')?.errors?.['minlength']) {
        errores.push('La contraseña debe tener al menos 6 caracteres');
      }
    }
    
    if (this.registerForm.get('confirmar')?.invalid) {
      if (this.registerForm.get('confirmar')?.errors?.['required']) {
        errores.push('Debe confirmar la contraseña');
      }
      if (this.registerForm.get('confirmar')?.errors?.['contrasenaNoCoincide']) {
        errores.push('Las contraseñas no coinciden');
      }
    }
    
    if (this.registerForm.get('terminos')?.invalid) {
      errores.push('Debe aceptar los términos y condiciones');
    }
    
    if (errores.length > 0) {
      this.mostrarError('Errores en el formulario:\n• ' + errores.join('\n• '));
    }
  }


  openTermsModal(): void {
    this.showTermsModal = true;
  }

  closeTermsModal(): void {
    this.showTermsModal = false;
  }

  acceptTerms(): void {
    this.registerForm.patchValue({ terminos: true });
    this.closeTermsModal();
  }
}
