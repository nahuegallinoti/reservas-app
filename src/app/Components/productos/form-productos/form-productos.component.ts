import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UIService } from 'src/app/Shared/ui.service';
import { DialogData } from '../../consumos/form-consumos/form-consumos.component';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/Models/producto.model';
import { ProductoService } from 'src/app/Services/producto.service';

@Component({
  selector: 'app-form-productos',
  templateUrl: './form-productos.component.html',
  styleUrls: ['./form-productos.component.css']
})
export class FormProductosComponent implements OnInit {

  productosForm = this.formBuilder.group({
    descripcion: [null],    
    precio: [null],    
  });

  productos: Producto[] = [];

  constructor(private formBuilder: FormBuilder,
              public dialogRef: MatDialogRef<FormProductosComponent>,
              private uiService: UIService,
              private productoService: ProductoService,
              @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
          
  ngOnInit(): void {
  }

  guardarProducto() {

    this.resetForm();

    this.productoService.guardarProductos(this.productos);
    this.productoService.buscarProductos();
  }

  
  quitarProducto(producto) {
    const index: number = this.productos.indexOf(producto);

    if (index !== -1) {
      this.productos.splice(index, 1);
    }

    this.uiService.showSnackBar(
      'El producto se quitó de la lista.',
      null,
      3000
    );

  }

  agregarProducto() {

    let producto = new Producto();

    producto.descripcion = this.productosForm.value.descripcion;
    producto.precio = this.productosForm.value.precio;

    this.productos.push(producto);

    this.resetForm();
  }

  resetForm() {
    this.productosForm.reset();
  }


}
