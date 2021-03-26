import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Subscription } from 'rxjs';
import { CheckIn } from 'src/app/Models/checkin.model';
import { CheckinService } from 'src/app/Services/checkin.service';
import { EmailService } from 'src/app/Services/email.service';
import { UploadFileFirebaseService } from 'src/app/Services/upload-file-firebase.service';
import { UIService } from 'src/app/Shared/ui.service';

@Component({
  selector: 'app-detalle-check-in',
  templateUrl: './detalle-check-in.component.html',
  styleUrls: ['./detalle-check-in.component.scss']
})
export class DetalleCheckInComponent implements OnInit {

  eventoId: string;
  sort: MatSort;
  checkInTab = new MatTableDataSource<CheckIn>();
  isLoading = false;
  isLoadingSubscription: Subscription;
  checkInSubscription: Subscription;
  checkIn: CheckIn;
  columnas: string[] = ['nombreCliente', 'fechaDesde', 'fechaHasta', 'sena', 'total', 'cabana'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.checkInTab.sort = this.sort;
  }

  constructor(
    private route: ActivatedRoute,
    private uiService: UIService,
    private checkInService: CheckinService,
    private emailService: EmailService,
    private _uploadFileService: UploadFileFirebaseService

  ) { }

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.route.params.subscribe(params => {
      this.eventoId = params.eventoId;
    });

    this.checkInSubscription = this.checkInService.checkInChanged.subscribe(
      (checkIns) => {
        checkIns.map(x => x.evento.start = this.convertDate(x.evento.start));
        checkIns.map(x => x.evento.end = this.convertDate(x.evento.end));

        let checkIn = checkIns.find(x => x.evento.id == this.eventoId);

        this.checkIn = checkIn;
        this.checkInTab.data.push(checkIn);

      }
    );

    this.checkInService.ObtenerCheckIn();

  }

  convertDate(date: any) {

    if (date.type === Date)
      return date;

    else

      return new Date(date.seconds * 1000 + date.nanoseconds / 1000000)

  }

  descargarComprobante(): void {
    const doc = new jsPDF();

    var img = new Image();
    img.src = 'assets/cabanas.jpeg';

    doc.addImage(img, 'jpeg', 140, 7, 60, 20);

    doc.setFont("italic");
    doc.text("Reserva a nombre de: " + this.checkIn.evento.extendedProps.cliente.nombre + ' ' + this.checkIn.evento.extendedProps.cliente.apellidos, 13, 40);
    autoTable(doc, { html: '#my-table', margin: { top: 45 } });

    doc.save(this.checkIn.id.toString() + '.pdf');

  }

  enviarEmailComprobante(): void {

    this._uploadFileService.getFile(this.checkIn.evento.id);
    // this.emailService.enviarEmailCheckIn(this.checkIn.evento.id, gs://tesis-a16ed.appspot.com/CheckIn/fhlSXeik9SuQ8qvUqJ2u);
  }

}
