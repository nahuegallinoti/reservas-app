import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-form-consumos',
  templateUrl: './form-consumos.component.html',
  styleUrls: ['./form-consumos.component.css']
})

export class FormConsumosComponent {

  constructor(
    public dialogRef: MatDialogRef<FormConsumosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

  onNoClick(): void {
    this.dialogRef.close();
  }

}
