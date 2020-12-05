import { Component} from '@angular/core';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
}

const ELEMENT_DATA: PeriodicElement[] = [
  {position: 1, name: 'Hydrogen', weight: 1.0079 },
  {position: 2, name: 'Helium', weight: 4.0026 },
  {position: 3, name: 'Lithium', weight: 6.941 },
  {position: 4, name: 'Beryllium', weight: 9.0122 },
  {position: 5, name: 'Boron', weight: 10.811 },
];

@Component({
  selector: 'app-consumos',
  templateUrl: './consumos.component.html',
  styleUrls: ['./consumos.component.css']
})
export class ConsumosComponent{
    
  displayedColumns: string[] = ['position', 'name', 'weight'];
  dataSource = ELEMENT_DATA;
}
