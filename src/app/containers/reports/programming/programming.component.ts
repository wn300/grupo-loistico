import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logo from '../../../../assets/mylogo.js';

import { DialogEditComponent } from './components/dialog-edit/dialog-edit.component';

import { ProgrmmingService } from './services/progrmming.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss']
})
export class ProgrammingComponent implements OnInit {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public startDate: Date;
  public endDate: Date;
  public displayedColumns: string[];
  public dataSourceReports;
  public isLoading: boolean;
  public reports: any[];
  public programmingWithoutReport: any[];
  public print: any[];
  public people: any[] = [];
  dataForExcel = [];

  selected = 'Todos';
  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(private progrmmingService: ProgrmmingService,
    public dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.people = [];
    this.progrmmingService.getOnlyPeopleJoinCompany()
      .subscribe(data => {
        this.people = data;
      });

    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.startDate = moment(onlyDateNow).toDate();
    this.endDate = moment(onlyDateNow).toDate();

    this.titlePage = 'Reporte de programación';
    this.subTitle = 'Reportes de programación conta el reporte de usuarios por la app';
    this.displayedColumns = [
      'identification',
      'name',
      'dateProgramming',
      'hourProgramming',
      'dateInit',
      'hourInit',
      // 'messageInit',
      'dateEnd',
      'hourEnd',
      // 'messageEnd',
      'hours',
      'observations',
      'applicantName',
      'identificationWorckCenter',
      'workCenter',
      'codeOperation',
      'operation',
      'city',
      'client',
      'positionEntry',
      'positionExit',
      'addressEntry',
      'addressExit',
      'update'
    ];

    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    this.isLoading = true;
    if (this.startDate !== null && this.endDate !== null) {
      this.selected = 'Todos';
      this.dataSourceReports = [];
      this.reports = [];

      const startDate = moment(this.startDate).toDate();
      const endDate = moment(this.endDate).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').toDate();

      this.progrmmingService.getPrograming(startDate, endDate)
        .subscribe(programmings => {
          this.programmingWithoutReport = programmings.map(programming => {
            const objectReturn = {
              ...programming,
              id: programming.programmingId,
              identification: programming.identification,
              name: programming.name,
              dateInit: 'No Registra',
              messageInit: 'No Registra',
              dateEnd: 'No Registra',
              messageEnd: 'No Registra',
              hours: 'No Registra',
              observations: programming.observation,
              applicantName: programming.applicantName,
              dateProgramming: moment(programming.date.toDate(), this.dateFormat),
              identificationWorckCenter: programming.workplaceCode,
              workCenter: programming.workplaceName,
              codeOperation: programming.operationCode,
              operation: programming.operationName,
              city: programming.workCenter.city,
              client: programming.workCenter.client,
              transport: programming.transport === true ? 'Si' : 'No',
              positionEntry: 'No Registra',
              positionExit: 'No Registra',
              addressEntry: 'No Registra',
              addressExit: 'No Registra',
            };

            return objectReturn;
          });

          this.progrmmingService.getProgrammingJoinReport(startDate, endDate)
            .subscribe(dataPrograming => {
              if (dataPrograming.length > 0) {

                this.reports = dataPrograming.map(dataProgramingNew => {
                  const hoursDiff = dataProgramingNew.reportStart.data.date !== '' &&
                    dataProgramingNew.reportEnd.data.date !== ''
                    ? this.diffHours(dataProgramingNew.reportStart.data.date.toDate(),
                      dataProgramingNew.reportEnd.data.date.toDate(), '') : undefined;

                  const objectReturn = {
                    ...dataProgramingNew,
                    identification: dataProgramingNew.identification,
                    name: dataProgramingNew.name,
                    // tslint:disable-next-line:max-line-length
                    dateInit: dataProgramingNew.reportStart.data.date !== '' ? dataProgramingNew.reportStart.data.date.toDate() : 'No Registra',
                    messageInit: dataProgramingNew.reportStart.data.message !== '' ? dataProgramingNew.reportStart.data.message : 'No Registra',
                    // tslint:disable-next-line:max-line-length
                    dateEnd: dataProgramingNew.reportEnd.data.date !== '' ? dataProgramingNew.reportEnd.data.date.toDate() : 'No Registra',
                    messageEnd: dataProgramingNew.reportEnd.data.message !== '' ? dataProgramingNew.reportEnd.data.message : 'No Registra',
                    hours: hoursDiff !== undefined ? `${hoursDiff[0]}:${hoursDiff[1]}` : 'No Registra',
                    observations: dataProgramingNew.observation,
                    applicantName: dataProgramingNew.applicantName,
                    dateProgramming: moment(dataProgramingNew.date.toDate(), this.dateFormat),
                    identificationWorckCenter: dataProgramingNew.workplaceCode,
                    workCenter: dataProgramingNew.workplaceName,
                    codeOperation: dataProgramingNew.operationCode,
                    operation: dataProgramingNew.operationName,
                    city: dataProgramingNew.workCenter.city,
                    client: dataProgramingNew.workCenter.client,
                    transport: dataProgramingNew.transport === true ? 'Si' : 'No',
                    // tslint:disable-next-line:max-line-length
                    positionEntry: dataProgramingNew.reportStart.data.location.message !== undefined ? dataProgramingNew.reportStart.data.location.message : 'No Registra',
                    // tslint:disable-next-line:max-line-length
                    positionExit: dataProgramingNew.reportEnd.data.location.message !== undefined ? dataProgramingNew.reportEnd.data.location.message : 'No Registra',
                    addressEntry: dataProgramingNew.reportStart.data.address !== '' ? dataProgramingNew.reportStart.data.address : 'No Registra',
                    addressExit: dataProgramingNew.reportEnd.data.address !== '' ? dataProgramingNew.reportEnd.data.address : 'No Registra',
                  };

                  return objectReturn;
                });
              }

              this.print = [];

              this.print = _.orderBy([..._.differenceBy(this.programmingWithoutReport, this.reports, 'id'), ...this.reports], ['dateProgramming'], ['asc']);

              this.dataSourceReports = new MatTableDataSource(this.print);

              setTimeout(() => {
                this.isLoading = false;
              }, 100);
            });


        });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReports.filter = filterValue.trim().toLowerCase();
  }

  exportToExcelHourExtras(): void {
    this.dataForExcel = [];
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    const print = _.orderBy([..._.differenceBy(this.programmingWithoutReport, this.reports, 'id'), ...this.reports], ['dateProgramming'], ['asc']);

    const newPrint = print.filter(dataPrint => {
      if (dataPrint.hours !== 'No Registra') {
        const hourValidate = parseFloat(dataPrint.hours.split(':')[0]);
        if (hourValidate > 8) {
          return true;
        }
      }
      return false;
    });

    newPrint.forEach((row: any) => {
      const preople = this.people.filter(peopleFilter => peopleFilter.identification === row.identification)[0];
      const newObject = {
        'Encab: Empresa': preople.company.name,
        'Encab: Tipo Documento': '',
        'Encab: Prefijo': '',
        'Encab: Documento Número': row.identification,
        'Encab: Fecha': moment(onlyDateNow).format('DD/MM/YYYY'),
        'Encab: Tercero Interno': '',
        'Encab: Tercero Externo': '',
        'Encab: Nota': '',
        'Encab: Anulado': '',
        'Detalle: Empleado': row.name,
        'Detalle: Concepto': 'Extras',
        'Detalle: Fecha': moment(row.date.toDate()).format('DD/MM/YYYY'),
        'Detalle: Cantidad': parseFloat(row.hours.split(':')[0]) - 8,
        'Detalle: Valor': '',
        'Detalle: Unidad Medida': 'Hora',
        'Detalle: Centro Costos': '',
        'Detalle: Nota': '',
        'Detalle: Proceso': '',
        'Detalle: Pasa a Nómina': '',
        'Detalle: Aprobado': '',
        'Detalle: Usuario Aprueba': '',
        'Detalle: Código Centro Costos': ''
      };
      this.dataForExcel.push(Object.values(newObject));
    });

    const reportData = {
      title: `Reporte de horas extras ${moment(this.startDate).format('DD/MM/YYYY')} - ${moment(this.endDate).format('DD/MM/YYYY')}`,
      data: this.dataForExcel,
      headers: [
        'Encab: Empresa',
        'Encab: Tipo Documento',
        'Encab: Prefijo',
        'Encab: Documento Número',
        'Encab: Fecha',
        'Encab: Tercero Interno',
        'Encab: Tercero Externo',
        'Encab: Nota',
        'Encab: Anulado',
        'Detalle: Empleado',
        'Detalle: Concepto',
        'Detalle: Fecha',
        'Detalle: Cantidad',
        'Detalle: Valor',
        'Detalle: Unidad Medida',
        'Detalle: Centro Costos',
        'Detalle: Nota',
        'Detalle: Proceso',
        'Detalle: Pasa a Nómina',
        'Detalle: Aprobado',
        'Detalle: Usuario Aprueba',
        'Detalle: Código Centro Costos',
      ]
    };

    this.exportExcelServiceHoursExtras(reportData, 'Horas Extras');
  }

  exportExcelServiceHoursExtras(excelData: any, message: string): any {

    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet(message);


    // Add Row and formatting
    worksheet.mergeCells('C1', 'R4');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    worksheet.mergeCells('S1:V4');
    const d = new Date();
    const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    const dateCell = worksheet.getCell('S1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // Add Image
    const myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      };
    });

    // Adding Data with Conditional Formatting
    // tslint:disable-next-line:no-shadowed-variable
    data.forEach((d: any) => {
      const row = worksheet.addRow(d);
    }
    );

    worksheet.getColumn(1).width = 50;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;
    worksheet.getColumn(8).width = 20;
    worksheet.getColumn(9).width = 20;
    worksheet.getColumn(10).width = 20;
    worksheet.getColumn(11).width = 20;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 20;
    worksheet.getColumn(14).width = 20;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 20;
    worksheet.getColumn(18).width = 20;
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 20;
    worksheet.getColumn(21).width = 20;
    worksheet.getColumn(22).width = 20;
    worksheet.getColumn(23).width = 20;
    worksheet.addRow([]);

    // Footer Row
    const footerRow = worksheet.addRow([`Reporte generado desde App Asistencia el ${date}`]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    // tslint:disable-next-line:no-shadowed-variable
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  exportToExcel(): void {
    this.dataForExcel = [];
    const print = _.orderBy([..._.differenceBy(this.programmingWithoutReport, this.reports, 'id'), ...this.reports], ['dateProgramming'], ['asc']);
    print.forEach((row: any) => {
      const newObject = {
        Identificacion: row.identification,
        Nombre: row.name,
        'Fecha programada': moment(row.dateProgramming).format('DD/MM/YYYY'),
        'Hora programada': moment(row.dateProgramming).format('HH:mm:ss'),
        'Fecha inicio': row.dateInit === 'No Registra' ? row.dateInit : moment(row.dateInit).format('DD/MM/YYYY'),
        'Hora inicio': row.dateInit === 'No Registra' ? row.dateInit : moment(row.dateInit).format('HH:mm:ss'),
        'Fecha fin': row.dateEnd === 'No Registra' ? row.dateEnd : moment(row.dateEnd).format('DD/MM/YYYY'),
        'Hora fin': row.dateEnd === 'No Registra' ? row.dateEnd : moment(row.dateEnd).format('HH:mm:ss'),
        Horas: row.hours,
        Observacion: row.observations,
        Solicitante: row.applicantName,
        'Id centro de trabajo': row.identificationWorckCenter,
        'Centro de trabajo': row.workCenter,
        'Cod operacion': row.codeOperation,
        Ciudad: row.city,
        Cliente: row.client,
        'Localizacion entrada': row.positionEntry,
        'Localizacion salida': row.positionExit,
        'Direccion entrada': row.addressEntry,
        'Direccion salida': row.addressExit,
        Modificado: '',
        'Motivo modificacion': ''
      };
      this.dataForExcel.push(Object.values(newObject));
    });

    const reportData = {
      title: `Reporte de programación ${moment(this.startDate).format('DD/MM/YYYY')} - ${moment(this.endDate).format('DD/MM/YYYY')}`,
      data: this.dataForExcel,
      headers: [
        'Identificacion',
        'Nombre',
        'Fecha programada',
        'Hora programada',
        'Fecha inicio',
        'Hora inicio',
        'Fecha fin',
        'Hora fin',
        'Horas',
        'Observacion',
        'Solicitante',
        'Id centro de trabajo',
        'Centro de trabajo',
        'Cod operacion',
        'Ciudad',
        'Cliente',
        'Localizacion entrada',
        'Localizacion salida',
        'Direccion entrada',
        'Direccion salida',
        'Modificado',
        'Motivo modificacion'
      ]
    };

    this.exportExcelService(reportData);
  }

  exportExcelService(excelData): any {

    // Title, Header & Data
    const title = excelData.title;
    const header = excelData.headers;
    const data = excelData.data;

    // Create a workbook with a worksheet
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet('Programación');


    // Add Row and formatting
    worksheet.mergeCells('C1', 'R4');
    const titleRow = worksheet.getCell('C1');
    titleRow.value = title;
    titleRow.font = {
      name: 'Calibri',
      size: 16,
      underline: 'single',
      bold: true,
      color: { argb: '0085A3' }
    }
    titleRow.alignment = { vertical: 'middle', horizontal: 'center' }

    // Date
    worksheet.mergeCells('S1:T4');
    const d = new Date();
    const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    const dateCell = worksheet.getCell('S1');
    dateCell.value = date;
    dateCell.font = {
      name: 'Calibri',
      size: 12,
      bold: true
    }
    dateCell.alignment = { vertical: 'middle', horizontal: 'center' }

    // Add Image
    const myLogoImage = workbook.addImage({
      base64: logo.imgBase64,
      extension: 'png',
    });
    worksheet.mergeCells('A1:B4');
    worksheet.addImage(myLogoImage, 'A1:B4');

    // Blank Row
    worksheet.addRow([]);

    // Adding Header Row
    const headerRow = worksheet.addRow(header);
    headerRow.eachCell((cell) => {
      cell.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: '4167B8' },
        bgColor: { argb: '' }
      };
      cell.font = {
        bold: true,
        color: { argb: 'FFFFFF' },
        size: 12
      };
    });

    // Adding Data with Conditional Formatting
    // tslint:disable-next-line:no-shadowed-variable
    data.forEach((d: any) => {
      const row = worksheet.addRow(d);
    }
    );

    worksheet.getColumn(1).width = 15;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 15;
    worksheet.getColumn(4).width = 15;
    worksheet.getColumn(5).width = 15;
    worksheet.getColumn(6).width = 15;
    worksheet.getColumn(7).width = 15;
    worksheet.getColumn(8).width = 30;
    worksheet.getColumn(9).width = 30;
    worksheet.getColumn(10).width = 15;
    worksheet.getColumn(11).width = 15;
    worksheet.getColumn(12).width = 20;
    worksheet.getColumn(13).width = 30;
    worksheet.getColumn(14).width = 10;
    worksheet.getColumn(15).width = 20;
    worksheet.getColumn(16).width = 20;
    worksheet.getColumn(17).width = 30;
    worksheet.getColumn(18).width = 30;
    worksheet.getColumn(19).width = 30;
    worksheet.getColumn(20).width = 30;
    worksheet.getColumn(21).width = 30;
    worksheet.getColumn(22).width = 30;
    worksheet.addRow([]);

    // Footer Row
    const footerRow = worksheet.addRow([`Reporte generado desde App Asistencia el ${date}`]);
    footerRow.getCell(1).fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FFB050' }
    };

    // Merge Cells
    worksheet.mergeCells(`A${footerRow.number}:F${footerRow.number}`);

    // Generate & Save Excel File
    // tslint:disable-next-line:no-shadowed-variable
    workbook.xlsx.writeBuffer().then((data: any) => {
      const blob = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      fs.saveAs(blob, title + '.xlsx');
    })

  }

  editProgramming(element: any): void {
    const dialogRef = this.dialog.open(DialogEditComponent, {
      width: '80%',
      data: {
        title: 'Edición de reporte de programación',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogForm: any) => {
        if (resultDialogForm) {
          this.progrmmingService.currentUser.subscribe(data => {
            this.progrmmingService.getOnlyPeopleByUID(data.uid)
              .subscribe(peopleUpdate => {
                const people = peopleUpdate[0];
                const isEqualDateStart = _.isEqual(resultDialogForm.dateInit, resultDialogForm.dialogForm.startDate);
                const isEqualDateEnd = _.isEqual(resultDialogForm.dateEnd, resultDialogForm.dialogForm.endDate);

                if (!isEqualDateStart) {
                  if (resultDialogForm.dateInit === 'No Registra') {

                    const objectSave = {
                      type: 'Llegada',
                      description: resultDialogForm.dialogForm.observation,
                      address: 'No disponible',
                      location: [],
                      images: [],
                      status: true,
                      date: resultDialogForm.dialogForm.startDate,
                      createAt: resultDialogForm.dialogForm.startDate,
                      createBy: people.uid,
                      email: `${resultDialogForm.identification}@whatever.com`
                    };

                    const diffTime = this.diffHours(resultDialogForm.date.toDate(), objectSave.date, objectSave.type);

                    this.progrmmingService.postReports(objectSave)
                      .then(resReport => {

                        this.progrmmingService.getProgrammingJoinReportById(resultDialogForm.id)
                          .subscribe(dataProgramingById => {
                            if (dataProgramingById.length === 0) {
                              const newObject = {
                                diffTime: parseFloat(`${diffTime[0]}${diffTime[1]}`),
                                ...resultDialogForm,
                                startDate: resultDialogForm.dialogForm.startDate,
                                dateProgramming: resultDialogForm.date,
                                reportStart: {
                                  data: {
                                    ...objectSave,
                                    message: diffTime[0] === 0 && diffTime[1] <= 15 ? 'A tiempo' : 'Fuera de rango'
                                  },
                                  id: resReport.id
                                },
                                reportEnd: {
                                  data: {
                                    type: '',
                                    description: '',
                                    address: '',
                                    location: {},
                                    images: [],
                                    status: '',
                                    date: '',
                                    createAt: '',
                                    createBy: '',
                                    email: '',
                                    message: ''
                                  },
                                  id: ''
                                }
                              };

                              this.progrmmingService.postReportsProgramming(newObject)
                                .then(resProgramming => {
                                  this.openSnackBar('Registro editada correctamente', 'cerrar');
                                }).catch(err => {
                                  console.log(err);

                                  this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
                                });
                            } else {
                            }

                          });
                      })
                      .catch(err => {
                        console.log(err);

                        this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
                      });
                  } else {
                    const objectSend = this.objectUpdateReport(
                      resultDialogForm.reportStart.data,
                      resultDialogForm.dialogForm.reason,
                      people.uid,
                      `${people.firstName} ${people.secondName} ${people.firstLastName} ${people.secondLastName}`,
                      resultDialogForm.dialogForm.startDate);

                    this.updateReportById(resultDialogForm.reportStart.id, objectSend, resultDialogForm, 'Llegada', people);
                  }
                }
                setTimeout(() => {
                  if (!isEqualDateEnd) {
                    if (resultDialogForm.dateEnd === 'No Registra') {
                      const objectSave = {
                        type: 'Salida',
                        description: resultDialogForm.dialogForm.observation,
                        address: 'No disponible',
                        location: [],
                        images: [],
                        status: false,
                        date: resultDialogForm.dialogForm.endDate,
                        createAt: resultDialogForm.dialogForm.endDate,
                        createBy: people.uid,
                        email: `${resultDialogForm.identification}@whatever.com`
                      };

                      const diffTime = this.diffHours(resultDialogForm.date.toDate(), objectSave.date, objectSave.type);

                      this.progrmmingService.postReports(objectSave)
                        .then(resReport => {

                          this.progrmmingService.getProgrammingJoinReportById(resultDialogForm.id)
                            .subscribe(dataProgramingById => {
                              if (dataProgramingById.length === 0) {
                                const newObject = {
                                  diffTime: parseFloat(`${diffTime[0]}${diffTime[1]}`),
                                  ...resultDialogForm,
                                  endDate: resultDialogForm.dialogForm.endDate,
                                  dateProgramming: resultDialogForm.date,
                                  reportEnd: {
                                    data: {
                                      ...objectSave,
                                      message: diffTime[0] <= 12 && diffTime[0] > 6 ? 'A tiempo' : 'Fuera de rango'
                                    },
                                    id: resReport.id
                                  },
                                  reportStart: {
                                    data: {
                                      type: '',
                                      description: '',
                                      address: '',
                                      location: {},
                                      images: [],
                                      status: '',
                                      date: '',
                                      createAt: '',
                                      createBy: '',
                                      email: '',
                                      message: ''
                                    },
                                    id: ''
                                  }
                                };

                                this.progrmmingService.postReportsProgramming(newObject)
                                  .then(resProgramming => {
                                    this.openSnackBar('Registro editada correctamente', 'cerrar');
                                  }).catch(err => {
                                    console.log(err);

                                    this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
                                  });
                              } else {
                                dataProgramingById[0].reportEnd = {
                                  data: {
                                    ...objectSave,
                                    message: diffTime[0] <= 12 && diffTime[0] > 6 ? 'A tiempo' : 'Fuera de rango'
                                  },
                                  id: resReport.id
                                };
                                console.log(dataProgramingById[0], 'dataProgramingById[0]');
                                this.progrmmingService.putReportProgramming(dataProgramingById[0].idProgrammingJoin, dataProgramingById[0])
                                  .then(resProgramming => {
                                    this.openSnackBar('Registro editada correctamente', 'cerrar');
                                  }).catch(err => {
                                    console.log(err);

                                    this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
                                  });
                              }

                            });
                        })
                        .catch(err => {
                          console.log(err);

                          this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
                        });
                    } else {
                      const objectSend = this.objectUpdateReport(
                        resultDialogForm.reportEnd.data,
                        resultDialogForm.dialogForm.reason,
                        people.uid,
                        `${people.firstName} ${people.secondName} ${people.firstLastName} ${people.secondLastName}`,
                        resultDialogForm.dialogForm.endDate);

                      this.updateReportById(resultDialogForm.reportEnd.id, objectSend, resultDialogForm, 'Salida', people);
                    }
                  }
                }, 200);

              });
          });
        }
      });
  }

  private updateReportById(id, object: any, resultDialogForm: any, type: any, people: any): void {
    this.progrmmingService.putReports(
      id,
      object
    )
      .then(res => {
        if (type === 'Llegada') {
          const diffTime = this.diffHours(resultDialogForm.date.toDate(), object.date, object.type);
          object.message = diffTime[0] === 0 && diffTime[1] <= 15 ? 'A tiempo' : 'Fuera de rango';
          resultDialogForm.reportStart.data = object;
        } else {
          const diffTime = this.diffHours(resultDialogForm.date.toDate(), object.date, object.type);
          object.message = diffTime[0] <= 12 && diffTime[0] > 6 ? 'A tiempo' : 'Fuera de rango';
          resultDialogForm.reportEnd.data = object;
        }

        this.progrmmingService.putReportProgramming(
          resultDialogForm.idProgrammingJoin,
          this.objectUpdateReportProgrammingAll(resultDialogForm, people.uid, `${people.firstName} ${people.secondName} ${people.firstLastName} ${people.secondLastName}`))
          .then(resProgramming => {
            this.openSnackBar('Registro editada correctamente', 'cerrar');
          }).catch(err => {
            console.log(err);

            this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
          });

      })
      .catch(err => {
        console.log(err);

        this.openSnackBar('Error al editar registro, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  private objectUpdateReport(object: any, reason: any, updateId: any, updateName: string, dateNew: Date): any {
    return {
      ...object,
      date: dateNew,
      createAt: dateNew,
      updateAt: new Date(),
      updateId,
      updateName,
      updateReason: reason,
    };
  }


  private objectUpdateReportProgrammingAll(object: any, updateId: any, updateName: string): any {
    return {
      ...object,
      dateProgramming: object.date,
      dateInit: object.dialogForm.startDate,
      dateEnd: object.dialogForm.endDate,
      observation: object.dialogForm.observation,
      updateAt: new Date(),
      updateId,
      updateName,
      updateReason: object.dialogForm.reason,
    };
  }

  digitThrird(cordenada: number): any {
    return parseFloat(cordenada.toString().split('.')[1].slice(2, 3));
  }

  diffHours(startDate, endDate, type): any {
    const startTime = moment(startDate, 'HH:mm:ss');
    const endTime = moment(endDate, 'HH:mm:ss');

    let hours = 0;
    let minutes = '';
    // calculate total duration
    if (type !== 'Salida') {
      if (startDate < endDate) {
        hours = endTime.diff(startTime, 'hours');
        minutes = moment.utc(endTime.diff(startTime)).format('mm');
      } else {
        hours = startTime.diff(endTime, 'hours');
        minutes = moment.utc(startTime.diff(endTime)).format('mm');
      }
    } else {
      hours = endTime.diff(startTime, 'hours');
      minutes = moment.utc(endTime.diff(startTime)).format('mm');
    }

    return [hours, minutes];
  }

  getKilometros(lat1, lon1, lat2, lon2): string {
    const rad = (x) => x * Math.PI / 180;
    // Radio de la tierra en km
    const R = 6378.137;
    const dLat = rad(lat2 - lat1);
    const dLong = rad(lon2 - lon1);
    // tslint:disable-next-line:max-line-length
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(rad(lat1)) * Math.cos(rad(lat2)) * Math.sin(dLong / 2) * Math.sin(dLong / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c;
    return d.toFixed(3);
  }

  validationAssistance(typeAssitance: any): void {
    this.dataSourceReports = [];

    switch (typeAssitance.value) {
      case 'Todos':
        this.dataSourceReports = new MatTableDataSource(this.reports);
        break;
      case 'Asistieron':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.hours !== 'No Registra'));
        break;
      case 'No asistieron':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.dateInit === 'No Registra' && data.dateEnd === 'No Registra'));
        break;
      case 'Asistieron sin salida':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.dateInit !== 'No Registra' && data.dateEnd === 'No Registra'));
        break;
      case 'Fuera de rango al ingreso':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.positionEntry !== 'Dentro del rango'));
        break;
      case 'Dentro de rango al ingreso':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.positionEntry === 'Dentro del rango'));
        break;
      case 'Dentro de rango a la salida':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.positionExit === 'Dentro del rango'));
        break;
      case 'Fuera de rango a la salida':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.positionExit !== 'Dentro del rango'));
        break;
      default:

        break;

    }

  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }
}
