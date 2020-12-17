import { Component, OnInit} from '@angular/core';
import { Consumos } from 'src/app/Models/consumos.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { FormConsumosComponent } from './form-consumos/form-consumos.component';
import { ReservaService } from 'src/app/Services/evento.service';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';


export interface fakeData {
  descripcion: string;
  monto: number;
  cabana: string;
  fecha: Date
}

const DATA: fakeData[] = [
  {descripcion: 'FrigoBar', monto: 1234, cabana: 'azul', fecha: new Date()},
  {descripcion: 'Limpieza', monto: 789, cabana: 'blanca', fecha: new Date()},
  {descripcion: 'Cartas', monto: 654, cabana: 'verde', fecha: new Date()},
];

@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.css']
})

export class ConsumosComponent implements OnInit{

  animal: string;
  name: string;
  eventosSubscription: Subscription;
  eventos: Evento[] = [];
  panelOpenState = false;

  constructor(private dialog: MatDialog,
              private reservaService: ReservaService,){

  }

  ngOnInit(): void {
    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        eventos.sort(function (a) {
          if (a.extendedProps.estado.descripcion != "Pagado Total") return 1;
          else return -1;
        });

        eventos = eventos.filter(function (evento) {
          var fechaDesde = new Date(evento.extendedProps.fechaDesde);
          var fechaHasta = new Date(evento.extendedProps.fechaHasta);
          var fechaActual = new Date();
          
          if (fechaHasta >= fechaActual && fechaDesde <= fechaActual) {
            return evento;
          }
        });

        this.eventos = eventos;
        console.log(eventos);
      }
    );

    this.reservaService.buscarEventos();
  }
  
  openDialog(): void {
    const dialogRef = this.dialog.open(FormConsumosComponent, {
      width: '250px',
      data: {name: this.name, animal: this.animal}
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.animal = result;
      console.log(result);
    });
  }

  displayedColumns: string[] = ['descripcion', 'monto', 'cabana','fecha'];
  dataSource = DATA;
}
