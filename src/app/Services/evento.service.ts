import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Evento } from '../Models/evento.model';
import { UIService } from '../Shared/ui.service';
import * as moment from 'moment';

@Injectable()
export class ReservaService {
  private eventos: Evento[] = [];
  private firestoreSubscription: Subscription;
  eventosChanged = new Subject<Evento[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) {}

  buscarEventos() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('eventos')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const evento = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            evento.id = id;
            // Parse dates
            evento.start = evento.start.toDate();
            evento.end = evento.end.toDate();

            evento.extendedProps.cabana = evento.extendedProps.cabana;
            evento.extendedProps.montoSenia = evento.extendedProps.montoSenia;
            evento.extendedProps.montoTotal = evento.extendedProps.montoTotal;
            evento.extendedProps.fechaDesde = evento.extendedProps.fechaDesde.toDate();
            evento.extendedProps.fechaHasta = evento.extendedProps.fechaHasta.toDate();
            return evento;
          });
        })
      )
      .subscribe(
        (eventos: Evento[]) => {
          this.eventos = eventos;
          this.eventosChanged.next([...this.eventos]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          console.log(error);
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener los eventos, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

  guardarReserva(evento: Evento) {
    const eventoParseado = this.parsearEventoParaFirestore(evento);
    this.firestore
      .collection('eventos')
      .add(eventoParseado)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se guardó la reserva con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar guardar la reserva: ' + error,
          null,
          3000
        )
      );
  }

  actualizarReserva(id: string, evento: Evento) {
    const eventoParseado = this.parsearEventoParaFirestore(evento);
    this.firestore
      .doc('eventos/' + id)
      .set(eventoParseado)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se actualizó la reserva con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar actualizar la reserva: ' + error,
          null,
          3000
        )
      );
  }

  parsearEventoParaFirestore(evento: Evento): object {
    const eventoParseado = evento;
    eventoParseado.extendedProps.cliente = Object.assign(
      {},
      eventoParseado.extendedProps.cliente
    );
    eventoParseado.extendedProps = Object.assign(
      {},
      eventoParseado.extendedProps
    );
    return eventoParseado;
  }

  cancelarSuscripciones() {
    if (this.firestoreSubscription) {
      this.firestoreSubscription.unsubscribe();
    }
  }

  eliminarReserva(id: string) {

    this.firestore
      .doc('eventos/' + id)
      .delete()
      .then((response) =>
        this.uiService.showSnackBar(
          'La reserva fue eliminada con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar eliminar la reserva: ' + error,
          null,
          3000
        )
      );
  }

}
