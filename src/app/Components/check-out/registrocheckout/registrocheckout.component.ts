import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Consumo, ItemConsumo } from 'src/app/Models/consumo.model';
import { ConsumoService } from 'src/app/Services/consumo.service';
import { ReservaService } from 'src/app/Services/evento.service';
import { UIService } from 'src/app/Shared/ui.service';

@Component({
  selector: 'app-registrocheckout',
  templateUrl: './registrocheckout.component.html',
  styleUrls: ['./registrocheckout.component.css']
})
export class RegistrocheckoutComponent implements OnInit {

  consumosSubscription: Subscription;
  consumo = new MatTableDataSource<ItemConsumo>();
  consumos: Consumo;
  reservaId: number;
  isLoading = false;
  isLoadingSubscription: Subscription;
  columnas: string[] = ['descripcion', 'precio'];
  total: number = 0;
  eventosSubscription: Subscription;
  eventos = [];

  private sort: MatSort;
  private paginator: MatPaginator;

  @ViewChild(MatSort) set matSort(ms: MatSort) {
    this.sort = ms;
    this.setDataSourceAttributes();
  }

  @ViewChild(MatPaginator) set matPaginator(mp: MatPaginator) {
    this.paginator = mp;
    this.setDataSourceAttributes();
  }

  setDataSourceAttributes() {
    this.consumo.sort = this.sort;
    this.consumo.paginator = this.paginator;
  }

  constructor(
    private consumoService: ConsumoService,    
    private route: ActivatedRoute,
    private uiService: UIService,
    private reservaService: ReservaService,
    ) { }

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.route.params.subscribe(params => {      
      this.reservaId = params.reservaId;
    });

    this.eventosSubscription = this.reservaService.eventosChanged.subscribe(
      (eventos) => {
        this.eventos = eventos;
      }
    );


    this.consumosSubscription = this.consumoService.consumosChanged.subscribe(
      (consumos) => {
        let consumosReserva = consumos.find(x => x.reserva.id == this.reservaId);

        if (consumosReserva != undefined) {
          this.consumo.data = consumosReserva.consumos.map(x => x);
          this.consumos = consumosReserva;
          this.consumos.consumos.map(x => this.total += x.monto);
        }


      }
    );

    this.consumoService.obtenerConsumosAnteriores();
    this.reservaService.buscarEventos();

  }

  ngAfterViewInit(): void {
    this.consumo.sort = this.sort;
  }

  ngAfterViewChecked(): void {
    if (!this.isLoading && this.isLoadingSubscription) {
      this.isLoadingSubscription.unsubscribe();
    }
  }

  filtrar(valor: string): void{
    this.consumo.filter = valor.trim().toLowerCase();
  }

  
  guardarCheckout(): void{    
    let evento = this.eventos.find(x => x.id == this.reservaId);
    evento.extendedProps.realizoCheckOut = true;
    this.reservaService.actualizarReserva(this.reservaId.toString(), evento);
  }

}
