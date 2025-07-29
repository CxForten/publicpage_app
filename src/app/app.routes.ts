import { Routes } from '@angular/router';

export const routes: Routes = [
    {
    path: '',
    loadChildren: () =>
      import('./public/public.module').then(m => m.PublicRoutingModule)
  },
];
