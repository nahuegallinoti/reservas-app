// import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild, Inject, OnDestroy } from '@angular/core';


import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { ProductoService } from 'src/app/Services/producto.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/Models/producto.model';
import { ReturnStatement, ThisReceiver } from '@angular/compiler';
import { Consumo } from 'src/app/Models/consumo.model';


export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-form-consumos',
  templateUrl: './form-consumos.component.html',
  styleUrls: ['./form-consumos.component.css']
})

export class FormConsumosComponent implements OnInit, OnDestroy {
  faPen = faPen;
  faDollarSign = faDollarSign;
  faArchive = faArchive;
  productosSubscription: Subscription;
  productos: Producto[] = [];
  consumos: Consumo[] = [];
  selectedProducto: Producto;

  cantidades: number[] = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  cantidadSelected: 1;

  consumosForm = this.formBuilder.group({
    descripcion: [null],
    cantidad: [null],
    monto: [null],
    total: [0]
  });

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormConsumosComponent>,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
    this.productosSubscription = this.productoService.productosChanged.subscribe(
      (productos) => {
        this.productos = productos;
      }
    );

    this.productoService.buscarProductos();

  }

  ngOnDestroy(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  resetForm() {
    this.consumosForm.reset();
  }

  onConsumoChange(consumo) {
    this.selectedProducto = consumo.value;
  }

  onCantidadChange(cantidad) {
    this.cantidadSelected = cantidad.value;
  }


  agregarConsumo() {
    let consumo = new Consumo();

    consumo.producto = this.selectedProducto;

    consumo.cantidad = this.cantidadSelected;
    this.cantidadSelected = 1;

    let subtotal = consumo.producto.precio * consumo.cantidad;
    consumo.monto = subtotal;

    console.log(consumo);
    this.consumos.push(consumo);
    console.log(this.consumos);
    this.resetForm();
  }

  calcularSubTotal() {

    if (this.selectedProducto.precio == undefined || this.cantidadSelected == undefined)
      return;

    const subtotal = this.selectedProducto.precio * this.cantidadSelected;

    this.consumosForm.controls.total.setValue(subtotal);

  }

  guardarConsumos() {
    //Guardar consumos
    this.resetForm();
  }

}