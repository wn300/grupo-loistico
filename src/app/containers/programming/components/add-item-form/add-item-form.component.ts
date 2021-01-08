import { Component, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, Subscription } from 'rxjs';
import { debounceTime, map, startWith, take } from 'rxjs/operators';
import { Client } from 'src/app/containers/administration/client/entity/client';
import { ClientService } from 'src/app/containers/administration/client/services/client.service';

import { People } from 'src/app/containers/administration/people/entity/people';
import { PeopleService } from 'src/app/containers/administration/people/services/people.service';
import {
  WorkCenter,
  WorkCenterBasic,
} from 'src/app/containers/administration/work-center/entity/work-center';
import { WorkCenterService } from 'src/app/containers/administration/work-center/services/work-center.service';
import { OperationCenter } from '../../entities/operation-center.entity';
import { OperationCenterService } from '../../services/operation-center.service';
import { ProgrammingService } from '../../services/programming.service';
import { UploadItemsFormComponent } from '../upload-items-form/upload-items-form.component';

@Component({
  selector: 'app-programming-add-item-form',
  templateUrl: './add-item-form.component.html',
  styleUrls: ['./add-item-form.component.scss'],
})
export class AddItemFormComponent implements OnInit, OnDestroy {
  public isValid = false;
  public form: FormGroup;
  public subscriptions: Subscription[] = [];

  public people: People[] = [];
  public operationCenters: OperationCenter[] = [];
  public workCenters: WorkCenterBasic[] = [];
  public applicants: {
    identification: number;
    name: string;
    workCenterId: number;
  }[] = [];

  public filteredPeople: Observable<People[]>;
  public filteredWorkCenters: Observable<WorkCenterBasic[]>;
  public filteredOperationCenters: Observable<OperationCenter[]>;
  public filterApplicants: {
    identification: number;
    name: string;
    workCenterId: number;
  }[] = [];

  @ViewChild(UploadItemsFormComponent)
  uploadComponent: UploadItemsFormComponent;

  constructor(
    private peopleService: PeopleService,
    private workCenterService: WorkCenterService,
    private operationCenterService: OperationCenterService,
    private programmingService: ProgrammingService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<AddItemFormComponent>,
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
          this.people = [];
          (data as Array<any>).forEach((item) => {
            this.people.push({ ...item.payload.doc.data() });
          });
        })
    );
    this.subscriptions.push(
      this.workCenterService
        .getWorkCenters()
        .pipe(take(1))
        .subscribe((data) => {
          const items = [];
          const itemsApplications = [];
          this.workCenters = [];
          this.applicants = [];
          (data as Array<any>).forEach((item) => {
            const itemWork = item.payload.doc.data() as WorkCenter;
            if (items.indexOf(itemWork.identification) < 0) {
              this.workCenters.push({ ...itemWork });
            }
            if (
              itemsApplications.indexOf(itemWork.coordinatorIdentification) < 0
            ) {
              this.applicants.push({
                identification: itemWork.coordinatorIdentification,
                name: itemWork.coordinator,
                workCenterId: itemWork.identification,
              });
            }
            items.push(itemWork.identification);
            itemsApplications.push(itemWork.coordinatorIdentification);
          });
        })
    );
    this.subscriptions.push(
      this.operationCenterService
        .getOperations()
        .pipe(take(1))
        .subscribe((data) => {
          this.operationCenters = [];
          (data as Array<any>).forEach((item) => {
            this.operationCenters.push({ ...item.payload.doc.data() });
          });
        })
    );
    this.form = new FormGroup({
      people: new FormControl('', [Validators.required]),
      workCenter: new FormControl('', [Validators.required]),
      operationCenter: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      transport: new FormControl('', [Validators.required]),
      date: new FormControl('', [Validators.required]),
      observation: new FormControl('', []),
    });

    this.filteredPeople = this.form.get('people').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) =>
        typeof value === 'string' ? value : this.displayPeopleFn(value)
      ),
      map((name) => (name ? this._filterPeople(name) : this.people.slice()))
    );
    this.filteredWorkCenters = this.form.get('workCenter').valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      map((value) => (typeof value === 'string' ? value : value.name)),
      map((name) => {
        this.form.get('operationCenter').setValue('');
        this.form.get('client').setValue('');
        this._filterApplications();
        return name ? this._filterWorkCenter(name) : this.workCenters.slice();
      })
    );
    this.filteredOperationCenters = this.form
      .get('operationCenter')
      .valueChanges.pipe(
        startWith(''),
        debounceTime(300),
        map((value) => (typeof value === 'string' ? value : value.name)),
        map((name) => this._filterOperationCenter(name))
      );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  public fControl(control: string): AbstractControl {
    return this.form.get(control);
  }

  public fControlIsValid(control: string): boolean {
    return !(
      Boolean(this.fControl(control).errors) &&
      (this.fControl(control).dirty || this.fControl(control).touched)
    );
  }

  public displayPeopleFn(people: People): string {
    return people
      ? `[${people.identification}] ${people.firstName} ${people.firstLastName}`
      : '';
  }
  public displayWorkCenterFn(workCenter: WorkCenterBasic): string {
    return workCenter
      ? `[${workCenter.identification}] ${workCenter.name}`
      : '';
  }
  public displayOperationCenterFn(operationCenter: OperationCenter): string {
    return operationCenter
      ? `[${operationCenter.code}] ${operationCenter.name}`
      : '';
  }

  public validateAutoInput(_control: string): void {
    const control = this.form.get(_control);
    if (control && typeof control.value === 'string') {
      control.setValue('');
    }
  }

  public setIsValid(valid: boolean): void {
    this.isValid = valid;
  }

  public handleClose(): void {
    this.dialogRef.close(null);
  }

  public handleSave(): void {
    if (this.form.valid) {
      const people = this.fControl('people').value as People;
      const workCenter = this.fControl('workCenter').value as WorkCenterBasic;
      const operationCenter = this.fControl('operationCenter')
        .value as OperationCenter;
      const client = this.fControl('client').value as {
        identification: number;
        name: string;
        workCenterId: number;
      };
      const data = {
        identification: people.identification,
        name: `${people.firstName} ${people.secondName} ${people.firstLastName} ${people.secondLastName}`,
        transport: this.fControl('transport').value,
        date: this.fControl('date').value,
        operationCode: operationCenter.code,
        operationName: operationCenter.name,
        workplaceCode: workCenter.identification,
        workplaceName: workCenter.name,
        applicantIdentification: client.identification,
        applicantName: client.name,
        observation: this.fControl('observation').value,
      };
      this.save([data]);
    }
  }

  private save(data: any): void {
    this.programmingService
      .postProgramming(data)
      .then((res) => {
        this.clear();
        this.openSnackBar('Registro agregado correctamente', 'cerrar');
      })
      .catch((err) => {
        this.openSnackBar(
          'Error al agregar el registro, verifique su conexión é intente de nuevo',
          'cerrar'
        );
      });
  }

  private clear(): void {
    this.form.reset();
    [
      'people',
      'workCenter',
      'operationCenter',
      'client',
      'transport',
      'date',
      'observation',
    ].forEach((control) => this.fControl(control).setValue(''));
  }

  private _filterPeople(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.people.filter(
      (option) =>
        option.firstName.toLowerCase().indexOf(filterValue) >= 0 ||
        option.firstLastName.toLowerCase().indexOf(filterValue) >= 0 ||
        String(option.identification).toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterWorkCenter(value: string): any[] {
    const filterValue = value.toLowerCase();

    return this.workCenters.filter(
      (option) =>
        option.name.toLowerCase().indexOf(filterValue) >= 0 ||
        String(option.identification).toLowerCase().indexOf(filterValue) >= 0
    );
  }
  private _filterOperationCenter(value: string): any[] {
    const filterValue = value ? value.toLowerCase() : '';
    const workCenter = this.form.get('workCenter').value as WorkCenterBasic;

    return this.operationCenters.filter(
      (option) =>
        typeof workCenter !== 'string' &&
        option.workCenterCode === workCenter.identification &&
        (filterValue.length === 0 ||
          option.name.toLowerCase().indexOf(filterValue) >= 0 ||
          String(option.code).toLowerCase().indexOf(filterValue) >= 0)
    );
  }
  private _filterApplications(): void {
    this.filterApplicants = this.applicants.filter(
      (applicat) =>
        applicat.workCenterId ===
        (this.fControl('workCenter').value as WorkCenterBasic).identification
    );
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
