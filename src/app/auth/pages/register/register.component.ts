import { CommonModule } from '@angular/common';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import {ReactiveFormsModule, FormBuilder, FormGroup,Validators} from '@angular/forms';
import { RouterModule } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
  mostrarEmpresa = false;
  floatElements = Array.from({ length: 20 });
  showTermsModal = false;

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
