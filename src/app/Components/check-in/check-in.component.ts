import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';
import { Reserva } from 'src/app/Models/reserva.model';
import { ReservaService } from 'src/app/Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-check-in',
  templateUrl: './check-in.component.html',
  styleUrls: ['./check-in.component.scss']
})
export class CheckInComponent implements OnInit {

  eventosMat = new MatTableDataSource<Evento>();
  eventos: Evento[] = [];
  isLoading = false;
  panelOpenState = false;
  isLoadingSubscription: Subscription;
  eventosSubscription: Subscription;

  private sort: MatSort;
  private paginator: MatPaginator;

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
        eventos.sort(function (a) {
          if (a.extendedProps.estado.descripcion != "Pagado Total") return 1;
          else return -1;
        });

        console.log(eventos);

        eventos = eventos.filter(function (evento) {
          var fechaDesde = new Date(evento.extendedProps.fechaDesde);
          var fechaDesdee = fechaDesde.toLocaleDateString();
          
          var fechaActual = new Date().toLocaleDateString();

          if (fechaDesdee >= fechaActual)
            return evento;

        });
        
        this.eventos = eventos;
        console.log(eventos);
      }
    );

    this.reservaService.buscarEventos();
  }

  ngAfterViewInit(): void {
    this.eventosMat.sort = this.sort;
  }

  mostrarDetalleReserva(reserva: Reserva): void {
    console.log(reserva);
  }

}
