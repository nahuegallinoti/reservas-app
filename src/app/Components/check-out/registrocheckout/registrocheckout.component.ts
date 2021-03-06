import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Consumo, ItemConsumo } from 'src/app/Models/consumo.model';
import { ConsumoService } from 'src/app/Services/consumo.service';
import { ReservaService } from 'src/app/Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import * as moment from 'moment';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Evento } from 'src/app/Models/evento.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { Estado } from 'src/app/Models/estado.model';
import { EstadosConst } from 'src/app/Shared/estados';
import { SolicitudReservaService } from 'src/app/Services/solicitud-reserva.service';
import { Reserva } from 'src/app/Models/reserva.model';

@Component({
  selector: 'app-registrocheckout',
  templateUrl: './registrocheckout.component.html',
  styleUrls: ['./registrocheckout.component.css']
})
export class RegistrocheckoutComponent implements OnInit {

  consumosSubscription: Subscription;
  consumo = new MatTableDataSource<ItemConsumo>();
  consumos: Consumo;
  reservaId: number;
  isLoading = false;
  isLoadingSubscription: Subscription;
  columnas: string[] = ['descripcion', 'precioUnidad', 'cantidad', 'total', 'fechaConsumo'];
  total: number = 0;
  eventosSubscription: Subscription;
  eventos = [];
  evento: Evento;
  esDetalle = false;

  estadosSubscription: Subscription;
  estados: Estado[] = [];

  solicitudesReservaSubscription: Subscription;
  solicitudesReserva: Reserva[] = [];

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
    this.consumo.sort = this.sort;
    this.consumo.paginator = this.paginator;
  }

  constructor(
    private consumoService: ConsumoService,
    private route: ActivatedRoute,
    private uiService: UIService,
    private reservaService: ReservaService,
    private estadoService: EstadoService,
    private _solicituReservaService: SolicitudReservaService

  ) { }

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.route.params.subscribe(params => {
      this.reservaId = params.reservaId;
      this.esDetalle = params.esDetalle == "false" ? false: true;
    });

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        this.eventos = eventos;
        this.evento = this.eventos.find(x => x.id == this.reservaId);
      }
    );

    this.estadosSubscription = this.estadoService.estadosChanged.subscribe((estados) => {
      this.estados = estados;
    })

    this.solicitudesReservaSubscription = this._solicituReservaService.solicitudReservaChanged.subscribe((solicitudes) => {
      this.solicitudesReserva = solicitudes;
    })



    this.consumosSubscription = this.consumoService.consumosChanged.subscribe(
      (consumos) => {
        let consumosReserva = consumos.find(x => x.reserva.id == this.reservaId);

        if (consumosReserva != undefined) {
          this.consumo.data = consumosReserva.consumos.map(x => x);
          this.consumos = consumosReserva;
          this.consumos.consumos.map(x => x.fecha = moment(x.fecha).toDate());
          this.consumos.consumos.map(x => this.total += Number(x.monto));
        }


      }
    );

    this.consumoService.obtenerConsumosAnteriores();
    this.reservaService.buscarEventos();
    this.estadoService.buscarEstados();
    this._solicituReservaService.obtenerReservas();

  }

  ngAfterViewInit(): void {
    this.consumo.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }


  guardarCheckout(): void {
    this.esDetalle = true;
    this.evento = this.eventos.find(x => x.id == this.reservaId);
    this.evento.extendedProps.realizoCheckOut = true;
    this.evento.extendedProps.estado = this.estados.find(x => x.identificador == EstadosConst.estadoFinalizado)
    this.reservaService.actualizarEvento(this.reservaId.toString(), this.evento);

    this.actualizarEstadoSolicitudReserva(this.evento.extendedProps.codigoReserva);
  }

  actualizarEstadoSolicitudReserva(codigoReserva: number)
  {
    
    let solicitudReserva = this.solicitudesReserva.find(x => x.codigoReserva == codigoReserva);

    solicitudReserva.estado = this.estados.find(x => x.identificador == EstadosConst.estadoFinalizado)
    solicitudReserva.realizoCheckOut = true;

    this._solicituReservaService.actualizarReserva(solicitudReserva);
  }


  descargarComprobante(): void {

    const doc = new jsPDF();

    var img = new Image();
    img.src = 'assets/cabanas.jpeg';

    doc.addImage(img, 'jpeg', 140, 7, 60, 20);

    doc.setFont("italic");
    doc.text('Consumos de la reserva a nombre de: ' + this.evento.extendedProps.cliente.nombre + ' ' + this.evento.extendedProps.cliente.apellidos, 13, 40);

    autoTable(doc, { html: '#my-table', margin: { top: 45 }});

    doc.text('Total: $ ' + this.total.toFixed(2), 150, 100);

    doc.save(this.consumos.reserva.id.toString() + '.pdf');

  }

}
