import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { UIService } from 'src/app/Shared/ui.service';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Producto } from 'src/app/Models/producto.model';
import { ProductoService } from 'src/app/Services/producto.service';


export interface DialogDataProducto {
  producto: Producto;
}


@Component({
  selector: 'app-form-productos',
  templateUrl: './form-productos.component.html',
  styleUrls: ['./form-productos.component.css'],
})

export class FormProductosComponent implements OnInit {
  productosForm = this.formBuilder.group({
    descripcion: [null],
    precio: [0],
  });

  idProducto: number;

  productos: Producto[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormProductosComponent>,
    private uiService: UIService,
    private productoService: ProductoService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataProducto
  ) {}

  ngOnInit(): void {  

    
    if (this.data?.producto != null) {
    this.productosForm.setValue({
      descripcion: this.data.producto.descripcion,
      precio: this.data.producto.precio,
    })

    this.idProducto = this.data.producto.id;
  }
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

    if (producto.descripcion != null && producto.precio != null) {
      this.productos.push(producto);

      this.resetForm();
    }
  }

  editarProducto() {
    let producto = new Producto();

    producto.descripcion = this.productosForm.value.descripcion;
    producto.precio = Number(this.productosForm.value.precio);

    if (producto.descripcion != null && producto.precio != null)
      this.productoService.editarProducto(this.idProducto, producto)

    else
    {
      this.uiService.showSnackBar(
        "Ocurrió un error al intentar editar los datos del producto" + null,
        null,
        3000
      );

    }
    this.dialogRef.close();
  }

  resetForm() {
    this.productosForm.reset();
  }

}
