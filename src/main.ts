import { bootstrapApplication } from '@angular/platform-browser';
// import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { PreloadAllModules, provideRouter, withPreloading } from '@angular/router';
import { HomeComponent } from './app/public/pages/home/home.component';
import { SupportComponent } from './app/public/pages/support/support.component';
import { provideHttpClient } from '@angular/common/http';
import { LoginComponent } from './app/auth/pages/login/login.component';
import { RegisterComponent } from './app/auth/pages/register/register.component';
import { DashboardComponent } from './app/user/pages/dashboard/dashboard.component';
import { PlansComponent } from './app/user/pages/plans/plans.component';
import { PaymentComponent } from './app/user/pages/payment/payment.component';
import { SettingsComponent } from './app/user/pages/settings/settings.component';
import { ProfileComponent } from './app/user/pages/profile/profile.component';
import { NoAuthGuard } from './app/core/header/guards/noauth.guard';
import { AuthGuard } from './app/core/header/guards/auth.guard';
import { provideAnimations } from '@angular/platform-browser/animations';



bootstrapApplication(AppComponent,{
 providers: [
  provideAnimations(),
  provideHttpClient(),
  provideRouter(
    [
      //Rutas publicas
        { path: '',       component: HomeComponent },
        { path: 'support',component: SupportComponent },
        {path: 'plans', component: PlansComponent},

      //Rutas Auth
      {path:'auth', children:[
        {path: 'login', component: LoginComponent, canActivate: [NoAuthGuard]},
        {path: 'register', component: RegisterComponent, canActivate: [NoAuthGuard]}
      ]},

      //Zona protegida
      { path: 'user', canActivate: [AuthGuard], children: [
        {path: '', component: DashboardComponent},
        {path: 'payment', component: PaymentComponent},
        {path:'settings', component: SettingsComponent},
        {path:'profile', component: ProfileComponent}
      ]
    },
    { path: '**', redirectTo: '' }
  ],
   withPreloading(PreloadAllModules)
  )
 ]
})
  .catch((err) => console.error(err));
