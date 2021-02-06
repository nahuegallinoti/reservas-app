import { Injectable } from '@angular/core';
import axios from 'axios';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmailService {

  constructor() { }

  enviarEmail(consumo) {

    axios.post(environment.functionMailCheckIn,
      {
        dest: "nahuegallinoti@gmail.com",
        data: consumo
      })
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        console.log(error);
      });

  }
}
