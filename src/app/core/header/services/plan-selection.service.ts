import { Injectable } from '@angular/core';

interface Plan {
  priceRange: string;
  responseTime: string;
  capacity: string;
}

interface PlanSelection {
  plan: Plan;
  timestamp: number;
  fromCurrentSession: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PlanSelectionService {
  private readonly STORAGE_KEY = 'selectedPlan';
  private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutos
  private currentSessionFlag = false;

  constructor() { }

  // Guardar el plan seleccionado con timestamp y flag de sesión actual
  setSelectedPlan(plan: Plan): void {
    const selection: PlanSelection = {
      plan,
      timestamp: Date.now(),
      fromCurrentSession: true
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(selection));
    this.currentSessionFlag = true;
  }

  // Obtener el plan seleccionado solo si es válido y reciente
  getSelectedPlan(): Plan | null {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) return null;

    try {
      const selection: PlanSelection = JSON.parse(storedData);
      const now = Date.now();
      const isRecent = (now - selection.timestamp) < this.SESSION_DURATION;
      
      // Solo devolver el plan si es reciente Y fue seleccionado en esta sesión
      if (isRecent && selection.fromCurrentSession && this.currentSessionFlag) {
        return selection.plan;
      } else {
        // Si no es válido, limpiarlo
        this.clearSelectedPlan();
        return null;
      }
    } catch (error) {
      console.error('Error parsing stored plan:', error);
      this.clearSelectedPlan();
      return null;
    }
  }

  // Limpiar el plan seleccionado
  clearSelectedPlan(): void {
    localStorage.removeItem(this.STORAGE_KEY);
    this.currentSessionFlag = false;
  }

  // Verificar si hay un plan seleccionado válido
  hasSelectedPlan(): boolean {
    return this.getSelectedPlan() !== null;
  }

  // Método para limpiar datos residuales al iniciar la aplicación
  cleanupOldSelections(): void {
    const storedData = localStorage.getItem(this.STORAGE_KEY);
    if (!storedData) return;

    try {
      const selection: PlanSelection = JSON.parse(storedData);
      const now = Date.now();
      const isExpired = (now - selection.timestamp) >= this.SESSION_DURATION;
      
      if (isExpired) {
        this.clearSelectedPlan();
      }
    } catch (error) {
      this.clearSelectedPlan();
    }
  }
}
