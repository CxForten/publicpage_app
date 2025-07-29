import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, isPlatformBrowser } from '@angular/common';

interface Preference {
  id: string;
  name: string;
  description: string;
  selected: boolean;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  consultaForm: FormGroup;
  showPreferencesModal = false;
  
  preferences: Preference[] = [
    {
      id: 'supa',
      name: 'SUPA y Obligaciones de Personas Naturales',
      description: 'Se verifica si la persona tiene demandas alimenticias.',
      selected: true
    },
    {
      id: 'sri-consulta-renta',
      name: 'SRI - Consulta a la Renta (con usuario)',
      description: 'Se consulta si el usuario posee obligaciones relacionadas con el impuesto a la renta (año fiscal, impuesto a la renta, impuesto a la salida de divisas).',
      selected: true
    },
    {
      id: 'ofac',
      name: 'OFAC (Oficina de Control de Activos Extranjeros)',
      description: 'Se verifica si la persona figura en la lista de sanciones del gobierno de los Estados Unidos.',
      selected: true
    },
    {
      id: 'interpol',
      name: 'Interpol',
      description: 'Se verifica si la persona está en la lista de búsqueda de Interpol.',
      selected: true
    },
    {
      id: 'ministerio-educacion',
      name: 'Ministerio de Educación',
      description: 'Se obtiene información sobre el título de bachiller.',
      selected: false
    },
    {
      id: 'supercias',
      name: 'Supercias',
      description: 'Se obtiene información general de la empresa, accionistas actuales y anteriores, beneficiarios, sociedades y extranjeros relacionados.',
      selected: false
    },
    {
      id: 'sri-consultar-ruc',
      name: 'SRI - Consultar RUC',
      description: 'Se valida si el RUC se encuentra activo.',
      selected: false
    },
    {
      id: 'ministerio-interior',
      name: 'Ministerio del Interior',
      description: 'Se consulta si la persona tiene antecedentes penales.',
      selected: false
    },
    {
      id: 'consejo-judicatura',
      name: 'Consejo de la Judicatura',
      description: 'Se obtiene información sobre demandas registradas.',
      selected: false
    },
    {
      id: 'fiscalia-general',
      name: 'Fiscalía General del Estado',
      description: 'Se consulta si la persona registra delitos.',
      selected: false
    },
    {
      id: 'senescyt',
      name: 'Senescyt',
      description: 'Se obtiene información sobre títulos de tercer nivel registrados.',
      selected: false
    },
    {
      id: 'sri-obligaciones-firme',
      name: 'SRI - Obligaciones en Firme',
      description: 'Se verifica si la persona tiene obligaciones tributarias en firme.',
      selected: false
    },
    {
      id: 'sri-estado-tributario',
      name: 'SRI - Estado Tributario',
      description: 'Se valida si la persona está al día en sus obligaciones tributarias.',
      selected: false
    },
    {
      id: 'iess-obligaciones',
      name: 'IESS - Obligaciones Patronales Pendientes',
      description: 'Se consulta si existen obligaciones patronales pendientes.',
      selected: false
    }
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.consultaForm = this.fb.group({
      cedula: ['']
    });
  }

  ngOnInit() {
    this.appleMobileCenteringFix();
  }

  private appleMobileCenteringFix() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => {
        const style = document.createElement('style');
        style.textContent = `
          @media (max-width: 768px) {
            .dashboard-container .section-wrapper:first-child .card {
              text-align: center !important;
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
            }
            
            .dashboard-container .section-wrapper:first-child .saldo-display {
              display: flex !important;
              flex-direction: column !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              width: 100% !important;
            }
            
            .dashboard-container .section-wrapper:first-child .saldo-amount {
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
              width: 100% !important;
            }
            
            .dashboard-container .section-wrapper:first-child .btn-add-saldo {
              width: 100% !important;
              display: flex !important;
              align-items: center !important;
              justify-content: center !important;
              text-align: center !important;
            }
          }
        `;
        document.head.appendChild(style);
      }, 100);
    }
  }

  consultar() {
    console.log(this.consultaForm.value);
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    console.log('Archivo seleccionado:', file);
  }

  openPreferencesModal() {
    this.showPreferencesModal = true;
    document.body.style.overflow = 'hidden';
  }

  closePreferencesModal() {
    this.showPreferencesModal = false;
    document.body.style.overflow = 'auto';
  }

  togglePreference(preference: Preference) {
    preference.selected = !preference.selected;
  }

  savePreferences() {
    console.log('Preferencias guardadas:', this.preferences.filter(p => p.selected));
    this.closePreferencesModal();
    // Aquí podrías implementar la lógica para guardar las preferencias en el backend
  }
}

