import { Component} from '@angular/core';
import { Consumos } from 'src/app/Models/consumos.model';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';


export interface fakeData {
  descripcion: string;
  monto: number;
  cabana: string;
  fecha: Date
}

const DATA: fakeData[] = [
  {descripcion: 'FrigoBar', monto: 1234, cabana: 'azul', fecha: new Date()},
  {descripcion: 'Limpieza', monto: 789, cabana: 'blanca', fecha: new Date()},
  {descripcion: 'Cartas', monto: 654, cabana: 'verde', fecha: new Date()},
  // {position: 2, name: 'Helium', weight: 4.0026 },
  // {position: 3, name: 'Lithium', weight: 6.941 },
  // {position: 4, name: 'Beryllium', weight: 9.0122 },
  // {position: 5, name: 'Boron', weight: 10.811 },
];

@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.css']
})
export class ConsumosComponent{
    
  displayedColumns: string[] = ['descripcion', 'monto', 'cabana','fecha'];
  dataSource = DATA;
}
