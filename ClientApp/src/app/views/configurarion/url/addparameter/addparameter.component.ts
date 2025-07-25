import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
@Component({
  selector: 'app-addparameter',
  templateUrl: './addparameter.component.html',
  styleUrls: ['./addparameter.component.scss'],
  host: {
    'class': 'custom-dialoge'
  }
})
export class AddparameterComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddparameterComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
   
  }

  ngOnInit(): void {
    alert("add parameter");
  }

}
