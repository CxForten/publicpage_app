import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  isLoggedIn$: Observable<boolean>;
  menuOpen: boolean = false; 
  currentUrl$: Observable<string>;

  constructor(
    private auth: AuthService,
    private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
    
    // Observable para detectar cambios de ruta
    this.currentUrl$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      map(event => (event as NavigationEnd).url)
    );
  }

  // Método para verificar si una ruta está activa
  isActiveRoute(route: string): boolean {
    return this.router.url === route || (route !== '/' && this.router.url.startsWith(route));
  }

  logout() {
    this.auth.logout().subscribe();
  }
}
