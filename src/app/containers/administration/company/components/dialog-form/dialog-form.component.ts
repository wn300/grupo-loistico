import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CompanyValidatorForm } from '../../entity/company';
import { CompanyService } from '../../services/company.service';

@Component({
  selector: 'app-dialog-form',
  templateUrl: './dialog-form.component.html',
  styleUrls: ['./dialog-form.component.scss']
})
export class DialogFormComponent implements OnInit {
  public codeCompany: number;
  public formCompany: FormGroup;
  public validationMessages: CompanyValidatorForm;

  constructor(public dialogRef: MatDialogRef<DialogFormComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any,
    private companyService: CompanyService) {
    this.formCompany = null;
    this.companyService.getCompanies()
      .subscribe(companies => {
        const companiesResult = companies.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            code: catData.payload.doc.data().code
          };
        });

        if (form.data) {
          this.codeCompany = form.data.code;
        } else {
          if (companiesResult.length > 0) {
            this.codeCompany = companiesResult.reduce((acc, company) => acc = acc > company.code ? acc : company.code, 0) + 1;
          } else {
            this.codeCompany = 1;
          }
        }

        this.formCompany = new FormGroup({
          code: new FormControl(this.codeCompany),
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
          type: new FormControl({
            value: form.data ? form.data.type : '',
            disabled: ''
          }, [
            Validators.required,
            Validators.maxLength(45)
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
          type: [
            { type: 'required', message: 'El tipo es un campo requerido.' },
            { type: 'maxLength', message: 'El tipo no puede superar los 45 caracteres' },
          ]
        };
      });


  }

  ngOnInit(): void {

  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}
