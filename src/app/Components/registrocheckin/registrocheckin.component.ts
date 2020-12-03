import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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

  constructor(
    private _formBuilder: FormBuilder,
    private _checkinService: CheckinService,
    private uiService: UIService,
    private route: ActivatedRoute,
    private reservaService: ReservaService,

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

    this.reservaService.buscarEventos();


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

  registrarCheckIn() {

    let checkIn = new CheckIn();

    checkIn.titular = this.datosPersonalesForm.value;
    checkIn.datosDomicilio = this.datosContactoForm.value;
    checkIn.acompanantes = this.acompanantes;
    checkIn.vehiculos = this.vehiculos;
    checkIn.evento = this.evento;
    this._checkinService.guardarCheckin(checkIn);

  }

  agregarAcompanante() {

    const persona = this.datosAcompanantesForm.value;
    this.acompanantes.push(persona);

    this.datosAcompanantesForm.reset();
    this.uiService.showSnackBar(
      'La persona se agregó con éxito.',
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