import {
  Component,
  OnInit,
  ViewEncapsulation,
  OnDestroy,
  AfterViewChecked,
} from '@angular/core';
import { Subscription } from 'rxjs';

import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';

import { FormReservaComponent } from './form-reserva/form-reserva.component';

import { ReservaService } from '../../Services/evento.service';
import { UIService } from '../../Shared/ui.service';
import { CabanaService } from 'src/app/Services/cabana.service';
import { Cabana } from 'src/app/Models/cabana.model';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  providers: [ReservaService],
  encapsulation: ViewEncapsulation.None,
})
export class CalendarComponent implements OnInit, AfterViewChecked, OnDestroy {
  isLoading = false;
  events = [];
  eventosSubscription: Subscription;
  isLoadingSubscription: Subscription;

  cabanas = [];
  cabanasSubscription: Subscription;

  calendarOptions = {
    plugins: [dayGridPlugin, interactionPlugin],
    initialView: 'dayGridMonth',
    dateClick: this.handleDateClick.bind(this),
    eventClick: this.handleEventClick.bind(this),
    eventDisplay: 'block',
    locale: 'es',
    timeZone: 'local',
    editable: true,
    buttonText: { today: 'Hoy' },
    aspectRatio: 1.2,
    events: this.events,
    eventOrder: 'title',
    displayEventTime: false,
    fixedWeekCount: false,
  };

  constructor(
    public dialog: MatDialog,
    private reservaService: ReservaService,
    private uiService: UIService,
    private cabanasService: CabanaService,
  ) {}

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.cabanasSubscription = this.cabanasService.cabanasChanged.subscribe(
      (cabanas) => {
        cabanas.forEach(x => x.checked = true);
        this.cabanas = cabanas;
      }
    );

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        this.events = eventos;
        this.calendarOptions.events = this.events;
      }
    );

    this.cabanasService.obtenerCabanias();
    this.reservaService.buscarEventos();

  }

  ngAfterViewChecked() {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  handleDateClick(arg) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      isEditing: false,
      fechaDesde: arg.date,
    };

    this.dialog.open(FormReservaComponent, dialogConfig);
  }

  handleEventClick(calEventInfo) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;

    dialogConfig.data = {
      isEditing: true,
      event: calEventInfo.event,
    };

    this.dialog.open(FormReservaComponent, dialogConfig);
  }

  filtrarCabania(event, id) {
    if (id === 0) {
      this.calendarOptions.events = this.events;
    } else {
      this.calendarOptions.events = this.events
        .filter((evento) => evento.extendedProps.cabana.numero === id)
        .slice();
    }
  }

  checkCabania(cabana: Cabana) {

    this.cabanas.forEach(x => x.id == cabana.id ? cabana.checked = !cabana.checked: true);
    
    let cab = this.cabanas.find(x => x.id == cabana.id);
    
    if (cab.checked) {
      this.calendarOptions.events = this.calendarOptions.events.concat(
        this.events
        .filter((event) => event.extendedProps.cabana.numero != cabana.numero)
          .slice()
      );
    } else {
      this.calendarOptions.events = this.calendarOptions.events
        .filter((event) => event.extendedProps.cabana.numero != cabana.numero)
        .slice();
    }
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
    if (this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
    this.reservaService.cancelarSuscripciones();
  }
}
