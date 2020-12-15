import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import * as XLSX from 'xlsx';
import * as moment from 'moment';

import { DataBase } from '../../entities/form-base.entity';
import {
  Programming,
  ProgrammingTemplate,
} from '../../entities/programming.entity';
import { programmingTemplateMapper } from '../../mappers/programming.mappers';

@Component({
  selector: 'app-programming-upload-items-form',
  templateUrl: './upload-items-form.component.html',
  styleUrls: ['./upload-items-form.component.scss'],
})
export class UploadItemsFormComponent implements OnInit {
  public form: FormGroup;
  public data: ProgrammingTemplate[] = [];
  public invalidData: ProgrammingTemplate[] = [];

  @Input() dataBase: DataBase;
  @Output() isValid: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() save: EventEmitter<Programming[]> = new EventEmitter<
    Programming[]
  >();

  ngOnInit(): void {
    this.form = new FormGroup({
      file: new FormControl(''),
    });
  }

  public uploadFile(event: Event): void {
    const files = (event.target as HTMLInputElement).files;
    if (files && files[0]) {
      const file = files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        const data = programmingTemplateMapper(
          XLSX.utils.sheet_to_json(ws, { header: 1 }),
          this.dataBase
        );
        this.data = data.filter((item) => item.isValid);
        this.invalidData = data.filter((item) => !item.isValid);

        this.form.get('file').setValue('');

        this.isValid.emit(this.data.length > 0);
      };
      reader.readAsBinaryString(file);
    }
  }

  public handleSave(): void {
    this.save.emit(
      this.data.map((item) => {
        return {
          identification: item.identification,
          transport: item.transport,
          date: moment(
            `${item.date} ${item.time}`,
            'DD/MM/YYYY HH:mm'
          ).toDate(),
          operationCode: item.operationCode,
          applicantIdentification: item.applicantIdentification,
          observation: item.observation,
          name: item.name,
          workplaceCode: item.workplaceCode,
          workplaceName: item.workplaceName,
          operationName: item.operationName,
          applicantName: item.applicantName,
        };
      })
    );
  }

  public clear(): void {
    this.data = [];
    this.invalidData = [];
    this.isValid.emit(false);
  }
}
