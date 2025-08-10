import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) { }

  requestPasswordReset(email: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/request-password-reset`, {
      correo: email
    });
  }

  validateResetToken(token: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/validate-reset-token/${token}`);
  }

  resetPassword(token: string, newPassword: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/reset-password`, {
      token: token,
      nueva_contraseña: newPassword
    });
  }
}
