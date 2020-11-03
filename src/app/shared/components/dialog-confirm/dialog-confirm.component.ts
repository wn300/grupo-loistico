import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogConfirm } from '../../entity/dialog-confirm';

@Component({
  selector: 'app-dialog-confirm',
  templateUrl: './dialog-confirm.component.html',
  styleUrls: ['./dialog-confirm.component.scss']
})
export class DialogConfirmComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<DialogConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public confirm: DialogConfirm) {
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.confirm.actionClose = false;
    this.dialogRef.close();
  }

}
