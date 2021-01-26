import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Cabana } from 'src/app/Models/cabana.model';


export interface DialogDataCabana {
  cabana: Cabana;
}

@Component({
  selector: 'app-quitar-cabana',
  templateUrl: './quitar-cabana.component.html',
  styleUrls: ['./quitar-cabana.component.css']
})

export class QuitarCabanaComponent implements OnInit {

  cabanasForm = this.formBuilder.group({
  });

  
  constructor(
    public dialogRef: MatDialogRef<QuitarCabanaComponent>,
    private formBuilder: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: DialogDataCabana) {}

    
  onNoClick(): void {
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}
