// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  firebase: {
    apiKey: "AIzaSyD45fP4i-8GEZhc1niTsJpmakZOtWOZZf0",
    authDomain: "tesis-a16ed.firebaseapp.com",
    databaseURL: "https://tesis-a16ed.firebaseio.com",
    projectId: "tesis-a16ed",
    storageBucket: "tesis-a16ed.appspot.com",
    messagingSenderId: "538530200137",
    appId: "1:538530200137:web:d464cc16c055bc893a9d98",
    measurementId: "G-KRQPFRXH9Q"
  },
  functionMailCheckIn: "https://us-central1-tesis-a16ed.cloudfunctions.net/appMail/sendMailRegistroCheckInReserva",
  functionMailConfirmarReserva: "https://us-central1-tesis-a16ed.cloudfunctions.net/appMail/sendMailConfirmarReserva",
  functionMailRechazarReserva: "https://us-central1-tesis-a16ed.cloudfunctions.net/appMail/sendMailRechazarReserva",
  functionMailCancelarReserva: "https://us-central1-tesis-a16ed.cloudfunctions.net/appMail/sendMailCancelarReserva"


};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
