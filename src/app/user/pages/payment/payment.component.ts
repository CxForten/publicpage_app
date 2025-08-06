import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.css'
})
export class PaymentComponent {
  
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

  constructor() {}

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
        billing: this.billingData
      });
      
      // Aquí iría la lógica para procesar el pago
      alert('Pago procesado exitosamente!');
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
