import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ClientValidatorForm } from '../../entity/client';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public formClient: FormGroup;
  public validationMessages: ClientValidatorForm;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any) {
    this.formClient = new FormGroup({
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
      contact: new FormControl({
        value: form.data ? form.data.contact : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      phone: new FormControl({
        value: form.data ? form.data.phone : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(10)
      ]),
      email: new FormControl({
        value: form.data ? form.data.email : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        Validators.maxLength(50)
      ])
    });

    this.validationMessages = {
      name: [
        { type: 'required', message: 'La razón social es un campo requerido.' },
        { type: 'maxLength', message: 'La razón social no puede superar los 100 caracteres' },
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
      contact: [
        { type: 'required', message: 'El contacto es un campo requerido.' },
        { type: 'maxLength', message: 'El contacto no puede superar los 50 caracteres' },
      ],
      phone: [
        { type: 'required', message: 'El telefono es un campo requerido.' },
        { type: 'maxLength', message: 'El telefono no puede superar los 10 caracteres' },
      ],
      email: [
        { type: 'required', message: 'El email es un campo requerido.' },
        { type: 'pattern', message: 'El email es incorrecto Ej. xxx@xxxx.xx .' },
        { type: 'maxLength', message: 'El email no puede superar los 50 caracteres' },
      ]
    };
  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
