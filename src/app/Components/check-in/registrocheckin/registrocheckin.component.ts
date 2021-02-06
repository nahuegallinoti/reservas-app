import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { STEPPER_GLOBAL_OPTIONS } from '@angular/cdk/stepper';
import { CheckIn } from 'src/app/Models/checkin.model';
import { CheckinService } from 'src/app/Services/checkin.service';
import { UIService } from 'src/app/Shared/ui.service';
import { Cliente } from 'src/app/Models/cliente.model';
import { Vehiculo } from 'src/app/Models/vehiculo.model';
import { Reserva } from 'src/app/Models/reserva.model';
import { ActivatedRoute } from '@angular/router';
import { ReservaService } from 'src/app/Services/evento.service';
import { Subscription } from 'rxjs';
import { Evento } from 'src/app/Models/evento.model';
import { FormaPagoService } from 'src/app/Services/forma-pago.service';
import { FormaPago } from 'src/app/Models/formaPago.model';
import { MatSelectChange } from '@angular/material/select';
import { EmailService } from 'src/app/Services/email.service';

@Component({
  selector: 'app-registrocheckin',
  templateUrl: './registrocheckin.component.html',
  styleUrls: ['./registrocheckin.component.scss'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: { showError: true }
  }]
})
export class RegistrocheckinComponent implements OnInit {

  reservaId: string;
  datosPersonalesForm: FormGroup;
  datosContactoForm: FormGroup;
  datosAcompanantesForm: FormGroup;
  datosVehiculosForm: FormGroup;
  cancelacionPagoForm: FormGroup;
  acompanantes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  evento: Evento;
  eventosSubscription: Subscription;
  formasPago: FormaPago[] = [];
  formasPagoSubscription: Subscription;
  selectedFormaPago: string = "Contado";
  selectedData: { value: string; text: string } = {
    value: "",
    text: "",
  };

  selectedCountryControl = new FormControl(this.selectedFormaPago);


  constructor(
    private _formBuilder: FormBuilder,
    private _checkinService: CheckinService,
    private _emailService: EmailService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private reservaService: ReservaService,
    private formaPagoService: FormaPagoService
    ) { }

  ngOnInit() {
    this.route.params.subscribe(params => {      
      this.reservaId = params.reservaId;
    });

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        this.evento = eventos.find(x => x.id == this.reservaId);
      }
    );

    this.formasPagoSubscription = this.formaPagoService.formasPagoChanged.subscribe(
      (formasPago) => {
        this.formasPago = formasPago;
      }
    )


    this.reservaService.buscarEventos();
    this.formaPagoService.ObtenerFormasPago();

    this.datosPersonalesForm = this._formBuilder.group({
      nombre: [],
      apellidos: [],
      dni: [],
      telefono: [],
      email: [],
      fechaNacimiento: [],
      codigoPostal: [],
    });
    this.datosContactoForm = this._formBuilder.group({
      pais: [],
      provincia: [],
      barrio: [],
      calle: [],
      numero: [],
      departamento: [],
    });
    this.datosAcompanantesForm = this._formBuilder.group({
      nombre: [],
      apellidos: [],
      dni: [],
      fechaNacimiento: [],
    });
    this.datosVehiculosForm = this._formBuilder.group({
      marca: [],
      modelo: [],
      patente: [],
    });
    this.cancelacionPagoForm = this._formBuilder.group({
      sena: [],
      total: [],
      remanente: [],
    });
    
  }

  
  selectedValue(event: MatSelectChange) {
    this.selectedData = {
      value: event.value,
      text: event.source.triggerValue
    };
  };


  registrarCheckIn() {

    let checkIn = new CheckIn();
    
    checkIn.formaPago = this.formasPago.find(x => x.id.toString() == this.selectedData.value);

    checkIn.titular = this.datosPersonalesForm.value;
    checkIn.datosDomicilio = this.datosContactoForm.value;
    checkIn.acompanantes = this.acompanantes;
    checkIn.vehiculos = this.vehiculos;

    this.evento.extendedProps.realizoCheckIn = true;

    this.reservaService.actualizarReserva(this.evento.id, this.evento);
    
    checkIn.evento = this.evento;

    this._checkinService.guardarCheckin(checkIn);
    this._emailService.enviarEmailCheckIn(checkIn.id);
  }

  agregarAcompanante() {

    const persona = this.datosAcompanantesForm.value;
    
    if(persona.nombre == null  || persona.apellidos == null || persona.dni== null || persona.fechaNacimiento ==null){
      this.uiService.showSnackBar(
      'Debe ingresar datos obligatorios para poder cargar acompañantes',
      null,
      3000
    );
    return;
    }
    this.acompanantes.push(persona);
    this.datosAcompanantesForm.reset();
    this.uiService.showSnackBar(
      'El acompañante se agregó con éxito.',
      null,
      3000
    );
    

  }

  agregarVehiculo() {

    const vehiculo = this.datosVehiculosForm.value;
    
    if (vehiculo.marca == null  || vehiculo.patente == null || vehiculo.modelo== null){
      this.uiService.showSnackBar(
        'Debe ingresar datos obligatorios para poder cargar el vehículo.',
        null,
        3000
      );
      return;
    }

    this.vehiculos.push(vehiculo);

    this.datosVehiculosForm.reset();
    this.uiService.showSnackBar(
      'El vehículo se agregó con éxito.',
      null,
      3000
    );
  }

  quitarVehiculo(vehiculo) {
    const index: number = this.vehiculos.indexOf(vehiculo);

    if (index !== -1) {
      this.vehiculos.splice(index, 1);
    }

    this.uiService.showSnackBar(
      'El vehículo se quitó de la lista.',
      null,
      3000
    );

  }

  quitarAcompanante(acompanante) {
    const index: number = this.acompanantes.indexOf(acompanante);

    if (index !== -1) {
      this.acompanantes.splice(index, 1);
    }

    this.uiService.showSnackBar(
      'La persona se quitó de la lista.',
      null,
      3000
    );

  }
  
}