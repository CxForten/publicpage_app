import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PlanSelectionService } from '../../../core/services/plan-selection.service';
import { Router } from '@angular/router';

interface Plan {
  priceRange: string;
  responseTime: string;
  capacity: string;
}

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent implements OnInit {
  
  // Plan seleccionado
  selectedPlan: Plan | null = null;
  
  // Datos del formulario de tarjeta
  cardData = {
    cardType: 'visa',
    cardNumber: '',
    expiryDate: '',
    cvv: ''
  };

  // Datos del formulario de facturación
  billingData = {
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    phone: '',
    saveInfo: false
  };

  constructor(private planSelectionService: PlanSelectionService, private router: Router) {}

  ngOnInit(): void {
    // Obtener el plan seleccionado al cargar el componente
    this.selectedPlan = this.planSelectionService.getSelectedPlan();
    
    // Si no hay plan seleccionado, redirigir al home
    if (!this.selectedPlan) {
      console.log('No hay plan seleccionado, redirigiendo al home');
      this.router.navigate(['/']);
    }
  }

  // Formatear número de tarjeta
  formatCardNumber(event: any) {
    let value = event.target.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      event.target.value = parts.join(' ');
      this.cardData.cardNumber = parts.join(' ');
    } else {
      event.target.value = value;
      this.cardData.cardNumber = value;
    }
  }

  // Formatear fecha de expiración
  formatExpiryDate(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    event.target.value = value;
    this.cardData.expiryDate = value;
  }

  // Formatear CVV
  formatCVV(event: any) {
    let value = event.target.value.replace(/\D/g, '');
    event.target.value = value;
    this.cardData.cvv = value;
  }

  // Procesar el pago
  onSubmit() {
    if (this.isFormValid()) {
      console.log('Procesando pago...', {
        card: this.cardData,
        billing: this.billingData,
        selectedPlan: this.selectedPlan
      });
      
      // Aquí iría la lógica para procesar el pago
      alert('Pago procesado exitosamente!');
      
      // Limpiar el plan seleccionado después del pago exitoso
      this.planSelectionService.clearSelectedPlan();
      
      // Redirigir al dashboard
      this.router.navigate(['/user']);
    } else {
      alert('Por favor, complete todos los campos requeridos.');
    }
  }

  // Validar formulario
  private isFormValid(): boolean {
    return !!(
      this.cardData.cardNumber &&
      this.cardData.expiryDate &&
      this.cardData.cvv &&
      this.billingData.firstName &&
      this.billingData.lastName &&
      this.billingData.address &&
      this.billingData.city &&
      this.billingData.phone
    );
  }
}
