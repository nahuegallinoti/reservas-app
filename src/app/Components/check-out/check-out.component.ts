import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';
import { ReservaService } from 'src/app/Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import * as moment from 'moment';

@Component({
  selector: 'app-check-out',
  templateUrl: './check-out.component.html',
  styleUrls: ['./check-out.component.scss']
})
export class CheckOutComponent implements OnInit {

  eventosMat = new MatTableDataSource<Evento>();
  isLoadingSubscription: Subscription;
  eventosSubscription: Subscription;
  eventos: Evento[] = [];
  isLoading = false;
  panelOpenState = false;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.eventosMat.sort = this.sort;
    this.eventosMat.paginator = this.paginator;
  }


  constructor(private reservaService: ReservaService,
    private uiService: UIService) { }

    private sort: MatSort;
    private paginator: MatPaginator;
  
    
  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        eventos.sort(function (a) {
          if (a.extendedProps.estado.descripcion != "Pagado Total") return 1;
          else return -1;
        });

        eventos = eventos.filter(function (evento) {

          if (!evento.extendedProps.realizoCheckIn)
            return;

          var fechaDesde = new Date(evento.extendedProps.fechaDesde);
          var fechaDesdee = fechaDesde.toLocaleDateString();
          var fechaHasta = new Date(evento.extendedProps.fechaHasta);
          var fechaHastaa = fechaHasta.toLocaleDateString();

          var fechaActual = new Date();

          if (moment(fechaActual).isBetween(fechaDesde, fechaHasta))
          {
            
            return evento;
          }

        });

        this.eventos = eventos;
      }
    );

    this.reservaService.buscarEventos();
  }

  ngAfterViewInit(): void {
    this.eventosMat.sort = this.sort;
  }

}