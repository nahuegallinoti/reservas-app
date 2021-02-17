import { Cliente } from "./cliente.model";
import { Estado } from "./estado.model";

export class SolicitudReserva {
    id: number;
    fechaDesde: Date;
    fechaHasta: Date;
    cantidadPersonas: number;
    cliente: Cliente;
    estado: Estado;
    costo: number;
    codigoReserva: number;
    disabled: boolean;
  }
