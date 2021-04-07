import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { Tarifa } from '../Models/tarifa.model';
import { UIService } from '../Shared/ui.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root' // ? 
})
export class TarifaService {

  private tarifas: Tarifa[] = [];
  private firestoreSubscription: Subscription;
  tarifasChanged = new Subject<Tarifa[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  buscarTarifas() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('tarifas')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const tarifa = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            tarifa.id = id;
            tarifa.precioDia = tarifa.precioDia;
            // Parse dates
            tarifa.fechaDesde = tarifa.fechaDesde.toDate();
            tarifa.fechaHasta = tarifa.fechaHasta.toDate();

            return tarifa;
          });
        })
      )
      .subscribe(
        (tarifas: Tarifa[]) => {
          this.tarifas = tarifas;
          this.tarifasChanged.next([...this.tarifas]);
          this.uiService.loadingStateChanged.next(false);

        },
        (error) => {
          this.uiService.showSnackBar(
            error.message,
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

  eliminarTarifa(id: number) {

    this.firestore
      .doc('tarifas/' + id)
      .delete()
      .then((response) =>
        this.uiService.showSnackBar(
          'La tarifa fue eliminada con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar eliminar la tarifa: ' + error,
          null,
          3000
        )
      );
  }

  guardarTarifa(tarifa: Tarifa) {

    const tarifaParse = Object.assign({}, tarifa);

    this.firestore
      .collection('tarifas')
      .add(tarifaParse)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se guardó la tarifa con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar guardar la tarifa: ' + error,
          null,
          3000
        )
      );

  }

  editarTarifa(id: number, tarifa: Tarifa) {

    const tarifaParse = Object.assign({}, tarifa);

    this.firestore
      .doc('tarifas/' + id)
      .set(tarifaParse)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se actualizaron los datos de la tarifa con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar actualizar la tarifa: ' + error,
          null,
          3000
        )
      );
  }

}