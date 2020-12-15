import { Cabana } from './cabana.model';
import { BaseClass } from './baseClass.model';
import { Reserva } from './reserva.model'


export class Consumos extends BaseClass<Consumos>{
    descripcion: string;
    monto: number;
    cabana: Cabana;
    fecha: Date;
    reserva: Reserva;
}

