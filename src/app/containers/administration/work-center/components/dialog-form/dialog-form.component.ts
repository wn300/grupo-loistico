import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';
import { Client } from '../../../client/entity/client';
import * as _ from 'lodash';

import { ClientService } from '../../../client/services/client.service';
import { WorkCenter, WorkCenterValidatorForm } from '../../entity/work-center';
import { WorkCenterService } from '../../services/work-center.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public formWorkCenter: FormGroup;
  public validationMessages: WorkCenterValidatorForm;
  public clients: Client[];
  public workCentersFilter: any[];
  public identificationCordinatorFilter: any[];
  public nameCordinatorFilter: any[];
  public clientSelected: string;
  public codeWorkCenter: number;
  filteredIdentificationCordinatorOptions: Observable<any[]>;
  filteredNameCordinatorOptions: Observable<any[]>;
  filteredClientOptions: Observable<Client[]>;
  filteredWorkCenterOptions: Observable<any[]>;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    // tslint:disable-next-line:align
    @Inject(MAT_DIALOG_DATA) public form: any,
    // tslint:disable-next-line:align
    private clientService: ClientService,
    // tslint:disable-next-line:align
    private workCenterService: WorkCenterService) {
    this.clients = [];
    this.clientSelected = '';
    this.clientService.getClients()
      .subscribe(data => {
        this.clients = data.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name
          };
        });
      });

    this.workCenterService.getWorkCenters()
      .subscribe(workCenters => {
        const workCenterResult = workCenters.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            code: catData.payload.doc.data().operationCode,
            ...catData.payload.doc.data()
          };
        });
        if (form.data) {
          this.codeWorkCenter = form.data.operationCode;
        } else {
          if (workCenterResult.length > 0) {
            // tslint:disable-next-line:max-line-length
            this.codeWorkCenter = workCenterResult.reduce((acc, workCenter) => acc = acc > workCenter.code ? acc : workCenter.code, 0) + 1;
          } else {
            this.codeWorkCenter = 1;
          }
        }

        this.identificationCordinatorFilter = _.uniqBy(workCenterResult, 'coordinatorIdentification');
        this.nameCordinatorFilter = _.uniqBy(workCenterResult, 'coordinator');
        this.workCentersFilter = _.uniqBy(workCenterResult, 'name');

        this.formWorkCenter = new FormGroup({
          name: new FormControl({
            value: form.data ? form.data.name : '',
            disabled: ''
          },
            [
              Validators.required,
              Validators.maxLength(99)
            ]),
          identification: new FormControl({
            value: form.data ? form.data.identification : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),
            Validators.maxLength(20)
          ]),
          city: new FormControl({
            value: form.data ? form.data.city : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(20)
          ]),
          operationCode: new FormControl(this.codeWorkCenter),
          operation: new FormControl({
            value: form.data ? form.data.operation : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(20)
          ]),
          address: new FormControl({
            value: form.data ? form.data.address : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(30)
          ]),
          latitude: new FormControl({
            value: form.data ? form.data.latitude : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(10)
          ]),
          longitude: new FormControl({
            value: form.data ? form.data.longitude : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(10)
          ]),
          client: new FormControl({
            value: form.data ? form.data.client : '',
            disabled: ''
          },
            [
              Validators.required
            ]),
          coordinator: new FormControl({
            value: form.data ? form.data.coordinator : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(45)
          ]),
          coordinatorIdentification: new FormControl({
            value: form.data ? form.data.coordinatorIdentification : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(20)
          ]),
          phone: new FormControl({
            value: form.data ? form.data.phone : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(10)
          ])
        });

        this.validationMessages = {
          name: [
            { type: 'required', message: 'El nombre del centr de trabajo es un campo requerido.' },
            { type: 'maxLength', message: 'El nombre del centr de trabajo no puede superar los 100 caracteres' },
          ],
          identification: [
            { type: 'required', message: 'El nit es un campo requerido.' },
            { type: 'pattern', message: 'La identificación es un campo de tipo numerico.' },
            { type: 'maxLength', message: 'El nit no puede superar los 20 caracteres' },
          ],
          city: [
            { type: 'required', message: 'La ciudad es un campo requerido.' },
            { type: 'maxLength', message: 'La ciudad no puede superar los 20 caracteres' },
          ],
          operationCode: [
            { type: 'required', message: 'El código de oeración es un campo requerido.' },
            { type: 'maxLength', message: 'El código de oeración no puede superar los 20 caracteres' },
          ],
          operation: [
            { type: 'required', message: 'La operación es un campo requerido.' },
            { type: 'maxLength', message: 'La operación no puede superar los 20 caracteres' },
          ],
          address: [
            { type: 'required', message: 'La dirección es un campo requerido.' },
            { type: 'maxLength', message: 'La dirección no puede superar los 30 caracteres' },
          ],
          latitude: [
            { type: 'required', message: 'La latitud es un campo requerido.' },
            { type: 'maxLength', message: 'La latitud no puede superar los 10 caracteres' },
          ],
          longitude: [
            { type: 'required', message: 'La Longitud es un campo requerido.' },
            { type: 'maxLength', message: 'La Longitud no puede superar los 10 caracteres' },
          ],
          client: [
            { type: 'required', message: 'El cliente es un campo requerido.' },
          ],
          coordinator: [
            { type: 'required', message: 'El coordinador es un campo requerido.' },
            { type: 'maxLength', message: 'El coordinador no puede superar los 45 caracteres' },
          ],
          coordinatorIdentification: [
            { type: 'required', message: 'La identificación del coordinador es un campo requerido.' },
            { type: 'maxLength', message: 'La identificación del coordinador no puede superar los 20 caracteres' },
          ],
          phone: [
            { type: 'required', message: 'El telefono del coordinador es un campo requerido.' },
            { type: 'maxLength', message: 'El telefono del coordinador no puede superar los 10 caracteres' },
          ]
        };

        this.filteredClientOptions = this.formWorkCenter.get('identification').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._filterClient(value))
        );

        this.filteredWorkCenterOptions = this.formWorkCenter.get('name').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._filterWorkCenter(value))
        );

        this.filteredIdentificationCordinatorOptions = this.formWorkCenter.get('coordinatorIdentification').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => {
            const identificationCoodinator = this._filterIdentificationCoordinator(value);
            if (identificationCoodinator.length === 0) {
              // tslint:disable-next-line:max-line-length
              const currentCoordnator = this.nameCordinatorFilter.filter(cooridinators => cooridinators.coordinator === this.formWorkCenter.value.coordinator);
              if (currentCoordnator.length > 0) {
                this.formWorkCenter.controls.coordinator.setValue('');
              }
            }
            return identificationCoodinator;
          })
        );

        this.filteredNameCordinatorOptions = this.formWorkCenter.get('coordinator').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => {
            const coordinator = this._filterNameCoordinator(value);
            if (coordinator.length === 0) {
              // tslint:disable-next-line:max-line-length
              const currentCoordnator = this.identificationCordinatorFilter.filter(cooridinators => cooridinators.coordinatorIdentification === this.formWorkCenter.value.coordinatorIdentification);
              if (currentCoordnator.length > 0) {
                this.formWorkCenter.controls.coordinatorIdentification.setValue('');
              }
            }
            return coordinator;
          })
        );
      });
  }

  ngOnInit(): void {
  }

  selectIdentification(select: any): void {
    const clientSelected = this.clients.filter(data => data.identification === select.option.value)[0];
    this.formWorkCenter.controls.client.setValue(clientSelected.name);

    const nameWorkCenter = this.workCentersFilter.filter(data => data.identification === select.option.value);
    this.formWorkCenter.controls.name.setValue(nameWorkCenter.length > 0 ? nameWorkCenter[0].name : '');
  }

  selectIdentificationCordinator(select: any): void {
    // tslint:disable-next-line:max-line-length
    const cordinatorSelected = this.identificationCordinatorFilter.filter(data => data.coordinatorIdentification === select.option.value)[0];
    this.formWorkCenter.controls.coordinator.setValue(cordinatorSelected.coordinator);
  }

  selectCordinator(select: any): void {
    const cordinatorSelected = this.nameCordinatorFilter.filter(data => data.coordinator === select.option.value)[0];
    this.formWorkCenter.controls.coordinatorIdentification.setValue(cordinatorSelected.coordinatorIdentification);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  private _filterClient(value: string): Client[] {
    const filterValue = value.toString().toLowerCase();

    return this.clients.filter(option =>
      String(option.identification).toLowerCase().indexOf(filterValue) >= 0 ||
      option.name.toString().toLowerCase().indexOf(filterValue) >= 0);
  }
  private _filterWorkCenter(value: string): any[] {
    const filterValue = value.toString().toLowerCase();

    return this.workCentersFilter.filter(option =>
      option.name.toString().toLowerCase().indexOf(filterValue) >= 0);
  }
  private _filterIdentificationCoordinator(value: string): any[] {
    const filterValue = value.toString().toLowerCase();

    return this.identificationCordinatorFilter.filter(option =>
      String(option.coordinatorIdentification).toLowerCase().indexOf(filterValue) >= 0
    )
  }
  private _filterNameCoordinator(value: string): any[] {
    const filterValue = value.toString().toLowerCase();

    return this.nameCordinatorFilter.filter(option =>
      option.coordinator.toString().toLowerCase().indexOf(filterValue) >= 0);
  }
}
