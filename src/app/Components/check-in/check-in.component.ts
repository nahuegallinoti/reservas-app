import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';
import { Reserva } from 'src/app/Models/reserva.model';
import { ReservaService } from 'src/app/Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import * as moment from 'moment';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {

  eventos: Evento[] = [];
  isLoading = false;
  panelOpenState = false;
  isLoadingSubscription: Subscription;
  eventosSubscription: Subscription;

  constructor(
    private reservaService: ReservaService,
    private uiService: UIService,
  ) { }

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {

        eventos = eventos.filter(function (evento) {

          var fechaDesde = new Date(evento.extendedProps.fechaDesde);
          var fechaHasta = new Date(evento.extendedProps.fechaHasta);

          var fechaActual = new Date();

          fechaDesde.setDate(fechaDesde.getDate() - 1);

          if (moment(fechaActual).isBetween(fechaDesde, fechaHasta))
            return evento;

        });

        this.eventos = eventos;
      }
    );

    this.reservaService.buscarEventos();
  }

}
