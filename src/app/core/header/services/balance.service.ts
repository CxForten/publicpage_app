import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { environment } from '../../../../environments/environment';

export interface UserBalance {
  balance: number;
  currency: string;
  lastUpdated: Date;
}

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private balanceSubject = new BehaviorSubject<number>(0);
  public balance$ = this.balanceSubject.asObservable();

  private apiUrl = environment.apiUrl || 'http://localhost:3000/api';

  constructor(private http: HttpClient) {
    // Cargar saldo inicial al inicializar el servicio
    this.loadUserBalance();
  }

  /**
   * Obtiene el token JWT del localStorage
   */
  private getAuthHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  /**
   * Carga el saldo del usuario desde el backend
   */
  loadUserBalance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/user/balance`, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.balanceSubject.next(response.data.balance || 0);
        }
      }),
      catchError((error) => {
        console.error('Error loading user balance:', error);
        // En caso de error, mantener el saldo en 0 o usar localStorage como fallback
        const fallbackBalance = localStorage.getItem('userBalance');
        if (fallbackBalance) {
          this.balanceSubject.next(parseFloat(fallbackBalance));
        }
        throw error;
      })
    );
  }

  /**
   * Actualiza el saldo del usuario (después de una compra/recarga)
   */
  updateBalance(newBalance: number): void {
    this.balanceSubject.next(newBalance);
    // Guardar en localStorage como backup
    localStorage.setItem('userBalance', newBalance.toString());
  }

  /**
   * Obtiene el saldo actual como número
   */
  getCurrentBalance(): number {
    return this.balanceSubject.value;
  }

  /**
   * Recarga saldo (simulación de compra de plan)
   */
  rechargeBalance(amount: number): Observable<any> {
    const body = {
      amount: amount,
      type: 'recharge'
    };

    return this.http.post(`${this.apiUrl}/user/balance/recharge`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.updateBalance(response.data.newBalance);
        }
      }),
      catchError((error) => {
        console.error('Error recharging balance:', error);
        throw error;
      })
    );
  }

  /**
   * Debita saldo (cuando se hace una consulta)
   */
  debitBalance(amount: number): Observable<any> {
    const body = {
      amount: amount,
      type: 'debit'
    };

    return this.http.post(`${this.apiUrl}/user/balance/debit`, body, {
      headers: this.getAuthHeaders()
    }).pipe(
      tap((response: any) => {
        if (response.success && response.data) {
          this.updateBalance(response.data.newBalance);
        }
      }),
      catchError((error) => {
        console.error('Error debiting balance:', error);
        throw error;
      })
    );
  }

  /**
   * Formatea el saldo para mostrar en la UI
   */
  formatBalance(balance: number): string {
    return balance.toFixed(2);
  }
}
