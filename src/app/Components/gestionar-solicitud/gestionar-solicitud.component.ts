import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { SolicitudReserva } from 'src/app/Models/solicitudReserva.model';
import { Estado } from 'src/app/Models/estado.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { Subscription } from 'rxjs';

export interface DialogDataSolicitudReserva {
  solicitudReserva: SolicitudReserva;
}

@Component({
  selector: 'app-gestionar-solicitud',
  templateUrl: './gestionar-solicitud.component.html',
  styleUrls: ['./gestionar-solicitud.component.scss']
})
export class GestionarSolicitudComponent implements OnInit {

  solicitudReserva: SolicitudReserva;
  estados: Estado[] = [];
  estadosSubscription: Subscription;

  constructor(private _estadoService: EstadoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataSolicitudReserva) { }

  ngOnInit(): void {

    if (this.data?.solicitudReserva != null) {
      this.solicitudReserva = this.data.solicitudReserva;

    }

    this.estadosSubscription = this._estadoService.estadosChanged.subscribe(
      (estados) => {
        this.estados = estados;
      }
    )

    this._estadoService.buscarEstados();

  }
}
