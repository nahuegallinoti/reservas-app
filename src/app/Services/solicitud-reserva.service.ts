import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { SolicitudReserva } from '../Models/solicitudReserva.model';
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class SolicitudReservaService {

  private solicitudesReserva: SolicitudReserva[] = [];
  private firestoreSubscription: Subscription;
  solicitudReservaChanged = new Subject<SolicitudReserva[]>();


  constructor(private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  guardarSolicitudReserva(solicitud: SolicitudReserva) {

    solicitud.cliente = Object.assign(
      {},
      solicitud.cliente
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
            reserva.fechaDesde = reserva.fechaDesde;
            reserva.fechaHasta = reserva.fechaHasta;
            reserva.cantidadPersonas = reserva.cantidadPersonas;
            reserva.cliente = reserva.cliente;
            reserva.estado = reserva.estado;
            reserva.costo = reserva.costo;
            
            return reserva;
          });
        })
      )
      .subscribe(
        (reservas: SolicitudReserva[]) => {
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
      .set(reserva)
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