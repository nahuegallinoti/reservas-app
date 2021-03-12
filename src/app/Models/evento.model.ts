import { Reserva } from './reserva.model';
import { BaseClass } from './baseClass.model';
import { SolicitudReserva } from './solicitudReserva.model';

export class Evento {
  id?: string;
  title: string;
  start: Date;
  end: Date;
  extendedProps: Reserva;
  backgroundColor: string;
  solicitudReserva?: SolicitudReserva;
}
