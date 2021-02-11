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

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any) {
    const programing = {
      applicantIdentification: this.form.data.applicantIdentification,
      applicantName: this.form.data.applicantName,
      date: this.form.data.date,
      identification: this.form.data.identification,
      name: this.form.data.name,
      observation: this.form.data.observation,
      operationCode: this.form.data.operationCode,
      operationName: this.form.data.operationName,
      transport: this.form.data.transport,
      workplaceCode: this.form.data.workplaceCode,
      workplaceName: this.form.data.workplaceName,
    }
    const reportOne = this.form.data.reportUser.filter(data => data.type === 'Llegada')[0];
    const reportInit = reportOne !== undefined ? {
      address: reportOne.address,
      createAt: reportOne.createAt,
      createBy: moment(reportOne.createBy).toDate(),
      description: reportOne.description,
      email: reportOne.email,
      images: [],
      location: {
        latitude: reportOne.location.latitude,
        latitudeDelta: reportOne.location.latitudeDelta,
        longitude: reportOne.location.longitude,
        longitudeDelta: reportOne.location.longitudeDelta,
      },
      status: reportOne.status,
      type: reportOne.type,
    } : null;

    const reportTwo = this.form.data.reportUser.filter(data => data.type === 'Salida')[0];
    const reportEnd = reportTwo !== undefined ? {
      address: reportTwo.address,
      createAt: reportTwo.createAt,
      createBy: moment(reportTwo.createBy).toDate(),
      description: reportTwo.description,
      email: reportTwo.email,
      images: [],
      location: {
        latitude: reportTwo.location.latitude,
        latitudeDelta: reportTwo.location.latitudeDelta,
        longitude: reportTwo.location.longitude,
        longitudeDelta: reportTwo.location.longitudeDelta,
      },
      status: reportTwo.status,
      type: reportTwo.type,
    } : null;

    this.objectEdit = {
      programing: {
        data: programing,
        prgramingId: this.form.data.programmingId
      },
      reportInit: {
        data: reportInit,
        reportOneId: reportInit !== null ? reportOne.reportId : reportInit,
      },
      reportEnd: {
        data: reportEnd,
        reportOneId: reportEnd !== null ? reportTwo.reportId : reportInit,
      },
    }
  }

  ngOnInit(): void {
    console.log(this.objectEdit);

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
