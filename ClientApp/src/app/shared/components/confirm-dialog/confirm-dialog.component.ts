import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.css']
})
export class ConfirmDialogComponent implements OnInit {
  title: string;
  message: string;

  constructor() {
    // Update view with given values

  }

  ngOnInit() {
  }

  // onConfirm(): void {
  //   // Close the dialog, return true
  //   this.dialogRef.close(true);
  // }

  onDismiss(): void {
    // Close the dialog, return false
   // this.dialogRef.close(false);
  }
  onConfirm(){

  }
}

/**
 * Class to represent confirm dialog model.
 *
 * It has been kept here to keep it as part of shared component.
 */
export class ConfirmDialogModel {

  constructor(public title: string, public message: string) {
  }
}
