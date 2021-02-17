import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/storage';
import { jsPDF } from 'jspdf';

@Injectable({
  providedIn: 'root'
})
export class UploadFileFirebaseService {

  constructor() { }

  uploadFile(docPdf: jsPDF, name: string) {

    var blobPdf = new Blob([docPdf.output('blob')], { type: 'application/pdf' });
    const storageRef = firebase.storage().ref();

    const uploadTask = storageRef.child(`CheckIn/${name}`).put((blobPdf));

    uploadTask.on(firebase.storage.TaskEvent.STATE_CHANGED,
      (snapshot: firebase.storage.UploadTaskSnapshot) => { },
      (error) => {
        console.error('Error al subir' + error);
      },
      () => {
        console.log('Se almacenó el check in en storage');
        console.log(uploadTask.snapshot);
        uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
          console.log(downloadURL);
        });
      });
  }

  getFile(name: string) {
    var storageRef = firebase.storage().ref('CheckIn/' + name + '.pdf');
    storageRef.getDownloadURL().then(function(url) {

      console.log(url);
    }).catch(function(error) {
      // Handle any errors
    });
    console.log(storageRef);
  }


}
