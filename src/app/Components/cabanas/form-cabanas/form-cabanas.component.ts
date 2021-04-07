import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cabana } from 'src/app/Models/cabana.model';
import { CabanaService } from 'src/app/Services/cabana.service';
import { UIService } from 'src/app/Shared/ui.service';


export interface DialogDataCabana {
  cabana: Cabana;
}

@Component({
  selector: 'app-form-cabanas',
  templateUrl: './form-cabanas.component.html',
  styleUrls: ['./form-cabanas.component.css']
})

export class FormCabanasComponent implements OnInit {
  cabanasForm = this.formBuilder.group({
    nombre: [null],
    capacidad: [null],
    precioDia: [0]
  });

  idCabania: number;
  numeroCabana: number;

  cabanas: Cabana[] = [];

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormCabanasComponent>,
    private uiService: UIService,
    private cabanasService: CabanaService,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataCabana
  ) { }

  ngOnInit(): void {

    if (this.data.cabana != null) {
      this.cabanasForm.setValue({
        nombre: this.data.cabana.nombre,
        capacidad: this.data.cabana.capacidad,
        precioDia: this.data.cabana.precioDia
      })

      this.idCabania = this.data.cabana.id;
      this.numeroCabana = this.data.cabana.numero;
    }
  }

  guardarCabana() {
    this.resetForm();

    this.cabanasService.guardarCabanas(this.cabanas);
    this.cabanasService.obtenerCabanias();
  }

  quitarCabana(cabana) {
    const index: number = this.cabanas.indexOf(cabana);

    if (index !== -1) {
      this.cabanas.splice(index, 1);
    }

    this.uiService.showSnackBar(
      'La cabaña se quitó de la lista.',
      null,
      3000
    );
  }

  agregarCabana() {
    let cabana = new Cabana();

    cabana.nombre = this.cabanasForm.value.nombre;
    cabana.capacidad = Number(this.cabanasForm.value.capacidad);
    cabana.precioDia = Number(this.cabanasForm.value.precioDia);
    cabana.numero = Math.floor(Math.random() * 100);

    if (cabana.nombre != null && cabana.precioDia != null) {
      this.cabanas.push(cabana);

      this.resetForm();
    }
  }

  editarCabana() {
    let cabana = new Cabana();

    cabana.nombre = this.cabanasForm.value.nombre;
    cabana.capacidad = Number(this.cabanasForm.value.capacidad);
    cabana.precioDia = Number(this.cabanasForm.value.precioDia);
    cabana.numero = this.numeroCabana;

    if (cabana.nombre != null && cabana.precioDia != null)
      this.cabanasService.actualizarCabana(this.idCabania, cabana)

    else
    {
      this.uiService.showSnackBar(
        "Ocurrió un error al intentar editar los datos de la cabaña" + null,
        null,
        3000
      );

    }
    this.dialogRef.close();
  }


  resetForm() {
    this.cabanasForm.reset();
  }

}
