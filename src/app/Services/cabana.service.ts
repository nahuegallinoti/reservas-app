import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Cabana } from '../Models/cabana.model';
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class CabanaService {

  private cabanas: Cabana[] = [];
  private firestoreSubscription: Subscription;
  cabanasChanged = new Subject<Cabana[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  obtenerCabanias() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('cabanias')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const cabana = doc.payload.doc.data();
            const id = doc.payload.doc.id;
            
            cabana.id = id;
            cabana.nombre = cabana.nombre;
            cabana.capacidad = cabana.capacidad;
            cabana.precioDia = cabana.precioDia;

            return cabana;
          });
        })
      )
      .subscribe(
        (cabanas: Cabana[]) => {
          this.cabanas = cabanas;
          this.cabanasChanged.next([...this.cabanas]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener las cabañas, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

  guardarCabanas(cabanas: Cabana []) {

    const cabanasParse = cabanas.map((obj) => { return Object.assign({}, obj) });

    cabanasParse.forEach((obj) => {
      this.firestore
      .collection('cabanias')
      .add(obj)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se registraron las cabañas con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar guardar las cabañas: ' + error,
          null,
          3000
        )
      );

    })

  }

  actualizarCabana(id: number, cabana: Cabana) {

    const cabanaParse = Object.assign({}, cabana);

    this.firestore
      .doc('cabanias/' + id)
      .set(cabanaParse)
      .then((response) =>
        this.uiService.showSnackBar(
          'Se actualizaron los datos de la cabaña con éxito',
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

  eliminarCabana(id: number) {

    this.firestore
      .doc('cabanias/' + id)
      .delete()
      .then((response) =>
        this.uiService.showSnackBar(
          'La cabaña fue eliminada con éxito',
          null,
          3000
        )
      )
      .catch((error) =>
        this.uiService.showSnackBar(
          'Ocurrió un error al intentar eliminar la cabaña: ' + error,
          null,
          3000
        )
      );
  }

}