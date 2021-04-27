import { Cabana } from './cabana.model';
import { Cliente } from './cliente.model';
import { Estado } from './estado.model';
import { BaseClass } from './baseClass.model';

export class Reserva extends BaseClass<Reserva> {
  id: number;
  cabana?: Cabana;
  cliente?: Cliente;
  estado: Estado;
  cantOcupantes: number;
  codigoReserva: number;
  disabled: boolean;
  fechaCreacion: Date;
  fechaDesde: Date;
  fechaHasta: Date;
  montoSenia: number;
  montoTotal: number;
  cupon: number;
  realizoCheckIn: boolean;
  realizoCheckOut: boolean;
}
