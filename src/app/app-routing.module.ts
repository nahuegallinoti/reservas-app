import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DisponibilidadComponent } from './Components/disponibilidad/disponibilidad.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { LoginComponent } from './Services/auth/login/login.component';
import { AuthGuard } from './Services/auth/auth-guard';
import { ReservasComponent } from './Components/reservas/reservas.component';
import { CheckInComponent } from './Components/check-in/check-in.component';
import { RegistrocheckinComponent } from './Components/registrocheckin/registrocheckin.component';
import { CheckOutComponent } from './Components/check-out/check-out.component';
import { RegistrocheckoutComponent } from './Components/registrocheckout/registrocheckout.component';
import { ConsumosComponent } from './Components/consumos/consumos.component'

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
  {
    path: 'disponibilidad',
    component: DisponibilidadComponent,
    canActivate: [AuthGuard],
  },
  { path: 'login', component: LoginComponent },
  {
    path: 'calendario',
    component: CalendarComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'reservas',
    component: ReservasComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'checkin',
    component: CheckInComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registrocheckin/:reservaId',
    component: RegistrocheckinComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'checkout',
    component: CheckOutComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'registrocheckout/:reservaId',
    component: RegistrocheckoutComponent,
    canActivate: [AuthGuard],
  },
  { 
    path:'consumos',
    component: ConsumosComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/checkout' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
