import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Subject, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Producto } from '../Models/producto.model';
import { UIService } from '../Shared/ui.service';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private productos: Producto[] = [];
  private firestoreSubscription: Subscription;
  productosChanged = new Subject<Producto[]>();

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService
  ) { }

  buscarProductos() {
    this.uiService.loadingStateChanged.next(true);
    this.firestoreSubscription = this.firestore
      .collection('producto')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc: any) => {
            const producto = doc.payload.doc.data();
            const id = doc.payload.doc.id;

            producto.id = id;
            producto.descripcion = producto.descripcion;
            producto.precio = producto.precio;

            return producto;
          });
        })
      )
      .subscribe(
        (productos: Producto[]) => {
          this.productos = productos;
          this.productosChanged.next([...this.productos]);
          this.uiService.loadingStateChanged.next(false);
        },
        (error) => {
          this.uiService.showSnackBar(
            'Hubo un error al intentar obtener los productos, por favor intente de nuevo',
            null,
            3000
          );
          this.uiService.loadingStateChanged.next(false);
        }
      );
  }

}