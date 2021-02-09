import { Estado } from "./estado.model";

export class SolicitudReserva {
    id: number;
    fechaDesde: Date;
    fechaHasta: Date;
    cantidadPersonas: number;
    cliente: DatosClienteSolicitud;
    estado: Estado;
    costo: number;
    codigoReserva: number;
    disabled: boolean;
  }

  
export class DatosClienteSolicitud {
  id: number;
  nombre: string;
  apellidos: string;
  telefono: number;
  email: string;
  nroDocumento: number;
}
