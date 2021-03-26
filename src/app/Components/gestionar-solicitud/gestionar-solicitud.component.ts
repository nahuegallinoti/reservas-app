import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Cabana } from 'src/app/Models/cabana.model';
import { CabanaService } from 'src/app/Services/cabana.service';
import { Evento } from 'src/app/Models/evento.model';
import { ReservaService } from 'src/app/Services/evento.service';
import * as moment from 'moment';
import { Reserva } from 'src/app/Models/reserva.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { Estado } from 'src/app/Models/estado.model';
import { Cliente } from 'src/app/Models/cliente.model';

export interface DialogDataSolicitudReserva {
  solicitudReserva: Reserva;
}

@Component({
  selector: 'app-gestionar-solicitud',
  templateUrl: './gestionar-solicitud.component.html',
  styleUrls: ['./gestionar-solicitud.component.scss'],
})
export class GestionarSolicitudComponent implements OnInit {

  solicitudReserva: Reserva;
  cabanaSelected: Cabana;
  strCabanaSelected: string;
  cabanas: Cabana[] = [];
  eventosCabanasActuales: Evento[] = [];
  cabanasSubscription: Subscription;
  eventos: Evento[] = [];
  eventosSubscription: Subscription;
  estados: Estado[] = [];
  estadosSubscription: Subscription;
  total: number = 0;
  esAceptada: boolean = false;

  constructor(private _cabanaService: CabanaService,
    private _reservaService: ReservaService,
    private _estadoService: EstadoService,
    public dialogRef: MatDialogRef<GestionarSolicitudComponent>,

    @Inject(MAT_DIALOG_DATA) public data: DialogDataSolicitudReserva) { }

  ngOnInit(): void {

    if (this.data?.solicitudReserva != null) {
      this.solicitudReserva = this.data.solicitudReserva;

    }

    this.eventosSubscription = this._reservaService.eventosChanged.subscribe(
      (eventos) => {

        var fechaDesde = this.solicitudReserva.fechaDesde;

        this.eventos = eventos;

        this.eventosCabanasActuales = this.eventos.filter(x => moment(fechaDesde).
          isBetween(x.start, x.end, null, "[]"));

      }
    );


    this.cabanasSubscription = this._cabanaService.cabanasChanged.subscribe(
      (cabanas) => {
        var cabanasOcupadas = cabanas.filter(cabana => this.eventosCabanasActuales.some(x => x.extendedProps.cabana.id == cabana.id));
        cabanas = cabanas.filter(item => !cabanasOcupadas.includes(item));
        cabanas = cabanas.filter(item => item.capacidad >= this.solicitudReserva.cantOcupantes);

        this.cabanas = cabanas;
        this.cabanaSelected = cabanas[0];
        this.strCabanaSelected = this.cabanaSelected.nombre;
        this.calcularSubTotal();

      }
    )

    this.estadosSubscription = this._estadoService.estadosChanged.subscribe(
      (estados) => {
        this.estados = estados;
      }
    )

    this._reservaService.buscarEventos();
    this._cabanaService.obtenerCabanias();
    this._estadoService.buscarEstados();

  }

  selectCabana() {

    this.cabanaSelected = this.cabanas.find(x => x.nombre == this.strCabanaSelected);
    this.calcularSubTotal();

  }

  calcularSubTotal() {
    const fechaDesde = moment(this.solicitudReserva.fechaDesde);
    const fechaHasta = moment(this.solicitudReserva.fechaHasta);

    const cantDias = fechaHasta.diff(fechaDesde, 'days') + 1;

    //TODO aqui se deberia sumar la tarifa fija segun epoca del año en ves de 1500
    this.total = 1500 * this.solicitudReserva.cantOcupantes * cantDias + this.cabanaSelected.precioDia;

  }

  guardarEvento() {
    
    this.actualizarDatosReserva();
    const evento = this.crearEvento();

    this._reservaService.guardarReserva(evento);
    this.dialogRef.close({data: true});

  }

  actualizarDatosReserva() {

    this.solicitudReserva.cabana = this.cabanaSelected;
    this.solicitudReserva.montoTotal = this.total;
    this.solicitudReserva.estado = this.estados.find(x => x.descripcion.toLowerCase() == "solicitud aceptada");

  }

  crearEvento(): Evento {

    const titulo = this.cabanaSelected.nombre + ' - ' + this.solicitudReserva.cliente.apellidos + ' ' + this.solicitudReserva.cliente.nombre
    const fechaDesde = this.solicitudReserva.fechaDesde;

    const fechaHasta = this.solicitudReserva.fechaHasta;
    this.solicitudReserva.montoTotal = this.total;

    const evento: Evento = {
      title: titulo,
      start: fechaDesde,
      end: fechaHasta,
      extendedProps: this.solicitudReserva,
      backgroundColor: "#EC7063",
    };

    return evento;
  }

  close() {
    this.dialogRef.close();
  }

}
