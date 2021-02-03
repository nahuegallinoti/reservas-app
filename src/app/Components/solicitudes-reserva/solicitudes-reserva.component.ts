import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { Estado } from 'src/app/Models/estado.model';
import { SolicitudReserva } from 'src/app/Models/solicitudReserva.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { SolicitudReservaService } from 'src/app/Services/solicitud-reserva.service';
import { UIService } from 'src/app/Shared/ui.service';
import { GestionarSolicitudComponent } from '../gestionar-solicitud/gestionar-solicitud.component';


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
  disableSelect = true;

  constructor(
    private _solicituReservaService: SolicitudReservaService,
    private uiService: UIService,
    private dialog: MatDialog,
    private _estadoService: EstadoService
  ) { }

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.solicitudesReservaSubscription = this._solicituReservaService.solicitudReservaChanged.subscribe(
      (solicitudesReserva) => {

        // eventos = eventos.filter(function (evento) {
        // });

        this.solicitudesReserva = solicitudesReserva;        
      }
    );

    this.estadosSubscription = this._estadoService.estadosChanged.subscribe(
      (estados) => {
        this.estados = estados;
      }
    )

    this._solicituReservaService.obtenerReservas();
    this._estadoService.buscarEstados();
    
  }

  openDialogActualizarSolicitud(solicitudReserva: SolicitudReserva): void {
    const dialogRef = this.dialog.open(GestionarSolicitudComponent, {
      width: "22vw",
      height: "15vw",
      data: {
        solicitudReserva: solicitudReserva,
      }

    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  actualizarSolicitud(solicitudReserva: SolicitudReserva) {

    if (solicitudReserva != undefined)
    {
      solicitudReserva.estado = this.estados.find(e => e.descripcion == solicitudReserva.estado.descripcion);
      this._solicituReservaService.actualizarReserva(solicitudReserva);

    }

  }

}
