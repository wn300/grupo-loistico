import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PeopleService } from 'src/app/containers/administration/people/services/people.service';
import { WorkCenterService } from 'src/app/containers/administration/work-center/services/work-center.service';
import { DataBase } from '../../entities/form-base.entity';
import { ProgrammingService } from '../../services/programming.service';
import { UploadItemsFormComponent } from '../upload-items-form/upload-items-form.component';

@Component({
  selector: 'app-programming-add-items-form',
  templateUrl: './add-items-form.component.html',
  styleUrls: ['./add-items-form.component.scss'],
})
export class AddItemsFormComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];

  private people: number[] = [];
  private workCenters: number[] = [];

  @ViewChild(UploadItemsFormComponent)
  uploadComponent: UploadItemsFormComponent;

  constructor(
    private peopleService: PeopleService,
    private workCentersService: WorkCenterService,
    private programmingService: ProgrammingService,
    public dialogRef: MatDialogRef<AddItemsFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
    }
  ) {}

  ngOnInit(): void {
    this.subscriptions.push(
      this.peopleService
        .getPeople()
        .pipe(take(1))
        .subscribe((data) => {
          (data as Array<any>).forEach((item) => {
            this.people.push(item.payload.doc.data().identification);
          });
        })
    );
    this.subscriptions.push(
      this.workCentersService
        .getWorkCenters()
        .pipe(take(1))
        .subscribe((data) => {
          (data as Array<any>).forEach((item) => {
            this.workCenters.push(item.payload.doc.data().code);
          });
        })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  get initData(): DataBase {
    return {
      people: this.people,
      workCenters: this.workCenters,
    };
  }

  public handleClose(): void {
    this.dialogRef.close(null);
  }

  public handleSave(): void {
    this.uploadComponent.handleSave();
  }

  public onSave(data: any): void {
    this.programmingService
      .postProgramming(data)
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  }
}
