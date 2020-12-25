import { BaseClass } from './baseClass.model';
import { Producto } from './producto.model';
import { Reserva } from './reserva.model';

export class Consumo extends BaseClass<Consumo> {
    id: number;
    reserva: Reserva;
    consumos: ItemConsumo[] = [];
  }

  export class ItemConsumo extends BaseClass<ItemConsumo> {
    producto: Producto;
    cantidad: number;
    monto: number;
    fecha: Date;

  }