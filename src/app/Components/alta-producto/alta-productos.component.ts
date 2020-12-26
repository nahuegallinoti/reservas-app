import {Component} from '@angular/core';

export interface PeriodicElement {
  descripcion: string;
  precio: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {descripcion: "Coca/cola", precio: 123},

];

@Component({
  selector: 'alta-productos',
  templateUrl: './alta-productos.component.html',
  styleUrls: ['./alta-productos.component.css']
})

export class AltaProductosComponent{
  Columnas: string[] = ['descripcion', 'precio'];
  dataSource = ELEMENT_DATA;
  
}
