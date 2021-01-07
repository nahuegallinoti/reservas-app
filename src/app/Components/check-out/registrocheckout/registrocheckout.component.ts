import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Consumo } from 'src/app/Models/consumo.model';
import { ConsumoService } from 'src/app/Services/consumo.service';
import { UIService } from 'src/app/Shared/ui.service';

@Component({
  selector: 'app-registrocheckout',
  templateUrl: './registrocheckout.component.html',
  styleUrls: ['./registrocheckout.component.css']
})
export class RegistrocheckoutComponent implements OnInit {

  consumosSubscription: Subscription;
  consumo = new MatTableDataSource<Consumo>();
  consumos: Consumo;
  reservaId: number;
  isLoading = false;
  isLoadingSubscription: Subscription;
  columnas: string[] = ['descripcion', 'precio'];
  total: number = 0;

  constructor(
    private consumoService: ConsumoService,    
    private route: ActivatedRoute,
    private uiService: UIService) { }

  ngOnInit(): void {

    this.isLoadingSubscription = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => (this.isLoading = isLoading)
    );

    this.route.params.subscribe(params => {      
      this.reservaId = params.reservaId;
    });

    this.consumosSubscription = this.consumoService.consumosChanged.subscribe(
      (consumos) => {
        let consumosReserva = consumos.find(x => x.reserva.id == this.reservaId);

        if (consumosReserva != undefined) {
          this.consumos = consumosReserva;
          this.consumos.consumos.map(x => this.total += x.monto);
        }


      }
    );

    this.consumoService.obtenerConsumosAnteriores();

  }

  filtrar(valor: string): void{
    this.consumo.filter = valor.trim().toLowerCase();
  }



}
