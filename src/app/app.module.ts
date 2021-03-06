import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';

import { FlexLayoutModule } from '@angular/flex-layout';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FullCalendarModule } from '@fullcalendar/angular';

import { AppRoutingModule } from './app-routing.module';
import { MaterialModule } from './material.module';
import { AppComponent } from './app.component';
import { FormReservaComponent } from './Components/calendar/form-reserva/form-reserva.component';
import { CalendarComponent } from './Components/calendar/calendar.component';
import { MenuComponent } from './Components/menu/menu.component';
import { LoginComponent } from './Services/auth/login/login.component';
import { SignupComponent } from './Services/auth/signup/signup.component';
import { AuthService } from './Services/auth/auth.service';
import { ReservaService } from './Services/evento.service';
import { UIService } from './Shared/ui.service';

import { environment } from 'src/environments/environment';
import { ReservasComponent } from './Components/reservas/reservas.component';
import { CheckInComponent } from './Components/check-in/check-in.component';
import { RegistrocheckinComponent } from './Components/check-in/registrocheckin/registrocheckin.component';
import { CheckOutComponent } from './Components/check-out/check-out.component';
import { RegistrocheckoutComponent } from './Components/check-out/registrocheckout/registrocheckout.component';
import { ConsumosComponent } from './Components/consumos/consumos.component'
import { FormConsumosComponent } from './Components/consumos/form-consumos/form-consumos.component';
import { ProductosComponent } from './Components/productos/productos.component';
import { FormProductosComponent } from './Components/productos/form-productos/form-productos.component';
import { DetalleCheckInComponent } from './Components/check-in/detalle-check-in/detalle-check-in.component';
import { CabanasComponent } from './Components/cabanas/cabanas.component';
import { FormCabanasComponent } from './Components/cabanas/form-cabanas/form-cabanas.component';
import { ConfirmationDialogComponent } from './Components/Shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { SolicitudesReservaComponent } from './Components/solicitudes-reserva/solicitudes-reserva.component';
import { GestionarSolicitudComponent } from './Components/gestionar-solicitud/gestionar-solicitud.component'
import { ChartsModule } from 'ng2-charts';
import { DashboardComponent } from './Components/dashboard/dashboard.component';
import { TarifaComponent } from './Components/tarifa/tarifa.component';
import { FormTarifasComponent } from './Components/tarifa/form-tarifas/form-tarifas.component';

@NgModule({
  declarations: [
    AppComponent,
    FormReservaComponent,
    CalendarComponent,
    MenuComponent,
    LoginComponent,
    SignupComponent,
    ReservasComponent,
    CheckInComponent,
    RegistrocheckinComponent,
    CheckOutComponent,
    RegistrocheckoutComponent,
    ConsumosComponent,
    FormConsumosComponent,
    ProductosComponent,
    FormProductosComponent,
    DetalleCheckInComponent,
    CabanasComponent,
    FormCabanasComponent,
    ConfirmationDialogComponent,
    SolicitudesReservaComponent,
    GestionarSolicitudComponent,
    DashboardComponent,
    TarifaComponent,
    FormTarifasComponent,

  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FullCalendarModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
    FlexLayoutModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule,
    AngularFireAuthModule,
    ChartsModule,
  ],
  exports: [],
  providers: [
    AuthService,
    ReservaService,
    { provide: LOCALE_ID, useValue: 'en-GB' },
    UIService,
  ],
  bootstrap: [AppComponent],
  entryComponents: [FormReservaComponent],
})
export class AppModule {}
