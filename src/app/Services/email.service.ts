import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmailCheckIn(codigoComprobante) {

    axios.post(environment.functionMailCheckIn,
      {
        destinatario: "nahuegallinoti@gmail.com",
        html: `<h3>Se realizó correctamente el check in.</h3>
        <h3>Puede consultar el estado de su reserva presionando sobre el link</h3> <a href="https://tesis-a16ed.web.app/">Portal de Reservas</a>         
        <h3>Ingresando el número de comprobante: `+codigoComprobante
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

}
