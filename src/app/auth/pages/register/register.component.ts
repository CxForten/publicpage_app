import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';


@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerForm: FormGroup;
  cedulaValida: boolean = false;
  mostrarEmpresa: boolean = false;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registerForm = this.fb.group({
      cedula: ['', [Validators.required]],
      nombres: ['', [Validators.required]],
      apellidos: ['', [Validators.required]],
      correo: ['', [Validators.required, Validators.email]],
      contraseña: ['', Validators.required],
      confirmar: ['', Validators.required],
      nombre_empresa: [''],
      ruc: [''],
      correo_empresarial: [''],
      cargo: [''],
      terminos: [false, Validators.requiredTrue]
    });
  }

  validarCedula() {
    const cedula = this.registerForm.get('cedula')?.value;
    this.http.get<any>(`http://localhost:3000/api/validate/${cedula}`).subscribe({
      next: (data) => {
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

  registrar() {
    if (this.registerForm.valid) {
      const datos = this.registerForm.value;
      this.http.post('http://localhost:3000/api/auth/register', datos).subscribe({
        next: () => alert('Usuario registrado'),
        error: (err) => alert('Error al registrar: ' + err.message)
      });
    } else {
      alert('Formulario inválido');
    }
  }
}

