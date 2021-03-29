import { Reserva } from './reserva.model';

export class Evento {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: Reserva;
  backgroundColor: string;
}
