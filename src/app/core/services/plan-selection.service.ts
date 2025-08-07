import { Injectable } from '@angular/core';

interface Plan {
  priceRange: string;
  responseTime: string;
  capacity: string;
}

@Injectable({
  providedIn: 'root'
})
export class PlanSelectionService {
  private readonly STORAGE_KEY = 'selectedPlan';

  constructor() { }

  // Guardar el plan seleccionado
  setSelectedPlan(plan: Plan): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(plan));
  }

  // Obtener el plan seleccionado
  getSelectedPlan(): Plan | null {
    const storedPlan = localStorage.getItem(this.STORAGE_KEY);
    return storedPlan ? JSON.parse(storedPlan) : null;
  }

  // Limpiar el plan seleccionado (después de completar el pago)
  clearSelectedPlan(): void {
    localStorage.removeItem(this.STORAGE_KEY);
  }

  // Verificar si hay un plan seleccionado
  hasSelectedPlan(): boolean {
    return localStorage.getItem(this.STORAGE_KEY) !== null;
  }
}
