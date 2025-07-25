import { Router } from '@angular/router';
// src/app/public/pages/home/home.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  name: string;
  icon: string;
  text: string;
  description: string; // opcional, para una descripción más detallada
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
  avatar?: string;  // opcional, nombre de asset img
}

@Component({
  standalone: true,
  imports: [ CommonModule ],
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  constructor(private router: Router) {}

  features: Feature[] = [
    { name: 'SUPA',  icon: 'supa.png',   text: 'SUPA', description: 'Verifica las demandas alimenticias.' },
    { name: 'SRI',   icon: 'SRI.png',    text: 'SRI', description: 'Se verifica si el usuario tiene RUC activo, obligaciones tributarias pendientes y si está al día con el impuesto a la renta y salida de divisas.'  },
    { name: 'OFAC', icon: 'OFAC.png', text: 'OFAC', description: 'Sanciones del gobierno de EEUU' },
    { name: 'INTERPOL', icon: 'Interpol.png', text: 'INTERPOL', description: 'Lista de búsqueda de la INTERPOL' },
    { name: 'Ministerio de educacion', icon: 'Ministerio.png', text: 'Ministerio de educacion', description: 'Título de bachiller' },
    { name: 'Superintendencia ',  icon: 'Superintendencia.png',   text: 'Superintendencia', description: 'Se obtiene información general de la empresa, accionistas actuales y anteriores, beneficiarios, sociedades y extranjeros relacionados.' },
    { name: 'IESS',   icon: 'iess.png',    text: 'IESS', description: 'Olbigaciones patronales pendientes' },
    { name: 'Ministerio de interior', icon: 'interior.png', text:'Ministerio de interior', description: 'Antecedentes penales' },
    { name: 'Consejo de la Judicatura', icon: 'Consejo.png', text: '', description: 'Demandas registradas' },
    { name: 'FGE', icon: 'FGE.png', text: '', description: 'Registro de delitos' },
    { name: 'Senesyt',   icon: 'senesyt.png',    text: '', description: 'Títulos de tercer nivel' },

    // añade más según tu diseño…
  ];

   plans: Plan[] = [
    { priceRange: '$0.50 - $1',    responseTime: '2 min',  capacity: '10 cédulas'  },
    { priceRange: '$1 - $2.99',     responseTime: '1 min',  capacity: '20 cédulas'  },
    { priceRange: '$3 - $4.99',     responseTime: '40 seg', capacity: '40 cédulas'  },
    { priceRange: '$4.99 - $5.99',  responseTime: '20 seg', capacity: '80 cédulas'  },
    { priceRange: '$5.99 - $7.99',  responseTime: '10 seg', capacity: '160 cédulas' },
    { priceRange: '$7.99 - $9.99',  responseTime: '5 seg',  capacity: '320 cédulas' }
  ];
reviews: Review[] = [
     { author: 'Ana G.', rating: 5, comment: 'Excelente servicio, muy rápido.' },
     { author: 'Luis P.', rating: 4, comment: 'Buena experiencia y atención.' },
     { author: 'María R.', rating: 5, comment: 'Me salvó de un apuro. ¡Gracias!' },
     // … más reseñas …
   ];

   goRegister() {
    this.router.navigate(['auth/register']) // Lógica para redirigir a la página de registro
   }

    selectPlan() {

      this.router.navigate(['/plans']);
    }
}