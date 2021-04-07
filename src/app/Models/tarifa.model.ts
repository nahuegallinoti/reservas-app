import { BaseClass } from './baseClass.model';

export class Tarifa extends BaseClass<Tarifa> {
    id: number;
    descripcion: string;
    fechaDesde: Date;
    fechaHasta: Date;
    precioDia: number;
}