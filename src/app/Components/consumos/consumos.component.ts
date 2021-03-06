import { Component, OnInit} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormConsumosComponent } from './form-consumos/form-consumos.component';
import { ReservaService } from 'src/app/Services/evento.service';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';


@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.css']
})

export class ConsumosComponent implements OnInit{

  eventosSubscription: Subscription;
  eventos: Evento[] = [];
  panelOpenState = false;

  constructor(private dialog: MatDialog,
              private reservaService: ReservaService){

  }

  ngOnInit(): void {
    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {

        eventos = eventos.filter(function (evento) {
          var fechaDesde = new Date(evento.extendedProps.fechaDesde);
          var fechaHasta = new Date(evento.extendedProps.fechaHasta);
          var fechaActual = new Date();
          
          fechaDesde.setDate(fechaDesde.getDate() - 1);

          if (fechaHasta >= fechaActual && fechaDesde <= fechaActual && evento.extendedProps.realizoCheckIn && !evento.extendedProps.realizoCheckOut) {
            return evento;
          }
        });

        this.eventos = eventos;
      }
    );

    this.reservaService.buscarEventos();
  }
  
  openDialog(evento: Evento): void {
    const dialogRef = this.dialog.open(FormConsumosComponent, {
      width: "30vw",
      height:"35vw",
      data: {reserva: evento}
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  displayedColumns: string[] = ['descripcion', 'monto', 'cabana','fecha'];
}
