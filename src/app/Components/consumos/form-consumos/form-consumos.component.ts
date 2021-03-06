// import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder } from '@angular/forms';
import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';
import { ProductoService } from 'src/app/Services/producto.service';
import { Subscription } from 'rxjs';
import { Producto } from 'src/app/Models/producto.model';
import { Consumo, ItemConsumo } from 'src/app/Models/consumo.model';
import { ConsumoService } from 'src/app/Services/consumo.service';
import { Reserva } from 'src/app/Models/reserva.model';
import { UIService } from 'src/app/Shared/ui.service';
import { HttpClient } from '@angular/common/http';
import { EmailService } from 'src/app/Services/email.service';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export interface DialogData {
  reserva: Reserva;
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
  selectedProducto: Producto;

  consumosSubscription: Subscription;
  consumo: Consumo = new Consumo();

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
    private consumoService: ConsumoService,
    private emailService: EmailService,
    private uiService: UIService,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {

    this.consumo.reserva = this.data.reserva;

    this.productosSubscription = this.productoService.productosChanged.subscribe(
      (productos) => {
        productos.map((producto) => producto.precio = Number(producto.precio));
        this.productos = productos;
      }
    );

    this.consumosSubscription = this.consumoService.consumosChanged.subscribe(
      (consumos) => {
        let consumosReserva = consumos.find(x => x.reserva.id == this.data.reserva.id);

        if (consumosReserva != undefined) {

          this.consumo = consumosReserva;
        }

      }
    );

    this.productoService.buscarProductos();
    this.consumoService.obtenerConsumosAnteriores();

  }

  ngOnDestroy(): void {

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

  quitarConsumo(consumo) {
    const index: number = this.consumo.consumos.indexOf(consumo);

    if (index !== -1) {
      this.consumo.consumos.splice(index, 1);
    }

    this.uiService.showSnackBar(
      'El consumo se quitó de la lista.',
      null,
      3000
    );

  }

  agregarConsumo() {

    let itemConsumo = new ItemConsumo();

    itemConsumo.producto = this.selectedProducto;

    itemConsumo.cantidad = this.cantidadSelected;
    this.cantidadSelected = 1;

    itemConsumo.monto = Number(this.consumosForm.value.total);

    itemConsumo.fecha = new Date();

    this.consumo.consumos.push(itemConsumo);

    this.resetForm();
  }

  calcularSubTotal() {

    if (this.selectedProducto.precio == undefined || this.cantidadSelected == undefined)
      return;

    const subtotal = this.selectedProducto.precio * this.cantidadSelected;

    this.consumosForm.controls.total.setValue(subtotal);

  }

  guardarConsumos() {

    this.resetForm();

    this.consumoService.guardarConsumo(this.consumo);
    this.consumoService.obtenerConsumosAnteriores();
  }

  imprimirComprobante(consumo: any): void {
    const doc = new jsPDF();

    var img = new Image();
    img.src = 'assets/cabanas.jpeg';

    doc.addImage(img, 'jpeg', 140, 7, 60, 20);

    doc.setFontSize(20);
    doc.text("Comprobante de consumo", 13, 40);

    doc.setFontSize(15);
    doc.setFont("italic");
    doc.text("Producto: " + consumo.producto.descripcion, 13, 60);
    doc.text("Precio Individual: $ " + consumo.producto.precio, 13, 70);
    doc.text("Cantidad: " + consumo.cantidad, 13, 80);    
    doc.text("Monto Total: $ " + consumo.monto, 13, 90);
    doc.text("Fecha: " + new Date(consumo.fecha).toLocaleDateString(), 13, 110);
    doc.text("Firma ____________________", 80, 140);
    doc.text("Aclaración _______________", 80, 160);


    doc.save(consumo.producto.id.toString() + '.pdf');

  }


}