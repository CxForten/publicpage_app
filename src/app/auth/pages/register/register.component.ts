import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators
} from '@angular/forms';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,  // necesario para HttpClient
    RouterModule       // necesario para routerLink
  ],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerForm: FormGroup;
  cedulaValida = false;
  mostrarEmpresa = false;
  floatElements = Array.from({ length: 20 });

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      cedula: [
        '',
        [Validators.required]
      ],
      nombres: [
        '',
        [Validators.required]
      ],
      apellidos: [
        '',
        [Validators.required]
      ],
      correo: [
        '',
        [Validators.required, Validators.email]
      ],
      contraseña: [
        '',
        [Validators.required]
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
  }

  validarCedula(): void {
    const cedula = this.registerForm.get('cedula')?.value;
    this.http
      .get<{ nombres: string; apellidos: string }>(
        `http://localhost:3000/api/validate/${cedula}`
      )
      .subscribe({
        next: data => {
          this.registerForm.patchValue({
            nombres: data.nombres,
            apellidos: data.apellidos
          });
          this.cedulaValida = true;
        },
        error: () => {
          alert('Cédula no encontrada');
          this.cedulaValida = false;
        }
      });
  }

  registrar(): void {
    if (!this.registerForm.valid) {
      alert('Formulario inválido');
      return;
    }

    this.http
      .post('http://localhost:3000/api/auth/register', this.registerForm.value)
      .subscribe({
        next: () => alert('Usuario registrado'),
        error: err => alert('Error al registrar: ' + err.message)
      });
  }
}
