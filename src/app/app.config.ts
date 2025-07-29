import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

// import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    // provideRouter(routes) // Commented out because routes are configured in main.ts
  ]
};
