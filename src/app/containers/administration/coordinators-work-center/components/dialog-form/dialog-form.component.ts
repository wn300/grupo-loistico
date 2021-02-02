import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { debounceTime, map, startWith } from 'rxjs/operators';

import { WorkCenterService } from '../../../work-center/services/work-center.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public formCoordinatorWorkCenter: FormGroup;
  public validationMessages: any;
  public workCentersFilter: any[];
  filteredWorkCenterOptions: Observable<any[]>;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    // tslint:disable-next-line:align
    @Inject(MAT_DIALOG_DATA) public form: any,
    private workCenterService: WorkCenterService) {

    this.workCenterService.getWorkCenters()
      .subscribe(workCenters => {
        const workCenterResult = workCenters.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            ...catData.payload.doc.data()
          };
        });

        // this.workCentersFilter = _.uniqBy(workCenterResult, 'identification', 'name');
        this.workCentersFilter = workCenterResult;

        this.formCoordinatorWorkCenter = new FormGroup({
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
            Validators.maxLength(50)
          ]),
          workCenterCode: new FormControl({
            value: form.data ? form.data.workCenterCode : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(50)
          ]),
          workCenterName: new FormControl({
            value: form.data ? form.data.workCenterName : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(50)
          ]),

        });

        this.validationMessages = {
          name: [
            { type: 'required', message: 'El nombre del coordinador de trabajo es un campo requerido.' },
            { type: 'maxLength', message: 'El nombre del coordinador de trabajo no puede superar los 100 caracteres' },
          ],
          identification: [
            { type: 'required', message: 'La identificación del coordinador es un campo requerido.' },
            { type: 'pattern', message: 'La identificación es un campo de tipo numerico.' },
            { type: 'maxLength', message: 'La identificación del coordinador no puede superar los 20 caracteres' },
          ],
          workCenterCode: [
            { type: 'required', message: 'El dentro de trabajo es un campo requerido.' }
          ],
          workCenterName: [
            { type: 'required', message: 'El código de oeración es un campo requerido.' },
            { type: 'maxLength', message: 'El código de oeración no puede superar los 20 caracteres' },
          ]
        };

        this.filteredWorkCenterOptions = this.formCoordinatorWorkCenter.get('workCenterCode').valueChanges.pipe(
          startWith(''),
          debounceTime(300),
          map(value => this._filterWorkCenterName(value))
        );
      });
  }

  ngOnInit(): void {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  keyupWorkCenterCode(text: any): void {
    const exist = this.workCentersFilter
      .filter(filt => filt.identification === text.toString().trim());

    if (exist.length === 0) {
      this.formCoordinatorWorkCenter.controls.workCenterName.setValue('');
    }
  }

  selectIdentification(select: any): void {
    this.formCoordinatorWorkCenter.controls.workCenterCode.setValue(select.option.value.split('-')[0]);
    this.formCoordinatorWorkCenter.controls.workCenterName.setValue(select.option.value.split('-')[1]);
  }

  private _filterWorkCenterName(value: string): any[] {
    const filterValue = value.toString().toLowerCase();

    return this.workCentersFilter.filter(option =>
      String(option.identification).toLowerCase().indexOf(filterValue) >= 0 ||
      option.name.toString().toLowerCase().indexOf(filterValue) >= 0);
  }

}
