import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
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
  constructor(
    private auth: AuthService,
    private router: Router) {
    this.isLoggedIn$ = this.auth.isLoggedIn$;
  }
  logout() {
    this.auth.logout().subscribe();
  }
}
