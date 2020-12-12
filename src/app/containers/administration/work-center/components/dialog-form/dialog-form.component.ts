import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { WorkCenterValidatorForm } from '../../entity/work-center';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public formWorkCenter: FormGroup;
  public validationMessages: WorkCenterValidatorForm;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any) {
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
      operationCode: new FormControl({
        value: form.data ? form.data.operationCode : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(20)
      ]),
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
      }, [
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
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
