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
import { DisponibilidadComponent } from './Components/disponibilidad/disponibilidad.component';
import { LoginComponent } from './Services/auth/login/login.component';
import { SignupComponent } from './Services/auth/signup/signup.component';
import { AuthService } from './Services/auth/auth.service';
import { ReservaService } from './Services/evento.service';
import { UIService } from './Shared/ui.service';

import { environment } from 'src/environments/environment';
import { ReservasComponent } from './components/reservas/reservas.component';
import { CheckInComponent } from './Components/check-in/check-in.component';
import { RegistrocheckinComponent } from './Components/registrocheckin/registrocheckin.component';
import { ConsumosComponent } from './Components/consumos/consumos.component'


@NgModule({
  declarations: [
    AppComponent,
    FormReservaComponent,
    CalendarComponent,
    MenuComponent,
    DisponibilidadComponent,
    LoginComponent,
    SignupComponent,
    ReservasComponent,
    CheckInComponent,
    RegistrocheckinComponent,
    ConsumosComponent

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
