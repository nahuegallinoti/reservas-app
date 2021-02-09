import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Estado } from 'src/app/Models/estado.model';
import { SolicitudReserva } from 'src/app/Models/solicitudReserva.model';
import { EmailService } from 'src/app/Services/email.service';
import { EstadoService } from 'src/app/Services/estado.service';
import { SolicitudReservaService } from 'src/app/Services/solicitud-reserva.service';
import { UIService } from 'src/app/Shared/ui.service';
import { GestionarSolicitudComponent } from '../gestionar-solicitud/gestionar-solicitud.component';
import * as moment from 'moment';
import { Evento } from 'src/app/Models/evento.model';

@Component({
  selector: 'app-solicitudes-reserva',
  templateUrl: './solicitudes-reserva.component.html',
  styleUrls: ['./solicitudes-reserva.component.scss']
})

export class SolicitudesReservaComponent implements OnInit {

  solicitudesReserva: SolicitudReserva[] = [];
  isLoading = false;
  isLoadingSubscription: Subscription;
  solicitudesReservaSubscription: Subscription;
  estados: Estado[] = [];
  estadosSubscription: Subscription;
  estadoActualSolicitud: Estado;
  panelOpenState = false;

  constructor(
    private _solicituReservaService: SolicitudReservaService,
    private uiService: UIService,
    private dialog: MatDialog,
    private _estadoService: EstadoService,
    private _emailService: EmailService
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

        estados = estados.filter(x => x.descripcion.toLowerCase() == "solicitud aceptada" || 
                                      x.descripcion.toLowerCase() == "solicitud rechazada" ||
                                      x.descripcion.toLowerCase() == "pendiente de aprobacion")
        this.estados = estados;
      }
    )

    this._solicituReservaService.obtenerReservas();
    this._estadoService.buscarEstados();

  }

  openDialogSeleccionarCabana(solicitudReserva: SolicitudReserva): void {
    const dialogRef = this.dialog.open(GestionarSolicitudComponent, {
      width: "25vw",
      height: "18vw",
      data: {
        solicitudReserva: solicitudReserva,
      }

    });

    dialogRef.afterClosed().subscribe((response) => {
      if (response)
      {
        console.log(response);
        this.guardarDatosSolicitud(solicitudReserva);
      }
    });
  }

  formatMoney = (n) => {
    return "$ " + (Math.round(n * 100) / 100).toLocaleString();
  }

  actualizarSolicitud(solicitudReserva: SolicitudReserva) {

    if (solicitudReserva != undefined && solicitudReserva.estado.descripcion.toLowerCase() == "solicitud aceptada") {

      this.openDialogSeleccionarCabana(solicitudReserva);

    }

  }

  guardarDatosSolicitud(solicitudReserva: SolicitudReserva) {
    let fechaVencimiento = moment(solicitudReserva.fechaDesde);
    fechaVencimiento = fechaVencimiento.subtract(10, "days");

    var strFechaVencimiento = fechaVencimiento.format("DD-MM-YYYY");
    var montoSena = solicitudReserva.costo / 10;

    var strMontoSena = this.formatMoney(montoSena);

    solicitudReserva.estado = this.estados.find(e => e.descripcion == solicitudReserva.estado.descripcion);
    solicitudReserva.disabled = true;

    this._solicituReservaService.actualizarReserva(solicitudReserva);


    if (solicitudReserva.estado.descripcion.toLowerCase() == "solicitud aceptada")
      this._emailService.enviarEmailConfirmacionReserva(strFechaVencimiento, strMontoSena);

    else if (solicitudReserva.estado.descripcion.toLocaleLowerCase() == "solicitud rechazada")
      this._emailService.enviarEmailRechazoReserva();

  }

}
