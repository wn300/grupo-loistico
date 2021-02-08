import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { ExportExcelService } from 'src/app/shared/services/export-excel.service';

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
  dataForExcel = [];

  selected = 'Todos';
  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(private progrmmingService: ProgrmmingService, public ete: ExportExcelService) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate(), 12, 59, 59);
    this.startDate = moment(onlyDateNow).subtract(1, 'days').toDate();
    this.endDate = moment(onlyDateNow).add(1, 'days').toDate();

    this.titlePage = 'Reporte de programación';
    this.subTitle = 'Reportes de programación conta el reporte de usuarios por la app';
    this.displayedColumns = [
      'identification',
      'name',
      'dateInit',
      'hourInit',
      'dateEnd',
      'hourEnd',
      'hours',
      'observations',
      'applicantName',
      'dateProgramming',
      'hourProgramming',
      'identificationWorckCenter',
      'workCenter',
      'codeOperation',
      'operation',
      'positionEntry',
      'positionExit',
      'addressEntry',
      'addressExit',
    ];

    this.isLoading = true;
  }

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    if (this.startDate !== null && this.endDate !== null) {
      this.selected = 'Todos';
      this.dataSourceReports = [];
      this.reports = [];

      const startDate = moment(this.startDate, this.dateFormat).toDate();
      const endDate = moment(this.endDate, this.dateFormat).toDate();


      this.progrmmingService.getPrograming(startDate, endDate)
        .subscribe(
          dataPrograming => {
            if (dataPrograming.length > 0) {
              this.progrmmingService.getReportsUsers(startDate, endDate)
                .subscribe(dataReports => {
                  const reportProgramming = dataPrograming.map(elementPrograming => {
                    const reportUser = [];
                    dataReports.forEach(elementReports => {
                      if (elementReports.type !== 'Incapacidad') {
                        if (parseFloat(elementPrograming.identification) === parseFloat(elementReports.email.split('@')[0])) {
                          const diffTime = this.diffHours(elementPrograming.date.toDate(), elementReports.createAt.toDate());

                          if ((diffTime[0] === 0 && diffTime[1] <= 15 && elementReports.type === 'Llegada')
                            || ((diffTime[0] <= 12 && diffTime[0] > 0) && elementReports.type === 'Salida')) {

                            const x1 = elementPrograming.workCenter.latitude;
                            const y1 = elementPrograming.workCenter.longitude;
                            const x2 = elementReports.location.latitude;
                            const y2 = elementReports.location.longitude;

                            const km = this.getKilometros(x1, y1, x2, y2);

                            let position = 'Fuera de rango';
                            if ((parseFloat(km) * 1000) <= 300) {
                              position = 'Dentro del rango';
                            }

                            reportUser.push({
                              ...elementReports,
                              date: elementReports.createAt.toDate(),
                              position,
                              diferenceHours: diffTime,
                              identificationUser: parseFloat(elementReports.email.split('@')[0]),
                            });
                          }
                        }
                      }
                    });

                    return {
                      ...elementPrograming,
                      date: elementPrograming.date.toDate(),
                      reportUser,
                    };
                  });

                  this.reports = reportProgramming.map(mapperObject => {
                    const hoursDiff = mapperObject.reportUser[0] !== undefined && mapperObject.reportUser[1] !== undefined ?
                      this.diffHours(mapperObject.reportUser[0].date, mapperObject.reportUser[1].date) :
                      undefined;

                    const entry = mapperObject.reportUser.filter(init => init.type === 'Llegada');
                    const exit = mapperObject.reportUser.filter(init => init.type === 'Salida');

                    const objectReturn = {
                      identification: mapperObject.identification,
                      name: mapperObject.name,
                      dateInit: entry.length > 0 ? entry[0].date : 'No Registra',
                      dateEnd: exit.length > 0 ? exit[0].date : 'No Registra',
                      hours: hoursDiff !== undefined ? `${hoursDiff[0]}:${hoursDiff[1]}` : 'No Registra',
                      observations: mapperObject.observation,
                      applicantName: mapperObject.applicantName,
                      dateProgramming: moment(mapperObject.date, this.dateFormat),
                      identificationWorckCenter: mapperObject.workCenter.identification,
                      workCenter: mapperObject.workCenter.name,
                      codeOperation: mapperObject.workCenter.operationCode,
                      operation: mapperObject.workCenter.operation,
                      transport: mapperObject.transport === true ? 'Si' : 'No',
                      positionEntry: entry.length > 0 ? entry[0].position : 'No Registra',
                      positionExit: exit.length > 0 ? exit[0].position : 'No Registra',
                      addressEntry: entry.length > 0 ? entry[0].address : 'No Registra',
                      addressExit: exit.length > 0 ? exit[0].address : 'No Registra',
                    }

                    return objectReturn;
                  });
                  this.dataSourceReports = new MatTableDataSource(this.reports);

                  setTimeout(() => {
                    this.isLoading = false;
                  }, 100);

                });
            } else {
              this.reports = [];
              setTimeout(() => {
                this.isLoading = false;
              }, 100);
            }
          },
          error => console.log(error));
    }
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

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReports.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel(): void {
    this.dataForExcel = [];
    this.reports.forEach((row: any) => {
      const newObject = {
        Identificacion: row.identification,
        Nombre: row.name,
        'Fecha inicio': row.dateInit === 'No Registra' ? row.dateInit : moment(row.dateInit).format('DD/MM/YYYY'),
        'Hora inicio': row.dateInit === 'No Registra' ? row.dateInit : moment(row.dateInit).format('HH:mm:ss'),
        'Fecha fin': row.dateEnd === 'No Registra' ? row.dateEnd : moment(row.dateEnd).format('DD/MM/YYYY'),
        'Hora fin': row.dateEnd === 'No Registra' ? row.dateEnd : moment(row.dateEnd).format('HH:mm:ss'),
        Horas: row.hours,
        Observacion: row.observations,
        Solicitante: row.applicantName,
        'Fecha programada': moment(row.dateProgramming).format('DD/MM/YYYY'),
        'Hora programada': moment(row.dateProgramming).format('HH:mm:ss'),
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

  digitThrird(cordenada: number): any {
    return parseFloat(cordenada.toString().split('.')[1].slice(2, 3));
  }

  diffHours(startDate, endDate): any {
    const startTime = moment(startDate, 'HH:mm:ss');
    const endTime = moment(endDate, 'HH:mm:ss');

    let hours = 0;
    let minutes = '';
    // calculate total duration
    if (startDate < endDate) {
      hours = endTime.diff(startTime, 'hours');
      minutes = moment.utc(endTime.diff(startTime)).format('mm');
    } else {
      hours = startTime.diff(endTime, 'hours');
      minutes = moment.utc(startTime.diff(endTime)).format('mm');
    }
    return [hours, minutes];
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
