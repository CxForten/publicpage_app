import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-support',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './support.component.html',
  styleUrl: './support.component.css'
})
export class SupportComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      nombre: ['', [Validators.required]],
      empresa: [''],
      email: ['', [Validators.required, Validators.email]],
      telefono: [''],
      mensaje: ['', [Validators.required]]
    });
  }

  enviarMensaje(): void {
    if (this.contactForm.valid) {
      const formData = this.contactForm.value;
      console.log('Enviando mensaje:', formData);
      
      // Aquí puedes implementar la lógica para enviar el mensaje
      // Por ejemplo, enviar a un servicio backend
      
      // Simular envío exitoso
      alert('Mensaje enviado correctamente. Nos pondremos en contacto contigo pronto.');
      this.contactForm.reset();
    } else {
      alert('Por favor completa todos los campos requeridos.');
    }
  }
}
