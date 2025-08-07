// src/app/public/pages/home/home.component.ts
import { Component, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../../core/header/services/auth.service';
import { PlanSelectionService } from '../../../core/services/plan-selection.service';
import { Observable } from 'rxjs';

// Interfaces para estructurar datos
interface Feature {
  name: string;
  icon: string;
  text: string;
  description: string;
}

interface Plan {
  priceRange: string;
  responseTime: string;
  capacity: string;
}

interface Review {
  author: string;
  rating: number;   // de 1 a 5
  comment: string;
  avatar?: string;  // opcional
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {

  // Observable para el estado de autenticación
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService, private planSelectionService: PlanSelectionService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }

  // Funcionalidad: redirige al formulario de registro
  goRegister(): void {
    this.router.navigate(['auth/register']);
  }

  // Funcionalidad: redirige al panel de control (para usuarios logueados)
  goDashboard(): void {
    this.router.navigate(['/user']);
  }

  // Funcionalidad: redirige a la vista de planes
  selectPlan(): void {
    this.router.navigate(['/plans']);
  }

  // Funcionalidad: selecciona un plan específico y redirige según el estado de autenticación
  selectSpecificPlan(plan: Plan): void {
    // Guardar el plan seleccionado
    this.planSelectionService.setSelectedPlan(plan);
    
    // Verificar si el usuario está logueado
    this.authService.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        // Si está logueado, ir directamente a payment
        this.router.navigate(['/user/payment']);
      } else {
        // Si no está logueado, ir a registro
        this.router.navigate(['/auth/register']);
      }
    }).unsubscribe(); // Desuscribirse inmediatamente para evitar memory leaks
  }

  // Sección de características del sistema
  features: Feature[] = [
    { name: 'SUPA', icon: 'supa.png', text: 'SUPA', description: 'Verifica las demandas alimenticias.' },
    { name: 'SRI', icon: 'SRI.png', text: 'SRI', description: 'Verifica RUC, obligaciones tributarias y estado de impuestos.' },
    { name: 'OFAC', icon: 'OFAC.png', text: 'OFAC', description: 'Sanciones impuestas por el gobierno de EE.UU.' },
    { name: 'INTERPOL', icon: 'Interpol.png', text: 'INTERPOL', description: 'Personas buscadas por la INTERPOL.' },
    { name: 'Ministerio de educación', icon: 'Ministerio.png', text: 'Ministerio de educación', description: 'Verifica título de bachiller.' },
    { name: 'Superintendencia', icon: 'Superintendencia.png', text: 'Superintendencia', description: 'Información de empresas, accionistas y sociedades relacionadas.' },
    { name: 'IESS', icon: 'iess.png', text: 'IESS', description: 'Consulta obligaciones patronales pendientes.' },
    { name: 'Ministerio de interior', icon: 'interior.png', text: 'Ministerio de interior', description: 'Revisa antecedentes penales.' },
    { name: 'Consejo de la Judicatura', icon: 'Consejo.png', text: '', description: 'Consulta demandas registradas.' },
    { name: 'FGE', icon: 'FGE.png', text: '', description: 'Registros de delitos asociados.' },
    { name: 'Senesyt', icon: 'senesyt.png', text: '', description: 'Verificación de títulos de tercer nivel.' }
    // Puedes seguir agregando más…
  ];

  // Sección de planes y precios
  plans: Plan[] = [
    { priceRange: '$0.50 - $1', responseTime: '2 min', capacity: '10 cédulas' },
    { priceRange: '$1 - $2.99', responseTime: '1 min', capacity: '20 cédulas' },
    { priceRange: '$3 - $4.99', responseTime: '40 seg', capacity: '40 cédulas' },
    { priceRange: '$4.99 - $5.99', responseTime: '20 seg', capacity: '80 cédulas' },
    { priceRange: '$5.99 - $7.99', responseTime: '10 seg', capacity: '160 cédulas' },
    { priceRange: '$7.99 - $9.99', responseTime: '5 seg', capacity: '320 cédulas' }
  ];

  // Sección de reseñas
  reviews: Review[] = [
    { author: 'Ana G.', rating: 5, comment: 'Excelente servicio, muy rápido.' },
    { author: 'Luis P.', rating: 4, comment: 'Buena experiencia y atención.' },
    { author: 'María R.', rating: 5, comment: 'Me salvó de un apuro. ¡Gracias!' }
    // Puedes agregar más reseñas si deseas
  ];
}
