import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CalendarComponent } from './Components/calendar/calendar.component';
import { LoginComponent } from './Services/auth/login/login.component';
import { AuthGuard } from './Services/auth/auth-guard';
import { ReservasComponent } from './Components/reservas/reservas.component';
import { CheckInComponent } from './Components/check-in/check-in.component';
import { RegistrocheckinComponent } from './Components/check-in/registrocheckin/registrocheckin.component';
import { CheckOutComponent } from './Components/check-out/check-out.component';
import { RegistrocheckoutComponent } from './Components/check-out/registrocheckout/registrocheckout.component';
import { ConsumosComponent } from './Components/consumos/consumos.component'
import { FormConsumosComponent } from './Components/consumos/form-consumos/form-consumos.component'
import { ProductosComponent } from './Components/productos/productos.component';

const appRoutes: Routes = [
  { path: '', component: LoginComponent },
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
  {
    path:'form-consumos',
    component: FormConsumosComponent,
    canActivate: [AuthGuard],
  },
  {
    path:'productos',
    component: ProductosComponent,
    canActivate: [AuthGuard],
  },
  { path: '**', redirectTo: '/productos' },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
  providers: [AuthGuard],
})
export class AppRoutingModule {}
