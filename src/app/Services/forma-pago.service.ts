import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormaPago } from '../Models/formaPago.model';
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class FormaPagoService {

  private formasPago: FormaPago[] = [];
  private firestoreSubscription: Subscription;
  formasPagoChanged = new Subject<FormaPago[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  ObtenerFormasPago() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('formaPago')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const formaPago = doc.payload.doc.data();
            const id = doc.payload.doc.id;

            formaPago.id = id;
            formaPago.descripcion = formaPago.descripcion;

            return formaPago;
          });
        })
      )
      .subscribe(
        (formasPago: FormaPago[]) => {
          this.formasPago = formasPago;
          this.formasPagoChanged.next([...this.formasPago]);
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
