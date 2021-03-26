import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Reserva } from '../Models/reserva.model';
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudReservaService {

  private solicitudesReserva: Reserva[] = [];
  private firestoreSubscription: Subscription;
  solicitudReservaChanged = new Subject<Reserva[]>();


  constructor(private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  guardarSolicitudReserva(solicitud: Reserva) {

    solicitud.cliente = Object.assign(
      {},
      solicitud.cliente
    );

    solicitud.cabana = Object.assign(
      {},
      solicitud.cabana
    );

    const solicitudParse = Object.assign({}, solicitud);

    this.firestore
      .collection('solicitudReserva')
      .add(solicitudParse)
      .then()
      .catch(
        (error) =>
          this.uiService.showSnackBar(
            'Ocurrió un error al intentar guardar la solicitud: ' + error,
            null,
            3000
          )
      );

  }

  convertDate(date: any) {
    
    return new Date(date.seconds * 1000 + date.nanoseconds/1000000)

  }


  obtenerReservas() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('solicitudReserva')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const reserva = doc.payload.doc.data();
            const id = doc.payload.doc.id;

            reserva.id = id;
            reserva.cabana = reserva.cabana;
            reserva.cliente = reserva.cliente;
            reserva.estado = reserva.estado;
            reserva.cantOcupantes = reserva.cantOcupantes;
            reserva.codigoReserva = reserva.codigoReserva;
            reserva.disabled = reserva.disabled;
            reserva.fechaDesde = this.convertDate(reserva.fechaDesde);
            reserva.fechaHasta = this.convertDate(reserva.fechaHasta);
            reserva.montoSenia = reserva.montoSenia;
            reserva.montoTotal = reserva.montoTotal;
            reserva.realizoCheckIn = reserva.realizoCheckIn;
            reserva.realizoCheckOut = reserva.realizoCheckOut;
            
            return reserva;
          });
        })
      )
      .subscribe(
        (reservas: Reserva[]) => {
          this.solicitudesReserva = reservas;
          this.solicitudReservaChanged.next([...this.solicitudesReserva]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener la reserva, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );

  }

  actualizarReserva(reserva) {

    this.firestore
      .doc('solicitudReserva/' + reserva.id)
      .update(reserva)
      .then((response) => {
        this.uiService.showSnackBar(
          'Se actualizó la solicitud con éxito',
          null,
          3000
        )

      })
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar actualizar la solicitud: ' + error,
          null,
          3000
        )
      );
  }

}