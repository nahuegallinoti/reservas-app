import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Estado } from 'src/app/Models/estado.model';
import { EmailService } from 'src/app/Services/email.service';
import { EstadoService } from 'src/app/Services/estado.service';
import { SolicitudReservaService } from 'src/app/Services/solicitud-reserva.service';
import { UIService } from 'src/app/Shared/ui.service';
import { GestionarSolicitudComponent } from '../gestionar-solicitud/gestionar-solicitud.component';
import * as moment from 'moment';
import { ReservaService } from 'src/app/Services/evento.service';
import { Evento } from 'src/app/Models/evento.model';
import { Reserva } from 'src/app/Models/reserva.model';

@Component({
  selector: 'app-solicitudes-reserva',
  templateUrl: './solicitudes-reserva.component.html',
  styleUrls: ['./solicitudes-reserva.component.scss']
})

export class SolicitudesReservaComponent implements OnInit {

  solicitudesReserva: Reserva[] = [];
  isLoading = false;
  isLoadingSubscription: Subscription;
  solicitudesReservaSubscription: Subscription;
  estados: Estado[] = [];
  estadosSubscription: Subscription;
  eventos: Evento[] = [];
  eventosSubscription: Subscription;
  estadoActualSolicitud: Estado;
  panelOpenState = false;
  estadoCancelado: Estado;

  constructor(
    private _solicituReservaService: SolicitudReservaService,
    private uiService: UIService,
    private dialog: MatDialog,
    private _estadoService: EstadoService,
    private _emailService: EmailService,
    private _reservaService: ReservaService
  ) { }

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.solicitudesReservaSubscription = this._solicituReservaService.solicitudReservaChanged.subscribe(
      (solicitudesReserva) => {
        this.solicitudesReserva = solicitudesReserva;
        this.solicitudesReserva.map(solicitud => solicitud.disabled = true);
        this.solicitudesReserva.map(solicitud => solicitud.estado.descripcion.toLocaleLowerCase() == "solicitud aceptada" ? true : false);
      }
    );

    this.estadosSubscription = this._estadoService.estadosChanged.subscribe(
      (estados) => {
        this.estadoCancelado = estados.find(x => x.descripcion.toLowerCase() == "cancelado");
        this.estados = estados;
      }
    )
    this.eventosSubscription = this._reservaService.eventosChanged.subscribe(
      (eventos) => {
        this.eventos = eventos;
      }
    );

    this._solicituReservaService.obtenerReservas();
    this._estadoService.buscarEstados();
    this._reservaService.buscarEventos();


  }

  openDialogSeleccionarCabana(solicitudReserva: Reserva): void {
    const dialogRef = this.dialog.open(GestionarSolicitudComponent, {
      width: "25vw",
      height: "18vw",
      data: {
        solicitudReserva: solicitudReserva,
      }

    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response) {
        console.log(response);
        this.guardarDatosSolicitud(solicitudReserva);
        this.solicitudesReserva.map(x => x.disabled = true);

      }
    });
  }

  formatMoney = (n) => {
    return "$ " + (Math.round(n * 100) / 100).toLocaleString();
  }

  actualizarSolicitud(solicitudReserva: Reserva) {

    if (solicitudReserva != undefined && solicitudReserva.estado.descripcion.toLowerCase() == "solicitud aceptada") {
      this.openDialogSeleccionarCabana(solicitudReserva);


    }

    else {
      this.guardarDatosSolicitud(solicitudReserva);
      this.solicitudesReserva.map(x => x.disabled = true);

    }

  }

  guardarDatosSolicitud(solicitudReserva: Reserva) {
    let fechaVencimiento = moment(solicitudReserva.fechaDesde);
    fechaVencimiento = fechaVencimiento.subtract(10, "days");

    var strFechaVencimiento = fechaVencimiento.format("DD-MM-YYYY");
    var montoSena = solicitudReserva.montoTotal / 10;

    var strMontoSena = this.formatMoney(montoSena);

    // solicitudReserva.montoSenia = montoSena;
    solicitudReserva.realizoCheckIn = false;
    solicitudReserva.realizoCheckOut = false;
    
    solicitudReserva.estado = this.estados.find(e => e.descripcion.toLowerCase() == solicitudReserva.estado.descripcion.toLowerCase());
    solicitudReserva.disabled = true;

    this._solicituReservaService.actualizarReserva(solicitudReserva);


    if (solicitudReserva.estado.descripcion.toLowerCase() == "solicitud aceptada")
      this._emailService.enviarEmailConfirmacionReserva(strFechaVencimiento, strMontoSena);

    else if (solicitudReserva.estado.descripcion.toLocaleLowerCase() == "solicitud rechazada")
      this._emailService.enviarEmailRechazoReserva();

      else if (solicitudReserva.estado.descripcion.toLocaleLowerCase() == "cancelado")
      {        
        this._emailService.enviarEmailCancelacionReserva();

        let evento = this.eventos.find(e => e.extendedProps?.id == solicitudReserva.id);
        this._reservaService.eliminarReserva(evento.id);        
      }

  }

  cancelarSolicitudesPendienteSena(): void {

    let solicitudesAceptadas = this.solicitudesReserva.filter(x => x.estado.descripcion.toLowerCase() == "solicitud aceptada");
    solicitudesAceptadas = solicitudesAceptadas.filter(x => x.montoSenia == 0);

    const fechaActual = moment(Date.now());

    solicitudesAceptadas = solicitudesAceptadas.filter(solicitud => {
      let fechaDesde = moment(solicitud.fechaDesde);
      let diferenciaDias = fechaDesde.diff(fechaActual, 'days');

      if (diferenciaDias < 10) {

        solicitud.estado = this.estadoCancelado;
        this._solicituReservaService.actualizarReserva(solicitud);
        this._emailService.enviarEmailCancelacionReserva();

        let evento = this.eventos.find(e => e.extendedProps?.id == solicitud.id);
        this._reservaService.eliminarReserva(evento.id);
      }

    });

    if (solicitudesAceptadas.length == 0) {
      this.uiService.showSnackBar(
        'No existen solicitudes aceptadas, que estén pendientes de seña y deban cancelarse',
        null,
        3000
      );

    }
  }

}
