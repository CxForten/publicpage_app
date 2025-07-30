import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Plan {
  id: string;
  priceRange: string;
  speed: string;
  capacity: string;
  isPopular?: boolean;
}

@Component({
  selector: 'app-plans',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './plans.component.html',
  styleUrl: './plans.component.css'
})
export class PlansComponent {
  
  plans: Plan[] = [
    {
      id: 'basic',
      priceRange: '$0.50 - $1',
      speed: '2 min',
      capacity: '10 cédulas'
    },
    {
      id: 'standard',
      priceRange: '$1 - $2.99',
      speed: '1 min',
      capacity: '20 cédulas'
    },
    {
      id: 'premium',
      priceRange: '$3 - $4.99',
      speed: '40 seg',
      capacity: '40 cédulas',
      isPopular: true
    },
    {
      id: 'professional',
      priceRange: '$4.99 - $5.99',
      speed: '20 seg',
      capacity: '80 cédulas'
    },
    {
      id: 'enterprise',
      priceRange: '$5.99 - $7.99',
      speed: '10 seg',
      capacity: '160 cédulas'
    },
    {
      id: 'ultimate',
      priceRange: '$7.99 - $9.99',
      speed: '5 seg',
      capacity: '320 cédulas'
    }
  ];

  selectPlan(planId: string) {
    console.log(`Plan seleccionado: ${planId}`);
    // Aquí puedes implementar la lógica para seleccionar el plan
    // Por ejemplo, navegar a la página de pago o mostrar un modal
  }

  showMorePlans() {
    console.log('Mostrando más planes...');
    // Aquí puedes implementar la lógica para mostrar más planes
  }

  trackByPlanId(index: number, plan: Plan): string {
    return plan.id;
  }
}
