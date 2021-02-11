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
import { CoordinatorsWorkCenterService } from 'src/app/containers/administration/coordinators-work-center/services/coordinators-work-center.service';

import { People } from 'src/app/containers/administration/people/entity/people';
import { PeopleService } from 'src/app/containers/administration/people/services/people.service';
import {
  WorkCenter,
  WorkCenterBasic,
} from 'src/app/containers/administration/work-center/entity/work-center';
import { WorkCenterService } from 'src/app/containers/administration/work-center/services/work-center.service';
import { OperationCenter } from '../../entities/operation-center.entity';
import { Programming } from '../../entities/programming.entity';
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
  public initSubsChanges = false;

  @ViewChild(UploadItemsFormComponent)
  uploadComponent: UploadItemsFormComponent;

  constructor(
    private peopleService: PeopleService,
    private workCenterService: WorkCenterService,
    private operationCenterService: OperationCenterService,
    private programmingService: ProgrammingService,
    private snackBar: MatSnackBar,
    public coordinatorsWorkCenterService: CoordinatorsWorkCenterService,
    public dialogRef: MatDialogRef<AddItemFormComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      title: string;
      item: Programming;
    }
  ) {}

  ngOnInit(): void {
    const item = this.data.item;
    this.form = new FormGroup({
      people: new FormControl('', [Validators.required]),
      workCenter: new FormControl('', [Validators.required]),
      operationCenter: new FormControl('', [Validators.required]),
      client: new FormControl('', [Validators.required]),
      transport: new FormControl(item ? item.transport : '', [
        Validators.required,
      ]),
      date: new FormControl(item && item.date ? item.date : '', [
        Validators.required,
      ]),
      observation: new FormControl(
        item && item.observation ? item.observation : '',
        []
      ),
    });

    this.subscriptions.push(
      this.peopleService
        .getPeople()
        .pipe(take(1))
        .subscribe((data) => {
          this.people = [];
          (data as Array<any>).forEach((item) => {
            this.people.push({ ...item.payload.doc.data() });
          });
          if (item) {
            const people = this.people.find(
              (_people) => _people.identification === item.identification
            );
            if (people) {
              this.fControl('people').setValue(people);
            }
          }
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
            items.push(itemWork.identification);
          });
          if (item) {
            const workCenter = this.workCenters.find(
              (_workCenter) => _workCenter.identification === item.workplaceCode
            );
            if (workCenter) {
              this.fControl('workCenter').setValue(workCenter);
              this._filterApplications(workCenter.identification, true);
            }
          }
          setTimeout(() => {
            this.initSubsChanges = true;
          }, 1000);
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
          if (item) {
            const operationCenter = this.operationCenters.find(
              (_operationCenter) => _operationCenter.code === item.operationCode
            );
            if (operationCenter) {
              this.fControl('operationCenter').setValue(operationCenter);
            }
          }
        })
    );

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
        if (this.initSubsChanges) {
          this.form.get('operationCenter').setValue('');
          this.form.get('client').setValue('');
        }
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

  public selectWorkCenter(selected: any): void {
    this._filterApplications(selected.option.value.identification);
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
    if (this.data.item) {
      this.update(data[0]);
    } else {
      this.create(data);
    }
  }

  private create(data: any): void {
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

  private update(data: any): void {
    this.programmingService
      .putProgramming(this.data.item.id, data)
      .then((res) => {
        this.openSnackBar('Registro se guardo correctamente', 'cerrar');
      })
      .catch((err) => {
        console.log(err);
        this.openSnackBar(
          'Error al guardar el registro, verifique su conexión é intente de nuevo',
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

  private _filterApplications(
    idWorkCenter: string | number,
    initForm: boolean = false
  ): void {
    this.filterApplicants = [];
    this.coordinatorsWorkCenterService
      .getCoordinatorsWorkCentersByIdentificationWorkCenter(idWorkCenter)
      .subscribe((data) => {
        this.filterApplicants = data.map((dataMapper) => {
          return {
            identification: dataMapper.identification,
            name: dataMapper.name,
            workCenterId: dataMapper.workCenterCode,
          };
        });
        if (initForm && this.data.item) {
          const application = this.filterApplicants.find(
            (_application) =>
              _application.identification ===
              this.data.item.applicantIdentification
          );
          if (application) {
            this.fControl('client').setValue(application);
          }
        }
      });
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
