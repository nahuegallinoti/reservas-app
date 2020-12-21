import { BaseClass } from './baseClass.model';
import { Producto } from './producto.model';

export class Consumo extends BaseClass<Consumo> {
    id: number;
    cantidad: number;
    monto: number;
    producto: Producto;
    
  }