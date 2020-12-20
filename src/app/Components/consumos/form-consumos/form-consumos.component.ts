// import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, Input, ViewChild,Inject,OnDestroy } from '@angular/core';


import { faPen } from '@fortawesome/free-solid-svg-icons';
import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
import { faArchive } from '@fortawesome/free-solid-svg-icons';



export interface DialogData {
  animal: string;
  name: string;
}

@Component({
  selector: 'app-form-consumos',
  templateUrl: './form-consumos.component.html',
  styleUrls: ['./form-consumos.component.css']
})

export class FormConsumosComponent implements OnInit, OnDestroy {
  faPen = faPen;
  faDollarSign  = faDollarSign ;
  faArchive = faArchive;
  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<FormConsumosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) {}
   
   
   
   
    ngOnInit(): void {

    }
    ngOnDestroy(): void {
      
    }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
