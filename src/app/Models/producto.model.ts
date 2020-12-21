import { Cabana } from './cabana.model';
import { BaseClass } from './baseClass.model';
import { Reserva } from './reserva.model'



export class Producto extends BaseClass<Producto>{
    id: number;
    descripcion: string;
    precio: number;
}

