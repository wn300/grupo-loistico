import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as _ from 'lodash';

import { CompanyService } from '../../../company/services/company.service';
import { PeopleValidatorForm } from '../../entity/people';
import { PeopleService } from '../../services/people.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public formPeople: FormGroup;
  public validationMessages: PeopleValidatorForm;
  public companies: any[];
  public memberChips: any[];
  public postions: any[];
  public status: any[];
  public managers: any[];

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any,
    private companyService: CompanyService,
    private peopleService: PeopleService
  ) {
    this.companies = [];
    this.companyService.getCompanies()
      .subscribe(companies => {
        this.companies = companies.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            code: catData.payload.doc.data().code,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name,
          };
        });
        this.companies = _.sortBy(this.companies, 'code');
      });

    this.managers = [];
    this.peopleService.getCordinators()
      .subscribe(coordinator => {
        this.managers = coordinator.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            identification: catData.payload.doc.data().identification,
            name: `${catData.payload.doc.data().firstName} ${catData.payload.doc.data().firstLastName}`,
            nameShow: `${catData.payload.doc.data().identification} - ${catData.payload.doc.data().firstName} ${catData.payload.doc.data().firstLastName}`,
          };
        });
        this.managers.push({
          id: -1,
          identification: 0,
          name: `N/A`,
          nameShow: 'NA'
        })
      });

    this.memberChips = [
      'Dependiente',
      'Independiente'
    ];
    this.postions = [
      'Auxiliar operativo',
      'Supernumerario',
      'Coordinador',
      'Administrativo'
    ];
    this.status = [
      'Activo',
      'Inactivo'
    ];

    console.log(form.data);


    this.formPeople = new FormGroup({
      firstName: new FormControl({
        value: form.data ? form.data.firstName : '',
        disabled: ''
      },
        [
          Validators.required,
          Validators.maxLength(20)
        ]),
      secondName: new FormControl({
        value: form.data ? form.data.secondName : '',
        disabled: ''
      },
        [
          Validators.required,
          Validators.maxLength(20)
        ]),
      firstLastName: new FormControl({
        value: form.data ? form.data.firstLastName : '',
        disabled: ''
      },
        [
          Validators.required,
          Validators.maxLength(20)
        ]),
      secondLastName: new FormControl({
        value: form.data ? form.data.secondLastName : '',
        disabled: ''
      },
        [
          Validators.required,
          Validators.maxLength(20)
        ]),
      identification: new FormControl({
        value: form.data ? form.data.identification : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.pattern('^(?=.*[0-9])[- +()0-9]+$'),
        Validators.maxLength(20)
      ]),
      dateAdmission: new FormControl({
        value: form.data ? form.data.dateAdmission : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(20)
      ]),
      company: new FormControl({
        value: form.data ? form.data.company : '',
        disabled: ''
      }, [
        Validators.required
      ]),
      phone: new FormControl({
        value: form.data ? form.data.phone : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(10)
      ]),
      memberShip: new FormControl({
        value: form.data ? form.data.memberShip : '',
        disabled: ''
      }, [
        Validators.required
      ]),
      email: new FormControl({
        value: form.data ? form.data.email : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.pattern(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/),
        Validators.maxLength(100)
      ]),
      address: new FormControl({
        value: form.data ? form.data.address : '',
        disabled: ''
      }, [
        Validators.required,
        Validators.maxLength(50)
      ]),
      position: new FormControl({
        value: form.data ? form.data.position : '',
        disabled: ''
      }, [
        Validators.required
      ]),
      status: new FormControl({
        value: form.data ? form.data.status : '',
        disabled: ''
      }, [
        Validators.required
      ]),
      manager: new FormControl({
        value: form.data ? form.data.manager : '',
        disabled: ''
      }, [
        Validators.required
      ]),
      uid: new FormControl({
        value: form.data ? form.data.uid : '',
        disabled: ''
      }),
    });

    this.validationMessages = {
      firstName: [
        { type: 'required', message: 'El primer nombre es un campo requerido.' },
        { type: 'maxLength', message: 'El primer nombre no puede superar los 20 caracteres' },
      ],
      secondName: [
        { type: 'required', message: 'El seguno nombre es un campo requerido.' },
        { type: 'maxLength', message: 'El seguno nombre no puede superar los 20 caracteres' },
      ],
      firstLastName: [
        { type: 'required', message: 'El primer apellido es un campo requerido.' },
        { type: 'maxLength', message: 'El primer apellido no puede superar los 20 caracteres' },
      ],
      secondLastName: [
        { type: 'required', message: 'El segundo apellido es un campo requerido.' },
        { type: 'maxLength', message: 'El segundo apellido no puede superar los 20 caracteres' },
      ],
      identification: [
        { type: 'required', message: 'La identificación es un campo requerido.' },
        { type: 'pattern', message: 'La identificación es un campo de tipo numerico.' },
        { type: 'maxLength', message: 'La identificación no puede superar los 20 caracteres' },
      ],
      dateAdmission: [
        { type: 'required', message: 'La ciudad es un campo requerido.' },
        { type: 'maxLength', message: 'La ciudad no puede superar los 20 caracteres' },
      ],
      company: [
        { type: 'required', message: 'La empresa es un campo requerido.' }
      ],
      phone: [
        { type: 'required', message: 'El telefono es un campo requerido.' },
        { type: 'maxLength', message: 'El telefono no puede superar los 10 caracteres' },
      ],
      memberShip: [
        { type: 'required', message: 'La afiliación es un campo requerido.' },
      ],
      email: [
        { type: 'required', message: 'El email es un campo requerido.' },
        { type: 'pattern', message: 'El email es incorrecto Ej. xxx@xxxx.xx .' },
        { type: 'maxLength', message: 'El email no puede superar los 100 caracteres' },
      ],
      address: [
        { type: 'required', message: 'La direción es un campo requerido.' },
        { type: 'maxLength', message: 'La direción no puede superar los 50 caracteres' },
      ],
      position: [
        { type: 'required', message: 'El cargo es un campo requerido.' },
      ],
      status: [
        { type: 'required', message: 'El estado es un campo requerido.' },
      ],
      manager: [
        { type: 'required', message: 'El coordinador es un campo requerido.' },
      ],
    };
  }

  ngOnInit(): void {
  }

  changePosition(position: string): any {
    if (position === 'Supernumerario') {
      this.formPeople.controls.email.setValue(`${this.formPeople.value.identification}@whatever.com`);
      this.formPeople.controls.manager.setValue('');
    } else {
      this.formPeople.controls.email.setValue('')
      this.formPeople.controls.manager.setValue('N/A');
    }
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
