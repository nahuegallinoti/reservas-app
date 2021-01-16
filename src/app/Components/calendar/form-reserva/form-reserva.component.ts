import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
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
import { Colors } from '../../../Shared/colors';

import { ReservaService } from '../../../Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';
import { TarifaService } from 'src/app/Services/tarifa.service';
import { Estado } from 'src/app/Models/estado.model';
import { EstadoService } from 'src/app/Services/estado.service';
import { EstadosConst } from 'src/app/Shared/estados';
import { CabanaService } from 'src/app/Services/cabana.service';

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
  Cabanias: number[] = [1, 2, 3];

  eventosSubscription: Subscription;
  tarifasSubscription: Subscription;
  estadosSubscription: Subscription;
  cabanasSubscription: Subscription;

  fechaDesde: Date;
  fechaHastaMinima;
  eventos = [];
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
    private dialogRef: MatDialogRef<FormReservaComponent>,
    private uiService: UIService,
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
        this.eventos = eventos;
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
        this.cabanas = cabanas;
      }
    );

    this.reservaService.buscarEventos();
    this.tarifaService.buscarTarifas();
    this.estadoService.buscarEstados();
    this.cabanasService.obtenerCabanias();

    this.buildForm();
    if (!this.isEditing) {
      this.limitarFechaHasta();
    } else {
      this.inicializarCamposParaEdicion();
    }
  }

  buildForm() {
    this.FormReserva = this.formBuilder.group({
      NombreYApellido: [
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
      Correo: [null, { updateOn: 'blur' }],
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
    fechaHastaAMostrar.setDate(fechaHastaAMostrar.getDate() - 1);
    this.FormReserva.setValue({
      NombreYApellido: this.eventoAEditar.extendedProps.cliente.nombreYApellido,
      Dni: this.eventoAEditar.extendedProps.cliente.dni,
      Telefono: this.eventoAEditar.extendedProps.cliente.telefono,
      Correo: this.eventoAEditar.extendedProps.cliente.correo,
      FechaDesde: this.eventoAEditar.extendedProps.fechaDesde,
      FechaHasta: fechaHastaAMostrar,
      CantOcupantes: this.eventoAEditar.extendedProps.cantOcupantes,
      Cabania: this.eventoAEditar.extendedProps.idCabania,
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
    cliente.nombreYApellido = this.FormReserva.value.NombreYApellido;
    cliente.telefono = this.FormReserva.value.Telefono;
    cliente.correo = this.FormReserva.value.Correo;

    return cliente;
  }

  crearReserva(cliente: Cliente): Reserva {
    const reserva = new Reserva();
    reserva.cliente = cliente;

    reserva.fechaCreacion = new Date();
    reserva.fechaDesde = new Date(this.FormReserva.value.FechaDesde);

    reserva.fechaHasta = new Date(this.FormReserva.value.FechaHasta);
    reserva.fechaHasta.setDate(reserva.fechaHasta.getDate() + 1);
    reserva.cantOcupantes = this.FormReserva.value.CantOcupantes;
    reserva.idCabania = this.FormReserva.value.Cabania;
    reserva.montoSenia = this.FormReserva.value.MontoSenia;
    reserva.montoTotal = this.FormReserva.value.MontoTotal;
    reserva.cabana = this.cabanas.find(x => x.numero == reserva.idCabania);

    reserva.estado = this.determinarEstadoReserva(reserva);
    reserva.realizoCheckIn = false;
    reserva.realizoCheckOut = false;
   
    return reserva;
  }

  crearEvento(reserva: Reserva): Evento {
    const debe = +reserva.montoSenia < +reserva.montoTotal;
    const titulo = debe
      ? reserva.cabana.nombre +
      ' - ' +
      reserva.cliente.nombreYApellido +
      ' / Debe: $' +
      (reserva.montoTotal - reserva.montoSenia)
      : reserva.cabana.nombre + ' - ' + reserva.cliente.nombreYApellido;
    
    const evento: Evento = {
      title: titulo,
      start: reserva.fechaDesde,
      end: reserva.fechaHasta,
      extendedProps: reserva,
      backgroundColor: reserva.estado.color,
    };

    return evento;
  }

  determinarEstadoReserva(reserva: Reserva): Estado {

    let estado: Estado;

    reserva.montoSenia == reserva.montoTotal ? 
      estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoPagado):

    reserva.montoSenia == 0 ? 
      estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoPendienteSeña):

    estado = this.estados.find(estados => estados.identificador === EstadosConst.estadoSeñado);

    return estado;
  }


  guardarReserva() {

    this.FormReserva.controls['MontoSenia'].updateValueAndValidity();
    this.FormReserva.controls['MontoTotal'].updateValueAndValidity();

    if (this.FormReserva.valid) {
      const cliente = this.crearCliente();
      const reserva = this.crearReserva(cliente);

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
            reserva.idCabania
          )) ||
        (this.isEditing &&
          this.verificarDisponibilidad(
            reserva.fechaDesde,
            reserva.fechaHasta,
            reserva.idCabania,
            this.eventoAEditar.id
          ))
      ) {
        const evento = this.crearEvento(reserva);
          
        if (this.isEditing) {
          const id = this.eventoAEditar.id;
          this.reservaService.actualizarReserva(id, evento);
        } else {
          this.reservaService.guardarReserva(evento);
        }
        this.dialogRef.close();
      }
    }
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
        e.extendedProps.idCabania === idCabania &&
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
    const fechaDesde = new Date(this.FormReserva.value.FechaDesde);
    const fechaHasta = new Date(this.FormReserva.value.FechaHasta);

    const cantOcupantes = this.FormReserva.value.CantOcupantes;
    const cantDias = this.calcularDiferenciaDeFechas(fechaDesde, fechaHasta) + 1; //Se suma 1 dia porque se cuenta desde que llego hasta el ultimo dia de hospedaje

    const total = 1500 * cantOcupantes * cantDias;

    this.FormReserva.controls.MontoTotal.setValue(total);

  }

  calcularDiferenciaDeFechas(fechaDesde, fechaHasta) {

    fechaDesde = new Date(fechaDesde);
    fechaHasta = new Date(fechaHasta);

    return Math.floor((Date.UTC(fechaHasta.getFullYear(), fechaHasta.getMonth(), fechaHasta.getDate()) - Date.UTC(fechaDesde.getFullYear(), fechaDesde.getMonth(), fechaDesde.getDate())) / (1000 * 60 * 60 * 24));
  }

  cancelar() {
    this.dialogRef.close();
  }

  ngOnDestroy(): void {
    if (this.eventosSubscription) {
      this.eventosSubscription.unsubscribe();
    }
  }
}
