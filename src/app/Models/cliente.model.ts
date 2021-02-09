import { BaseClass } from './baseClass.model';

export class Cliente extends BaseClass<Cliente> {
  id: number;
  dni: number;
  nombre: string;
  apellidos: string;
  telefono?: number;
  email?: string;
  fechaNacimiento?: Date;
  
}
