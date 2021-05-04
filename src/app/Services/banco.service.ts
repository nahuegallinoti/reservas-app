import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Bancos } from '../Models/banco.model'
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class BancosService {

  private bancos: Bancos[] = [];
  private firestoreSubscription: Subscription;
  bancosChanged = new Subject<Bancos[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  ObtenerFormasPago() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('bancos')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const bancos = doc.payload.doc.data();
            const id = doc.payload.doc.id;

            bancos.id = id;
            bancos.descripcion = bancos.descripcion;

            return bancos;
          });
        })
      )
      .subscribe(
        (bancos: Bancos[]) => {
          this.bancos = bancos;
          this.bancosChanged.next([...this.bancos]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener las formas de pago, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }
}
