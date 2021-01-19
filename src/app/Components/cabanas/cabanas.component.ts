import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { Cabana } from 'src/app/Models/cabana.model';
import { CabanaService } from 'src/app/Services/cabana.service';
import { UIService } from 'src/app/Shared/ui.service';
import { FormCabanasComponent } from './form-cabanas/form-cabanas.component';

@Component({
  selector: 'app-cabanas',
  templateUrl: './cabanas.component.html',
  styleUrls: ['./cabanas.component.css']
})
export class CabanasComponent implements OnInit {

  isLoading = false;
  cabanas = new MatTableDataSource<Cabana>();
  cabanasSubscription: Subscription;
  isLoadingSubscription: Subscription;

  private sort: MatSort;
  private paginator: MatPaginator;

  columnas: string[] = ['nombre', 'capacidad', 'precioDia'];

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.cabanas.sort = this.sort;
    this.cabanas.paginator = this.paginator;
  }

  constructor(
    private cabanasService: CabanaService,
    private uiService: UIService,
    private dialog: MatDialog

  ) {}

  ngOnInit(): void {
    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );
    this.cabanasSubscription = this.cabanasService.cabanasChanged.subscribe(
      (eventos) => {
        this.cabanas.data = eventos.map(e => e);
      }
    );
    this.cabanasService.obtenerCabanias();
  }

  ngAfterViewInit(): void {
    this.cabanas.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  filtrar(valor: string): void{
    this.cabanas.filter = valor.trim().toLowerCase();
  }

  ngOnDestroy(): void {
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(FormCabanasComponent, {
      width: "30vw",
      height:"28vw",
    });

    dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }

}
