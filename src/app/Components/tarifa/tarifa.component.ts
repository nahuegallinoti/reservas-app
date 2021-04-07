import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Tarifa } from 'src/app/Models/tarifa.model';
import { TarifaService } from 'src/app/Services/tarifa.service';
import { UIService } from 'src/app/Shared/ui.service';
import { ConfirmationDialogComponent } from '../Shared/Confirmation/confirmation-dialog/confirmation-dialog.component';
import { FormTarifasComponent } from './form-tarifas/form-tarifas.component';

@Component({
  selector: 'app-tarifa',
  templateUrl: './tarifa.component.html',
  styleUrls: ['./tarifa.component.css']
})
export class TarifaComponent implements OnInit {

  isLoading = false;
  tarifas = new MatTableDataSource<Tarifa>();
  tarifasSubscription: Subscription;
  isLoadingSubscription: Subscription;

  private sort: MatSort;
  private paginator: MatPaginator;

  columnas: string[] = ['descripcion', 'precioDia', 'fechaDesde', 'fechaHasta', 'acciones'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.tarifas.sort = this.sort;
    this.tarifas.paginator = this.paginator;
  }

  constructor(
    private tarifaService: TarifaService,
    private uiService: UIService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.tarifasSubscription = this.tarifaService.tarifasChanged.subscribe(
      (productos) => {
        this.tarifas.data = productos.map(e => e);
      }
    );
    this.tarifaService.buscarTarifas();

  }

  ngAfterViewInit(): void {
    this.tarifas.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  ngOnDestroy(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormTarifasComponent, {
      width: "35vw",
      height: "31vw",
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDialogEditTarifa(tarifa: Tarifa): void {
    const dialogRef = this.dialog.open(FormTarifasComponent, {
      width: "30vw",
      height: "28vw",
      data: {
        tarifa: tarifa,
      }

    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

  openDialogEliminarTarifa(idTarifa: number): void {

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: "25vw",
      height: "9vw",
      data: "¿Desea eliminar la tarifa?",
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.tarifaService.eliminarTarifa(idTarifa);
      }
    });
  }

  
  filtrar(valor: string): void{
    this.tarifas.filter = valor.trim().toLowerCase();
  }

}