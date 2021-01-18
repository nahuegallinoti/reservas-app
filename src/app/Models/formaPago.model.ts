import { Reserva } from './reserva.model';
import { BaseClass } from './baseClass.model';

export class FormaPago extends BaseClass<FormaPago>{
  id: number;
  descripcion: string;
}
