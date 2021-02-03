import { Cliente } from "./cliente.model";
import { Estado } from "./estado.model";

export class SolicitudReserva {
    id: number;
    fechaDesde: Date;
    fechaHasta: Date;
    cantidadPersonas: number;
    cliente: DatosClienteSolicitud;
    estado: Estado;
  }

  
export class DatosClienteSolicitud {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: number;
  email: string;
}
