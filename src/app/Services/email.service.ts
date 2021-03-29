import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';
import { CheckIn } from '../Models/checkin.model';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmailCheckIn(urlArchivoPdf) {

    axios.post(environment.functionMailCheckIn,
      {
        destinatario: "nahuegallinoti@gmail.com",
        html: `<h3>Se realizó correctamente el check in.</h3>`,
        urlPdf: urlArchivoPdf
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  enviarEmailConfirmacionReserva(fechaVencimiento, montoSena, destinatario) {

    axios.post(environment.functionMailConfirmarReserva,
      {
        destinatario: destinatario,
        html: `<h3>Su reserva ha sido confirmada.</h3>
        <p>Tiene tiempo hasta el día: `+ fechaVencimiento + ` para realizar el pago de la seña con monto mínimo de: ` + montoSena + `</p>
        <p>Recuerde que puede consultar el detalle de su reserva con el código que le enviamos anteriormente!</p>`
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  enviarEmailRechazoReserva(destinatario) {

    axios.post(environment.functionMailRechazarReserva,
      {
        destinatario: destinatario,
        html: `<h3>Su reserva ha sido rechazada ya que no hay disponibilidad en la fecha seleccionada.</h3>`
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  enviarEmailCancelacionReserva(destinatario) {

    axios.post(environment.functionMailCancelarReserva,
      {
        destinatario: destinatario,
        html: `<h3>Su reserva ha sido cancelada ya que no se realizó el pago de la seña en la fecha indicada.</h3>`
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });
  }





}
