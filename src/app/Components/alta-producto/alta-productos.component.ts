
import { AfterViewChecked } from '@angular/core';
import { AfterViewInit } from '@angular/core';
import { OnDestroy } from '@angular/core';
import { Component, OnInit} from '@angular/core';
import { Subscription } from 'rxjs';
import { ViewChild } from '@angular/core';

import { Producto } from 'src/app/Models/producto.model';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';


import { UIService } from 'src/app/Shared/ui.service';
import { ProductoService } from 'src/app/Services/producto.service';




@Component({
  selector: 'alta-productos',
  templateUrl: './alta-productos.component.html',
  styleUrls: ['./alta-productos.component.css']
})

export class AltaProductosComponent implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy{
  
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
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
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

  ngOnDestroy(): void {
  }

}
