import { Component, Inject, OnInit } from '@angular/core';
import * as moment from 'moment';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { DialogFormComponent } from 'src/app/containers/administration/client/components/dialog-form/dialog-form.component';

@Component({
  selector: 'app-dialog-edit',
  templateUrl: './dialog-edit.component.html',
  styleUrls: ['./dialog-edit.component.scss']
})
export class DialogEditComponent implements OnInit {
  public objectEdit: any;
  public startDate: Date;
  public endDate: Date;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    this.objectEdit = {
      dialogForm: {
        startDate: this.form.data.dateInit === 'No Registra'
          ? moment(onlyDateNow).toDate()
          : this.form.data.dateEnd,
        endDate: this.form.data.dateEnd === 'No Registra'
          ? moment(onlyDateNow).toDate()
          : this.form.data.dateEnd,
        observation: this.form.data.observation,
        reason: '',
      },
      ...this.form.data
    };
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
