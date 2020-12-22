import {Component} from '@angular/core';

export interface PeriodicElement {
  producto: string;
  precio: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {producto: "Coca/cola", precio: 123},

];

@Component({
  selector: 'alta-productos',
  templateUrl: './alta-productos.component.html',
  styleUrls: ['./alta-productos.component.css']
})

export class AltaProductosComponent{
  displayedColumns: string[] = ['position', 'name'];
  dataSource = ELEMENT_DATA;
  
}
