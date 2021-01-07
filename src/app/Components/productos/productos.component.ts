import { AfterViewChecked, AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/Models/producto.model';
import { ProductoService } from 'src/app/Services/producto.service';
import { UIService } from 'src/app/Shared/ui.service';
import { FormProductosComponent } from './form-productos/form-productos.component';

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css']
})
export class ProductosComponent implements OnInit, OnDestroy, AfterViewInit, AfterViewChecked {

  isLoading = false;
  productos = new MatTableDataSource<Producto>();
  productosSubscription: Subscription;
  isLoadingSubscription: Subscription;

  private sort: MatSort;
  private paginator: MatPaginator;

  columnas: string[] = ['descripcion', 'precio'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.productos.sort = this.sort;
    this.productos.paginator = this.paginator;
  }

  constructor(
    private productoService: ProductoService,
    private uiService: UIService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.productosSubscription = this.productoService.productosChanged.subscribe(
      (productos) => {
        this.productos.data = productos.map(e => e);
      }
    );
    this.productoService.buscarProductos();
  }

  ngAfterViewInit(): void {
    this.productos.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  filtrar(valor: string): void{
    this.productos.filter = valor.trim().toLowerCase();
  }

  ngOnDestroy(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormProductosComponent, {
      width: "30vw",
      height:"28vw",
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

}
