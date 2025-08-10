import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/header/services/auth.service';
import { PlanSelectionService } from '../../../core/header/services/plan-selection.service';
import { Observable } from 'rxjs';

interface Plan {
  id: string;
  priceRange: string;
  responseTime: string; // Cambiado de 'speed' a 'responseTime' para coincidir con home
  capacity: string;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {
  
  // Observable para el estado de autenticación
  isLoggedIn$: Observable<boolean>;

  constructor(private router: Router, private authService: AuthService, private planSelectionService: PlanSelectionService) {
    this.isLoggedIn$ = this.authService.isLoggedIn$;
  }
  
  plans: Plan[] = [
    {
      id: 'basic',
      priceRange: '$0.50 - $1',
      responseTime: '2 min',
      capacity: '10 cédulas'
    },
    {
      id: 'standard',
      priceRange: '$1 - $2.99',
      responseTime: '1 min',
      capacity: '20 cédulas'
    },
    {
      id: 'premium',
      priceRange: '$3 - $4.99',
      responseTime: '40 seg',
      capacity: '40 cédulas'
    },
    {
      id: 'professional',
      priceRange: '$4.99 - $5.99',
      responseTime: '20 seg',
      capacity: '80 cédulas'
    },
    {
      id: 'enterprise',
      priceRange: '$5.99 - $7.99',
      responseTime: '10 seg',
      capacity: '160 cédulas'
    },
    {
      id: 'ultimate',
      priceRange: '$7.99 - $9.99',
      responseTime: '5 seg',
      capacity: '320 cédulas'
    }
  ];

  // Funcionalidad: selecciona un plan específico y redirige según el estado de autenticación
  selectSpecificPlan(plan: Plan): void {
    // Crear el objeto plan sin el ID para que coincida con la interfaz del servicio
    const planForSelection = {
      priceRange: plan.priceRange,
      responseTime: plan.responseTime,
      capacity: plan.capacity
    };
    
    // Guardar el plan seleccionado
    this.planSelectionService.setSelectedPlan(planForSelection);
    
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

  selectPlan(planId: string) {
    // Buscar el plan por ID y usar selectSpecificPlan
    const plan = this.plans.find(p => p.id === planId);
    if (plan) {
      this.selectSpecificPlan(plan);
    }
  }

  showMorePlans() {
    console.log('Mostrando más planes...');
    // Podrías implementar lógica para mostrar planes adicionales o redirigir a una página de contacto
    // Por ahora, simplemente mostrar una alerta
    alert('¿Necesitas un plan personalizado? Contáctanos para opciones empresariales.');
  }

  trackByPlanId(index: number, plan: Plan): string {
    return plan.id;
  }
}
