import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import * as _ from 'lodash';
import { Subscription } from 'rxjs';

import { ExportExcelService } from 'src/app/shared/services/export-excel.service';
import { DialogEditComponent } from './components/dialog-edit/dialog-edit.component';

import { ProgrmmingService } from './services/progrmming.service';
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
  dataForExcel = [];

  selected = 'Todos';
  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(private progrmmingService: ProgrmmingService,
    public ete: ExportExcelService,
    public dialog: MatDialog
  ) {
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
      'messageInit',
      'dateEnd',
      'hourEnd',
      'messageEnd',
      'hours',
      'observations',
      'applicantName',
      'identificationWorckCenter',
      'workCenter',
      'codeOperation',
      'operation',
      'positionEntry',
      'positionExit',
      'addressEntry',
      'addressExit'
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
        'Fecha inicio',
        'Hora inicio',
        'Fecha fin',
        'Hora fin',
        'Horas',
        'Observacion',
        'Solicitante',
        'Fecha programada',
        'Hora programada',
        'Id centro de trabajo',
        'Centro de trabajo',
        'Cod operacion',
        'Localizacion entrada',
        'Localizacion salida',
        'Direccion entrada',
        'Direccion salida',
        'Modificado',
        'Motivo modificacion'
      ]
    };

    this.ete.exportExcel(reportData);
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
        console.log(resultDialogForm);

        // if (resultDialogFormPeople) {
        //   const newElement = {
        //     name: element.name,
        //     identification: element.identification,
        //     city: element.city,
        //     contact: element.contact,
        //     phone: element.phone,
        //     email: element.email
        //   };
        //   const isEqual = _.isEqual(newElement, resultDialogFormPeople.value);

        //   if (!isEqual) {
        //     this.updatePeople(element.id, resultDialogFormPeople.value);
        //   }
        // }
      });
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
}
