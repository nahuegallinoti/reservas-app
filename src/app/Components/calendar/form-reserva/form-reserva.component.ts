import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';

import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { faIdCard } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faMoneyCheckAlt } from '@fortawesome/free-solid-svg-icons';

import { Reserva } from '../../../Models/reserva.model';
import { Cliente } from '../../../Models/cliente.model';
import { Evento } from '../../../Models/evento.model';

import { ReservaService } from '../../../Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import { TarifaService } from 'src/app/Services/tarifa.service';
import { Estado } from 'src/app/Models/estado.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { EstadosConst } from 'src/app/Shared/estados';
import { CabanaService } from 'src/app/Services/cabana.service';
import * as moment from 'moment';
import { ConfirmationDialogComponent } from '../../Shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { SolicitudReservaService } from 'src/app/Services/solicitud-reserva.service';

@Component({
  selector: 'form-reserva',
  templateUrl: './form-reserva.component.html',
  styleUrls: ['./form-reserva.component.css'],
  providers: [ReservaService, TarifaService],
})
export class FormReservaComponent implements OnInit, OnDestroy {
  faUser = faUser;
  faPhone = faPhone;
  faEnvelope = faEnvelope;
  faUsers = faUsers;
  faHome = faHome;
  faIdCard = faIdCard;
  faDollarSign = faDollarSign;
  faMoneyCheckAlt = faMoneyCheckAlt;
  FormReserva: FormGroup;
  CantidadOcupantes: number[] = [1, 2, 3, 4, 5, 6];

  eventosSubscription: Subscription;
  tarifasSubscription: Subscription;
  estadosSubscription: Subscription;
  cabanasSubscription: Subscription;
  reservasSubscription: Subscription;

  fechaDesde: Date;
  fechaHastaMinima;
  eventos: Evento[] = [];
  solicitudesReservas: Reserva[] = [];
  eventosCabanasActuales: Evento[] = [];
  tarifas = [];
  estados = [];
  cabanas = [];

  isEditing: boolean;
  eventoAEditar: Evento;

  constructor(
    private formBuilder: FormBuilder,
    private reservaService: ReservaService,
    private tarifaService: TarifaService,
    private estadoService: EstadoService,
    private cabanasService: CabanaService,
    private solicitudReservaService: SolicitudReservaService,
    private dialogRef: MatDialogRef<FormReservaComponent>,
    private uiService: UIService,
    private dialog: MatDialog,
    @Inject(MAT_DIALOG_DATA) data
  ) {
    if (data.isEditing) {
      this.isEditing = data.isEditing;
      this.eventoAEditar = data.event;
    } else {
      this.isEditing = data.isEditing;
      this.fechaDesde = data.fechaDesde;
    }
  }

  ngOnInit(): void {
    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {

        var fechaDesde = this.fechaDesde == null ? this.eventoAEditar.start : this.fechaDesde;

        this.eventos = eventos;

        this.eventosCabanasActuales = this.eventos.filter(x => moment(fechaDesde).
          isBetween(x.start, x.end, null, "[]"));

      }
    );

    this.tarifasSubscription = this.tarifaService.tarifasChanged.subscribe(
      (tarifas) => {
        this.tarifas = tarifas;
      }
    );

    this.estadosSubscription = this.estadoService.estadosChanged.subscribe(
      (estados) => {
        this.estados = estados;
      }
    );

    this.cabanasSubscription = this.cabanasService.cabanasChanged.subscribe(
      (cabanas) => {

        if (!this.isEditing) {
          var cabanasOcupadas = cabanas.filter(cabana => this.eventosCabanasActuales.some(x => x.extendedProps.cabana.id == cabana.id));
          cabanas = cabanas.filter(item => !cabanasOcupadas.includes(item));
        }
        this.cabanas = cabanas;
      }
    );

    this.reservasSubscription = this.solicitudReservaService.solicitudReservaChanged.subscribe(
      (reservas) => {
        this.solicitudesReservas = reservas;
      }
    )

    this.reservaService.buscarEventos();
    this.tarifaService.buscarTarifas();
    this.estadoService.buscarEstados();
    this.cabanasService.obtenerCabanias();
    this.solicitudReservaService.obtenerReservas();
    
    this.buildForm();
    if (!this.isEditing) {
      this.limitarFechaHasta();
    } else {
      this.inicializarCamposParaEdicion();
    }
  }

  buildForm() {
    this.FormReserva = this.formBuilder.group({
      Nombre: [
        ,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      Apellidos: [
        ,
        { validators: [Validators.required], updateOn: 'blur' },
      ],

      Dni: [
        ,
        {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(6),
          ],
          updateOn: 'blur',
        },
      ],
      Telefono: [
        ,
        {
          validators: [
            Validators.required,
            Validators.pattern('^[0-9]*$'),
            Validators.minLength(10),
          ],
          updateOn: 'blur',
        },
      ],
      Email: [null, { updateOn: 'blur' }],
      FechaDesde: [
        this.fechaDesde,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      FechaHasta: [, { validators: [Validators.required], updateOn: 'blur' }],
      CantOcupantes: [
        ,
        { validators: [Validators.required], updateOn: 'blur' },
      ],
      Cabania: [, { validators: [Validators.required], updateOn: 'blur' }],
      MontoSenia: [
        ,
        {
          validators: [Validators.required, Validators.pattern('^[0-9]*$')],
          updateOn: 'blur',
        },
      ],
      MontoTotal: [
        ,
        {
          validators: [Validators.required, Validators.pattern('^[0-9]*$')],
          updateOn: 'blur',
        },
      ],
    });
  }

  inicializarCamposParaEdicion() {
    const fechaHastaAMostrar: Date = new Date(
      this.eventoAEditar.extendedProps.fechaHasta.toString()
    );
    fechaHastaAMostrar.setDate(fechaHastaAMostrar.getDate());
    this.FormReserva.setValue({
      Nombre: this.eventoAEditar.extendedProps.cliente.nombre,
      Apellidos: this.eventoAEditar.extendedProps.cliente.apellidos,
      Dni: this.eventoAEditar.extendedProps.cliente.dni,
      Telefono: this.eventoAEditar.extendedProps.cliente.telefono,
      Email: this.eventoAEditar.extendedProps.cliente.email,
      FechaDesde: this.eventoAEditar.extendedProps.fechaDesde,
      FechaHasta: fechaHastaAMostrar,
      CantOcupantes: this.eventoAEditar.extendedProps.cantOcupantes,
      Cabania: this.eventoAEditar.extendedProps.cabana.id,
      MontoSenia: this.eventoAEditar.extendedProps.montoSenia,
      MontoTotal: this.eventoAEditar.extendedProps.montoTotal,
    });
  }

  limitarFechaHasta() {
    this.fechaHastaMinima = new Date();
    this.fechaHastaMinima.setDate(this.fechaDesde.getDate() + 1);
  }

  crearCliente(): Cliente {
    const cliente = new Cliente();
    cliente.dni = this.FormReserva.value.Dni;
    cliente.nombre = this.FormReserva.value.Nombre;
    cliente.apellidos = this.FormReserva.value.Apellidos;
    cliente.telefono = this.FormReserva.value.Telefono;
    cliente.email = this.FormReserva.value.Email;

    return cliente;
  }

  crearReserva(cliente: Cliente): Reserva {
    const reserva = new Reserva();
    reserva.cliente = cliente;

    reserva.fechaCreacion = new Date();
    reserva.fechaDesde = new Date(this.FormReserva.value.FechaDesde);

    reserva.fechaHasta = new Date(this.FormReserva.value.FechaHasta);
    reserva.fechaHasta.setDate(reserva.fechaHasta.getDate());
    reserva.cantOcupantes = this.FormReserva.value.CantOcupantes;
    reserva.montoSenia = this.FormReserva.value.MontoSenia;
    reserva.montoTotal = this.FormReserva.value.MontoTotal;
    reserva.cabana = this.cabanas.find(x => x.id == this.FormReserva.value.Cabania);

    reserva.estado = this.determinarEstadoReserva();
    reserva.realizoCheckIn = false;
    reserva.realizoCheckOut = false;

    return reserva;
  }

  crearEvento(reserva: Reserva): Evento {
    const titulo = reserva.cabana.nombre + ' - ' + reserva.cliente.apellidos + ' ' + reserva.cliente.nombre;

    const evento: Evento = {
      title: titulo,
      start: reserva.fechaDesde,
      end: reserva.fechaHasta,
      extendedProps: reserva,
      backgroundColor: reserva.estado.color,
    };

    return evento;
  }

  determinarEstadoReserva(): Estado {

    let estado: Estado;

    this.FormReserva.value.MontoSenia == this.FormReserva.value.MontoTotal ?
      estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoPagado) :

      this.FormReserva.value.MontoSenia == 0 ?
        estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoPendienteSeña) :

        estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoSeñado);

    return estado;
  }

  guardarReserva() {

    this.FormReserva.controls['MontoSenia'].updateValueAndValidity();
    this.FormReserva.controls['MontoTotal'].updateValueAndValidity();

    if (this.FormReserva.valid) {
      
      if (this.isEditing) {
        const solicitudReserva = this.solicitudesReservas.find(x => x.id == this.eventoAEditar.extendedProps.id);
        this.actualizarSolicitudReserva(solicitudReserva);
        const evento = this.crearEvento(solicitudReserva);
        const id = this.eventoAEditar.id;

        this.reservaService.actualizarEvento(id, evento);
        
        this.dialogRef.close();

        return;
      }

      const cliente = this.crearCliente();
      const reserva = this.crearReserva(cliente);
      const evento = this.crearEvento(reserva);


      if (+reserva.montoSenia > +reserva.montoTotal) {
        this.FormReserva.controls.MontoSenia.setErrors({ invalid: true });
        this.FormReserva.controls.MontoTotal.setErrors({ invalid: true });
        return;
      }

      if (
        (!this.isEditing &&
          this.verificarDisponibilidad(
            reserva.fechaDesde,
            reserva.fechaHasta,
            reserva.cabana.id
          )) ||
        (this.isEditing &&
          this.verificarDisponibilidad(
            reserva.fechaDesde,
            reserva.fechaHasta,
            reserva.cabana.id,
            this.eventoAEditar.id
          ))
      ) {
        
          const solicitudReserva = this.crearSolicitudReserva();
          this.reservaService.guardarReserva(evento);
          this.solicitudReservaService.guardarSolicitudReserva(solicitudReserva);

        this.dialogRef.close();
      }
    }
  }

  actualizarSolicitudReserva(solicitudReserva: Reserva) {

    solicitudReserva.cliente.nombre = this.FormReserva.value.Nombre;
    solicitudReserva.cliente.apellidos = this.FormReserva.value.Apellidos;
    solicitudReserva.cliente.telefono = this.FormReserva.value.Telefono;
    solicitudReserva.cliente.email = this.FormReserva.value.Email;
    solicitudReserva.cliente.dni = this.FormReserva.value.Dni;

    solicitudReserva.cantOcupantes = this.FormReserva.value.CantOcupantes;
    solicitudReserva.montoTotal = this.FormReserva.value.MontoTotal;
    solicitudReserva.montoSenia = this.FormReserva.value.MontoSenia;
    solicitudReserva.disabled = true;
    solicitudReserva.fechaDesde = new Date(this.FormReserva.value.FechaDesde);
    solicitudReserva.fechaHasta = new Date(this.FormReserva.value.FechaHasta);
    solicitudReserva.cabana = this.cabanas.find(x => x.id == this.FormReserva.value.Cabania);
    this.solicitudReservaService.actualizarReserva(solicitudReserva);

  }

  crearSolicitudReserva(): Reserva {
    let solicitudReserva = new Reserva();
    solicitudReserva.cliente = new Cliente();
    solicitudReserva.estado = new Estado();

    solicitudReserva.cliente.nombre = this.FormReserva.value.Nombre;
    solicitudReserva.cliente.apellidos = this.FormReserva.value.Apellidos;
    solicitudReserva.cliente.telefono = this.FormReserva.value.Telefono;
    solicitudReserva.cliente.email = this.FormReserva.value.Email;
    solicitudReserva.cliente.dni = this.FormReserva.value.Dni;

    solicitudReserva.cantOcupantes = this.FormReserva.value.CantOcupantes;
    solicitudReserva.codigoReserva = Math.round(Math.random() * (1000 - 12) + 123);
    solicitudReserva.montoTotal = this.FormReserva.value.MontoTotal;
    solicitudReserva.disabled = true;
    solicitudReserva.estado = this.determinarEstadoReserva();
    solicitudReserva.fechaDesde = new Date(this.FormReserva.value.FechaDesde);
    solicitudReserva.fechaHasta = new Date(this.FormReserva.value.FechaHasta);

    return solicitudReserva;
  }

  verificarDisponibilidad(
    fechaDesde: Date,
    fechaHasta: Date,
    idCabania: number,
    idEvento?: string
  ): boolean {
    let result = true;

    const fechaHastaParseada = new Date(fechaHasta.toString());
    fechaHastaParseada.setDate(fechaHastaParseada.getDate() - 1);

    this.eventos.forEach((e) => {
      const fechaFinEvento = new Date(e.end.toString());
      fechaFinEvento.setDate(fechaFinEvento.getDate() - 1);

      if (
        ((e.start <= fechaDesde && fechaDesde < fechaFinEvento) ||
          (fechaDesde <= e.start && e.start < fechaHastaParseada)) &&
        e.extendedProps.cabana.id === idCabania &&
        (idEvento == null || e.id !== idEvento)
      ) {
        this.uiService.showSnackBar(
          'Existe otra reserva para la fecha y cabaña seleccionadas',
          null,
          3000
        );
        this.FormReserva.controls.FechaDesde.setErrors({ invalid: true });
        this.FormReserva.controls.FechaHasta.setErrors({ invalid: true });
        result = false;
      }
    });
    return result;
  }

  calcularSubTotal() {
    // var cabanasOcupadas = this.cabanas.filter(cabana => this.eventosCabanasActuales.some(x => x.extendedProps.cabana.id == cabana.id));
    // this.cabanas = this.cabanas.filter(item => !cabanasOcupadas.includes(item));

    const fechaDesde = new Date(this.FormReserva.value.FechaDesde);
    const fechaHasta = new Date(this.FormReserva.value.FechaHasta);

    const cantOcupantes = this.FormReserva.value.CantOcupantes;
    const cantDias = this.calcularDiferenciaDeFechas(fechaDesde, fechaHasta) + 1; //Se suma 1 dia porque se cuenta desde que llego hasta el ultimo dia de hospedaje

    const cabanaSelected = this.cabanas.find(x => x.id == this.FormReserva.value.Cabania)

    //TODO aqui se deberia sumar la tarifa fija segun epoca del año en ves de 1500
    const total = 1500 * cantOcupantes * cantDias + cabanaSelected.precioDia;

    this.FormReserva.controls.MontoTotal.setValue(total);

  }

  calcularDiferenciaDeFechas(fechaDesde, fechaHasta) {

    fechaDesde = new Date(fechaDesde);
    fechaHasta = new Date(fechaHasta);

    return Math.floor((Date.UTC(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate()) - Date.UTC(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate())) / (1000 * 60 * 60 * 24));
  }

  openDialogEliminarReserva(): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "25vw",
      height: "9vw",
      data: "¿Desea eliminar la reserva?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.reservaService.eliminarReserva(this.eventoAEditar.id);

        let solicitudReserva = this.solicitudesReservas.find((reserva) => reserva.id == this.eventoAEditar.extendedProps.id);
        solicitudReserva.estado = this.estados.find(e => e.descripcion.toLowerCase() == "cancelado");

        this.solicitudReservaService.actualizarReserva(solicitudReserva);

        this.dialogRef.close();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }
}
