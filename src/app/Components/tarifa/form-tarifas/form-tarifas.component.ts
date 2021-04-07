import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Tarifa } from 'src/app/Models/tarifa.model';
import { TarifaService } from 'src/app/Services/tarifa.service';
import { UIService } from 'src/app/Shared/ui.service';

export interface DialogDataTarifa {
  tarifa: Tarifa;
}

@Component({
  selector: 'app-form-tarifas',
  templateUrl: './form-tarifas.component.html',
  styleUrls: ['./form-tarifas.component.css']
})
export class FormTarifasComponent implements OnInit {

  tarifaForm = this.formBuilder.group({
    descripcion: [null],
    precioDia: [0],
    fechaDesde: [null],
    fechaHasta: [null]
  });

  idTarifa: number;

  tarifas: Tarifa[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormTarifasComponent>,
    private uiService: UIService,
    private tarifaService: TarifaService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataTarifa
  ) {}

  ngOnInit(): void {
    if (this.data?.tarifa != null) {
      this.tarifaForm.setValue({
        descripcion: this.data.tarifa.descripcion,
        precioDia: this.data.tarifa.precioDia,
        fechaDesde: this.data.tarifa.fechaDesde,
        fechaHasta: this.data.tarifa.fechaHasta
      })
  
      this.idTarifa = this.data.tarifa.id;
    }
  }

  guardarTarifa() {
    let tarifa = new Tarifa();

    tarifa.descripcion = this.tarifaForm.value.descripcion;
    tarifa.precioDia = Number(this.tarifaForm.value.precioDia);
    tarifa.fechaDesde = new Date(this.tarifaForm.value.fechaDesde);
    tarifa.fechaHasta = new Date(this.tarifaForm.value.fechaHasta);

    this.tarifaService.guardarTarifa(tarifa);

    this.resetForm();
    this.dialogRef.close();

    this.tarifaService.buscarTarifas();
    
  }

  editarTarifa() {
    let tarifa = new Tarifa();

    tarifa.descripcion = this.tarifaForm.value.descripcion;
    tarifa.precioDia = Number(this.tarifaForm.value.precioDia);
    tarifa.fechaDesde = new Date(this.tarifaForm.value.fechaDesde);
    tarifa.fechaHasta = new Date(this.tarifaForm.value.fechaHasta);

    if (tarifa.descripcion != null && tarifa.precioDia != null)
      this.tarifaService.editarTarifa(this.idTarifa, tarifa)

    else
    {
      this.uiService.showSnackBar(
        "Ocurrió un error al intentar editar los datos de la tarifa" + null,
        null,
        3000
      );

    }
    this.dialogRef.close();
  }

  resetForm() {
    this.tarifaForm.reset();
  }

}

