import { HttpClient } from '@angular/common/http';
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, tap, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.loggedIn.asObservable();

  constructor(private http: HttpClient) {
    const token = localStorage.getItem('token');
    // Verificar si el token existe y es válido
    if (token && token.trim() !== '') {
      this.loggedIn.next(true);
    } else {
      // Si no hay token válido, asegurar que el estado sea false
      this.loggedIn.next(false);
      localStorage.removeItem('token'); // Limpiar cualquier token inválido
    }
  }

  login(data: { cedula: string; contraseña: string }): Observable<any> {
    return this.http.post('http://localhost:3000/api/auth/login', data).pipe(
      tap((res: any) => {
        if (res.token) {
          localStorage.setItem('token', res.token);
          this.loggedIn.next(true);
        }
      })
    );
  }

  logout(): Observable<void> {
    // Limpiar inmediatamente el token y estado
    localStorage.removeItem('token');
    this.loggedIn.next(false);
    
    // Forzar recarga de la página para limpiar completamente el estado
    setTimeout(() => {
      window.location.href = '/';
    }, 100);
    
    return of();
  }
}
