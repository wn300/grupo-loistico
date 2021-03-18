import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import * as moment from 'moment';
import { Subscription } from 'rxjs';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logo from '../../../../assets/mylogo.js';

import { AppUserService } from './services/app-user.service';

@Component({
  selector: 'app-app-users',
  templateUrl: './app-users.component.html',
  styleUrls: ['./app-users.component.scss']
})
export class AppUsersComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public reports: any[];
  public displayedColumns: string[];
  public dataSourceReports;
  public isLoading: boolean;
  public startDate: Date;
  public endDate: Date;
  public companies: any[];
  public positions: any[];
  public dataForExcel = [];
  selected = 'Todos';

  private readonly dateFormat = 'DD/MM/YYYY';

  constructor(public reportsService: AppUserService) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.startDate = moment(onlyDateNow).toDate();
    this.endDate = moment(onlyDateNow).toDate();

    this.titlePage = 'Reportes';
    this.subTitle = 'Reportes desde la App';
    this.subscription = [];
    this.reports = [];
    this.displayedColumns = [
      'createByIdentification',
      'createBy',
      'company',
      'type',
      'date',
      'address',
      'description',
      'position',
      'images'
    ];
    this.positions = [
      'Todos',
      'Supernumerarios',
      'Operadores Logisticos'
    ];
    this.isLoading = true;
    this.reportsService.getCompany()
      .subscribe(data => {
        this.companies = data;
      });
  }

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): Subscription {
    this.isLoading = true;
    if (this.startDate !== null && this.endDate !== null) {
      this.selected = 'Todos';
      const startDate = moment(this.startDate).toDate();
      const endDate = moment(this.endDate).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').toDate();

      return this.reportsService.getReportsByFilesByDates(startDate, endDate)
        .subscribe(data => {
          this.reports = data
          .filter(filt => filt.people.undefined === undefined)
          .map(dataMapper => {
              return {
                ...dataMapper,
                createByIdentification: dataMapper.people.identification,
                createByNames: `${dataMapper.people.firstName} ${dataMapper.people.secondName} ${dataMapper.people.firstLastName} ${dataMapper.people.secondLastName}`,
                position: dataMapper.people.position,
                company: this.companies.filter(filwc => filwc.code === dataMapper.people.company)[0],
                date: dataMapper.createAt.toDate(),
              };    
          });

          this.dataSourceReports = new MatTableDataSource(this.reports);
          setTimeout(() => {
            this.isLoading = false;
          }, 100);
        });
    }
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceReports.filter = filterValue.trim().toLowerCase();
  }

  exportToExcel(): void {
    this.dataForExcel = [];
    const filterReports = this.selected !== 'Todos' ? this.reports
      .filter(data => data.position === this.selected) : this.reports;

    filterReports.forEach((row: any) => {
      const newObject = {
        Identificacion: row.createByIdentification,
        Nombre: row.createByNames,
        Empresa: row.company.name,
        Tipo: row.type,
        'Fecha y Hora': moment(row.date).format('DD/MM/YYYY HH:mm:ss'),
        Direccion: row.address,
        Descripcion: row.description,
        Cargo: row.position,
      };
      this.dataForExcel.push(Object.values(newObject));
    });

    const reportData = {
      title: `Reporte de aplicación ${moment(this.startDate).format('DD/MM/YYYY')} - ${moment(this.endDate).format('DD/MM/YYYY')}`,
      data: this.dataForExcel,
      headers: [
        'Identificacion',
        'Nombre',
        'Empresa',
        'Tipo',
        'Fecha y Hora',
        'Direccion',
        'Descripcion',
        'Cargo'
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
    const worksheet = workbook.addWorksheet('Novedades');


    // Add Row and formatting
    worksheet.mergeCells('C1', 'F4');
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
    worksheet.mergeCells('G1:H4');
    const d = new Date();
    const date = d.getDate() + '-' + d.getMonth() + '-' + d.getFullYear();
    const dateCell = worksheet.getCell('G1');
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

    worksheet.getColumn(1).width = 20;
    worksheet.getColumn(2).width = 30;
    worksheet.getColumn(3).width = 20;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 30;
    worksheet.getColumn(7).width = 40;
    worksheet.getColumn(8).width = 20;
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

  validationAssistance(typeAssitance: any): void {
    this.dataSourceReports = [];

    switch (typeAssitance.value) {
      case 'Todos':
        this.dataSourceReports = new MatTableDataSource(this.reports);
        break;
      case 'Supernumerario':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.position === 'Supernumerario'));
        break;
      case 'Operador Logistico':
        this.dataSourceReports = new MatTableDataSource(this.reports.filter(data => data.position === 'Operador Logistico'));
        break;
    }

  }

  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(data => data.unsubscribe());
    }
  }
}
