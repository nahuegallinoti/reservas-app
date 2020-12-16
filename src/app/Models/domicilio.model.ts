import { BaseClass } from './baseClass.model';

export class Domicilio extends BaseClass<Domicilio> {
  pais: number;
  provincia: string;
  barrio: number;
  calle?: string;
  numero?: number;
  departamento?: string;
  }