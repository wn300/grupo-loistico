import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as XLSX from 'xlsx';

import { FileUploadService } from 'src/app/shared/services/file-upload.service';
import { People } from '../../entity/people';

@Component({
  selector: 'app-dialog-upload-people-file',
  templateUrl: './dialog-upload-people-file.component.html',
  styleUrls: ['./dialog-upload-people-file.component.scss']
})
export class DialogUploadPeopleFileComponent implements OnInit {
  public dataSave: any[];
  public extensions: string;
  public filequotation: string;

  constructor(public dialogRef: MatDialogRef<DialogUploadPeopleFileComponent>,
    @Inject(MAT_DIALOG_DATA) public form: any,
    public fileUploadService: FileUploadService) {
    this.extensions = '.xslx';
    this.filequotation = 'logo_upload';

    this.dataSave = [];

    this.fileUploadService.getObjetFile()
      .subscribe(data => {
        this.onFileChange(data)
          .then(formatData => console.log(formatData));
      });
  }

  ngOnInit(): void {
  }

  async onFileChange(file): Promise<any> {
    let workBook = null;
    let jsonData = null;
    const reader = new FileReader();
    reader.onload = await (async (event) => {
      const data = reader.result;
      workBook = XLSX.read(data, { type: 'binary' });
      jsonData = await workBook.SheetNames.reduce(async (initial, name) => {
        const sheet = workBook.Sheets[name];
        initial = XLSX.utils.sheet_to_json(sheet);
        return await initial;
      }, {});
      const dataString = jsonData;
      this.createUsersByXSLX(dataString);
    })
    reader.readAsBinaryString(file);

    return this.dataSave;
  }

  createUsersByXSLX(jsonPeople: any): void {
    jsonPeople.forEach(element => {
      if (element.cargo.toLowerCase().trim() === 'supernumerario') {
        element.correo = `${element.cedula}@whatever.com`;
      }

      const objectFirebasePeople: People = {
        firstName: element.nombres.split(' ')[0],
        secondName: element.nombres.split(' ').length > 1 ? element.nombres.split(' ')[1] : '',
        firstLastName: element.apellidos.split(' ')[0],
        secondLastName: element.apellidos.split(' ')[1],
        identification: element.cedula,
        dateAdmission: new Date(element.fecha_admision),
        company: element.codigo_empresa,
        phone: element.telefono,
        memberShip: element.afiliacion,
        email: element.correo,
        address: element.direccion,
        position: element.cargo,
        status: element.estado,
        manager: element.identificacion_coordinador,
        city: element.ciudad,
        dayOfRest: element.dia_descanso
      }

      this.dataSave.push(objectFirebasePeople);
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
