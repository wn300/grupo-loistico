import { Component, OnDestroy, OnInit } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logo from '../../../../assets/mylogo.js';

import { People, PeopleNew } from '../../administration/people/entity/people';
import { PeopleService } from '../../administration/people/services/people.service';
import { Programming } from '../../programming/entities/programming.entity';
import { ProgrammingService } from '../../programming/services/programming.service';
import { NewsService } from '../../news/services/news.service';
import { take } from 'rxjs/operators';
import { New } from '../../news/entity/new.entity';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-not-scheduled',
  templateUrl: './not-scheduled.component.html',
  styleUrls: ['./not-scheduled.component.scss'],
})
export class NotScheduledComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public titlePage: string;
  public subTitle: string;
  public peopleNotScheduled: People[] = [];
  public peopleNotScheduledNew: PeopleNew[] = [];
  public displayedColumns: string[];
  public dataSourcePeopleNotScheduled;
  public dataSourcePeopleNotScheduledNew;
  public isLoading: boolean;
  public dateFilter: string;
  public date = new FormControl(new Date());

  private people: People[] = [];
  private programmings: Programming[] = [];
  private news: New[] = [];

  public dataForExcel = [];
  public dataForExcelWith = [];

  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(
    private readonly peopleService: PeopleService,
    private readonly programmingService: ProgrammingService,
    private readonly newsService: NewsService
  ) {
    this.titlePage = 'Reporte de no programados';
    this.subTitle =
      'Reportes de programación contra lista de usuarios en la app';

    this.displayedColumns = [
      'identification',
      'names',
      'company',
      'phone',
      'memberShip',
      'email',
      'position',
      'dayOfRest',
    ];
    this.isLoading = true;

    this.dateFilter = moment().format(this.dateFormat);
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.peopleService.getOnlyPeopleSupernumerariaJoinCompany().subscribe((data) => {
        this.people = data.map((item) => {
          return {
            ...item,
            names: `${item.firstName} ${item.secondName
              } ${item.firstLastName} ${item.secondLastName
              }`,
          };
        });
        this.isLoading = false;
        this.getReports();
      })
    );
    this.subscriptions.push(
      this.date.valueChanges.subscribe((date: Date) => {
        this.dateFilter = moment(date).format(this.dateFormat);
        this.getReports();
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  public getReports(): void {
    const dateFrom = moment(this.dateFilter, this.dateFormat).toDate();
    const dateTo = moment(this.dateFilter, this.dateFormat)
      .add(1, 'days')
      .toDate();
    this.isLoading = true;
    combineLatest(
      this.programmingService.getProgrammingByDates(dateFrom, dateTo),
      this.newsService.getAllByDates(
        moment(dateFrom).add(1, 'days').toDate(),
        moment(dateTo).subtract(1, 'days').toDate()
      ),
      (programming, news) => ({ programming, news })
    )
      .pipe(take(1))
      .subscribe((data) => {
        this.programmings = data.programming.map((item: any) => {
          return {
            ...item.payload.doc.data(),
            date: new Date(item.payload.doc.data().date.seconds * 1000),
            dateFormat: moment(
              item.payload.doc.data().date.seconds * 1000
            ).format(this.dateFormat),
          };
        });
        this.news = data.news;
        this.getNotScheduled();
      });
  }

  private getNotScheduled(): void {
    const peopleNotScheduled = this.people.filter((people) => {
      const programming = this.programmings.find(
        (item) => item.identification === people.identification
      );
      return !programming;
    });
    this.peopleNotScheduled = [];
    this.peopleNotScheduledNew = [];
    peopleNotScheduled.forEach((item) => {
      const _new = this.news.find((_new) => _new.peopleId === item.id);
      if (_new) this.peopleNotScheduledNew.push({ ...item, new: _new });
      else this.peopleNotScheduled.push(item);
    });

    this.dataSourcePeopleNotScheduled = new MatTableDataSource(
      this.peopleNotScheduled
    );
    this.dataSourcePeopleNotScheduledNew = new MatTableDataSource(
      this.peopleNotScheduledNew
    );

    console.log(this.peopleNotScheduled, this.peopleNotScheduledNew);

    setTimeout(() => {
      this.isLoading = false;
    }, 100);
  }

  exportToExcel(): void {
    this.dataForExcel = [];
    this.dataForExcelWith = [];

    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.peopleNotScheduled.forEach((row: any) => {
      const newObject = {
        'Encab: Empresa': row.company.name,
        'Encab: Tipo Documento': '',
        'Encab: Prefijo': '',
        'Encab: Documento Número': row.identification,
        'Encab: Fecha': moment(onlyDateNow).format('DD/MM/YYYY'),
        'Encab: Tercero Interno': '',
        'Encab: Tercero Externo': '',
        'Encab: Nota': '',
        'Encab: Anulado': '',
        'Detalle: Empleado': row.names,
        'Detalle: Concepto': '',
        'Detalle: Fecha': this.dateFilter,
        'Detalle: Cantidad': '',
        'Detalle: Valor': '',
        'Detalle: Unidad Medida': '',
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
      title: `Reporte de no programados sin novedad ${this.dateFilter}`,
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

    this.exportExcel(reportData, 'Sin Novedad');

    this.peopleNotScheduledNew.forEach((row: any) => {
      const newObjectWith = {
        'Encab: Empresa': row.company.name,
        'Encab: Tipo Documento': '',
        'Encab: Prefijo': '',
        'Encab: Documento Número': row.identification,
        'Encab: Fecha': moment(onlyDateNow).format('DD/MM/YYYY'),
        'Encab: Tercero Interno': '',
        'Encab: Tercero Externo': '',
        'Encab: Nota': '',
        'Encab: Anulado': '',
        'Detalle: Empleado': row.names,
        'Detalle: Concepto': '',
        'Detalle: Fecha': this.dateFilter,
        'Detalle: Cantidad': '',
        'Detalle: Valor': '',
        'Detalle: Unidad Medida': '',
        'Detalle: Centro Costos': '',
        'Detalle: Nota': '',
        'Detalle: Proceso': '',
        'Detalle: Pasa a Nómina': '',
        'Detalle: Aprobado': '',
        'Detalle: Usuario Aprueba': '',
        'Detalle: Código Centro Costos': ''
      };
      this.dataForExcelWith.push(Object.values(newObjectWith));
    });

    const reportDataWith = {
      title: `Reporte de no programados con novedad ${this.dateFilter}`,
      data: this.dataForExcelWith,
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

    this.exportExcel(reportDataWith, 'Con Novedad');
  }

  exportExcel(excelData: any, message: string): any {

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
}
