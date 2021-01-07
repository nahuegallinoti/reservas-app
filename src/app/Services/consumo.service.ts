import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Consumo } from '../Models/consumo.model';
import { UIService } from '../Shared/ui.service';
import * as moment from 'moment';

@Injectable({
  providedIn: 'root'
})
export class ConsumoService {

  private consumos: Consumo[];
  private firestoreSubscription: Subscription;
  consumosChanged = new Subject<Consumo[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService,
  ) { }

  guardarConsumo(consumo: Consumo) {

    this.obtenerConsumosAnteriores();

    let consumosReserva = this.consumos.find(x => x.reserva.id == consumo.reserva.id);

    console.log(consumosReserva);

    const itemsConsumo = consumo.consumos.map((obj) => { return Object.assign({}, obj) });
    const consum: Object = {
      reserva: consumo.reserva,
      consumos: itemsConsumo
    };

    if (consumosReserva == undefined)
      this.crearNuevoConsumo(consum);

    else
      this.actualizarConsumo(consum);

  }

  crearNuevoConsumo(consum) {
    this.firestore
      .collection('consumos')
      .add(consum)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se registró el consumo con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar guardar el consumo: ' + error,
          null,
          3000
        )
      );
  }


  actualizarConsumo(consum) {

    let consumosReserva = this.consumos.find(x => x.reserva.id == consum.reserva.id);

    this.firestore
      .doc('consumos/' + consumosReserva.id)
      .set(consum)
      .then((response) => {
        this.uiService.showSnackBar(
          'Se registró el consumo con éxito',
          null,
          3000
        )

      })
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar guardar el consumo: ' + error,
          null,
          3000
        )
      );
    }

  obtenerConsumosAnteriores() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('consumos')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const consumo = doc.payload.doc.data();
            const id = doc.payload.doc.id;

            consumo.id = id;
            consumo.reserva = consumo.reserva;

            consumo.consumos.map(consumo => consumo.fecha = moment(consumo.fecha.toDate()).format('L'));
            consumo.consumos = consumo.consumos;

            return consumo;
          });
        })
      )
      .subscribe(
        (consumos: Consumo[]) => {
          this.consumos = consumos;
          this.consumosChanged.next([...this.consumos]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener los consumos, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

}
