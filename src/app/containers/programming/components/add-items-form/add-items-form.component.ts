import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';

import { PeopleService } from 'src/app/containers/administration/people/services/people.service';
import {
  DataBase,
  OperationCenterDataBase,
} from '../../entities/form-base.entity';
import { OperationCenterService } from '../../services/operation-center.service';
import { ProgrammingService } from '../../services/programming.service';
import { UploadItemsFormComponent } from '../upload-items-form/upload-items-form.component';

@Component({
  selector: 'app-programming-add-items-form',
  templateUrl: './add-items-form.component.html',
  styleUrls: ['./add-items-form.component.scss'],
})
export class AddItemsFormComponent implements OnInit, OnDestroy {
  public isValid = false;
  public subscriptions: Subscription[] = [];

  private people: number[] = [];
  private operationCenters: OperationCenterDataBase[] = [];

  @ViewChild(UploadItemsFormComponent)
  uploadComponent: UploadItemsFormComponent;

  constructor(
    private peopleService: PeopleService,
    private operationCenterService: OperationCenterService,
    private programmingService: ProgrammingService,
    private snackBar: MatSnackBar,
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
      this.operationCenterService
        .getOperations()
        .pipe(take(1))
        .subscribe((data) => {
          (data as Array<any>).forEach((item) => {
            this.operationCenters.push({
              code: item.payload.doc.data().code,
              workCenterCode: item.payload.doc.data().workCenterCode,
            });
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
      operationCenters: this.operationCenters,
    };
  }

  public setIsValid(valid: boolean): void {
    this.isValid = valid;
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
      .then((res) => {
        this.uploadComponent.clear();
        this.openSnackBar('Registros agregados correctamente', 'cerrar');
      })
      .catch((err) => {
        this.openSnackBar(
          'Error al agregar los registros, verifique su conexión é intente de nuevo',
          'cerrar'
        );
      });
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
