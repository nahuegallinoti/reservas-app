import { BaseClass } from './baseClass.model';

export class Cabana extends BaseClass<Cabana> {
    id: number;
    nombre: string;
    checked: boolean;
    capacidad: number;
    precioDia: number;
    numero: number;
  }
  