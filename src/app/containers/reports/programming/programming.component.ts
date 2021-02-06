import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';

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

  selected = 'Todos';
  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(private progrmmingService: ProgrmmingService) {
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
      'transport',
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
                      if (parseFloat(elementPrograming.identification) === parseFloat(elementReports.email.split('@')[0])) {
                        const diffTime = this.diffHours(elementPrograming.date.toDate(), elementReports.createAt.toDate());

                        if ((diffTime[0] === 0 && diffTime[1] <= 15 && elementReports.type === 'Llegada')
                          || ((diffTime[0] <= 12 && diffTime[0] > 0) && elementReports.type === 'Salida')) {

                          const x1 = elementPrograming.workCenter.latitude;
                          const y1 = elementPrograming.workCenter.longitude;
                          const x2 = elementReports.location.latitude;
                          const y2 = elementReports.location.longitude;

                          const km = this.getKilometros(x1, y1, x2, y2);

                          console.log((parseFloat(km) * 1000), x1, y1, x2, y2);

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
