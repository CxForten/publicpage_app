import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

interface Session {
  id: string;
  device: string;
  browser: string;
  ip: string;
  current: boolean;
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
 profileForm!: FormGroup;
  passwordForm!: FormGroup;
  is2FAEnabled = false;
  sessions: Session[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.profileForm = this.fb.group({
      email: ['', [ Validators.required, Validators.email ]],
      phone: ['', [ Validators.required, Validators.pattern(/^[0-9]+$/) ]]
    });

    this.passwordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [ Validators.required, Validators.minLength(8) ]],
      confirmPassword: ['', Validators.required]
    }, { validator: this.matchPasswords });
    
    this.sessions = [
      { id: '1', device: 'Windows', browser: 'Chrome', ip: '27.50.12.103', current: true },
      { id: '2', device: 'iPhone', browser: 'Safari', ip: '192.168.1.42', current: false }
    ];
  }

  private matchPasswords(group: FormGroup) {
    const np = group.get('newPassword')?.value;
    const cp = group.get('confirmPassword')?.value;
    return np === cp ? null : { notMatching: true };
  }

  onSaveProfile() {
    if (this.profileForm.invalid) return;
    console.log('Guardar perfil', this.profileForm.value);
    // Llamar a tu servicio para actualizar email / teléfono
  }

  onChangePassword() {
    if (this.passwordForm.invalid) return;
    console.log('Cambiar contraseña', this.passwordForm.value);
    // Llamar a tu servicio para cambiar contraseña
  }

  toggle2FA() {
    this.is2FAEnabled = !this.is2FAEnabled;
    // … llamar servicio habilitar/deshabilitar 2FA
  }

  logoutOtherSessions() {
    // Filtrar y cerrar todas que no sean current
    this.sessions = this.sessions.filter(s => s.current);
    // … llamar servicio para invalidar sesiones remotas
  }
}
