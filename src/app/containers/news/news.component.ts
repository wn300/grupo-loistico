import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { combineLatest, Subscription } from 'rxjs';
import * as _ from 'lodash';

import { NewsService } from './services/news.service';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { New, NewPayload } from './entity/new.entity';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { TypesNewsService } from '../administration/types-news/services/types-news.service';
import { TypeNew } from '../administration/types-news/entity/type-new.entity';
import { FUNCTIONS, PermissionsService } from 'src/app/core/services/permissions.service';
import { MODULE } from 'src/app/constants/app.constants';
import * as moment from 'moment';
import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logo from '../../../assets/mylogo.js';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.scss'],
})
export class NewsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public titlePage: string;
  public subTitle: string;
  public news: New[] = [];
  public types: TypeNew[] = [];
  public displayedColumns: string[] = [];
  public dataSourceNews;
  public isLoading: boolean = false;
  public startDate: Date;
  public endDate: Date;
  public people: any = [];
  public dataForExcel = [];

  private readonly _module: MODULE = MODULE.news;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private typesNewsService: TypesNewsService,
    private newsService: NewsService,
    private permissionsService: PermissionsService
  ) {
    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());
    this.startDate = moment(onlyDateNow).toDate();
    this.endDate = moment(onlyDateNow).toDate();
    this.titlePage = 'Novedades';
    this.subTitle = 'Novedades registradas en el sistema';
    this.displayedColumns = [
      'id',
      'identification',
      'name',
      'type',
      'dateStart',
      'dateEnd',
      'observations',
    ];

    this.newsService.getOnlyPeopleJoinCompany()
      .subscribe(data => {
        this.people = data;
      });
  }

  ngOnInit(): void {
    this.getReport();
  }

  getReport(): void {
    this.displayedColumns = [
      'id',
      'identification',
      'name',
      'type',
      'dateStart',
      'dateEnd',
      'observations',
    ];
    this.isLoading = true;
    if (this.startDate !== null && this.endDate !== null) {

      const startDate = moment(this.startDate).toDate();
      const endDate = moment(this.endDate).add(23, 'hours').add(59, 'minutes').add(59, 'seconds').toDate();

      this.subscriptions.push(
        combineLatest(
          this.newsService.getAllByDates(startDate, endDate),
          this.typesNewsService.getAll(),
          (news, typesNews) => ({ news, typesNews })
        ).subscribe((data) => {
          this.news = _.orderBy(data.news, ['dateStart'], ['desc']);
          this.types = data.typesNews;

          this.news = this.news.map((newItem) => {
            newItem.people = this.people.filter(peopleFilter => peopleFilter.id === newItem.peopleId)[0];
            return {
              ...newItem,
              type: this.types.find((type) => type.id === newItem.typeId),
            };
          });

          this.dataSourceNews = new MatTableDataSource(this.news);
          setTimeout(() => {
            this.isLoading = false;
          }, 100);
        })
      );

      if (this.permissionsService.canActiveFunction(this._module, FUNCTIONS.update)) {
        this.displayedColumns.push('update');
      }
      if (this.permissionsService.canActiveFunction(this._module, FUNCTIONS.delete)) {
        this.displayedColumns.push('delete');
      }
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  get canAdd(): boolean {
    return this.permissionsService.canActiveFunction(this._module, FUNCTIONS.add);
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceNews.filter = filterValue.trim().toLowerCase();
  }

  public handleAdd() {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      maxWidth: '600px',
      data: {
        title: 'Creación de novedad',
        typesNews: this.types,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data: NewPayload) => {
      if (data) {
        this.newsService
          .create(data)
          .then(() => {
            this.openSnackBar('Registro agregado correctamente', 'cerrar');
          })
          .catch(() => {
            this.openSnackBar(
              'Error al agregar el registro, verifique su conexión é intente de nuevo',
              'cerrar'
            );
          });
      }
    });
  }

  public handleEdit(type: New) {
    console.log(type);
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      maxWidth: '600px',
      data: {
        title: 'Editar novedad',
        typesNews: this.types,
        item: type,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data: NewPayload) => {
      if (data && data.id?.trim() !== '') {
        const { id, ..._data } = data;
        this.newsService
          .update(id, _data)
          .then(() => {
            this.openSnackBar('Registro guardado correctamente', 'cerrar');
          })
          .catch((err) => {
            this.openSnackBar(
              'Error al guardar el registro, verifique su conexión é intente de nuevo',
              'cerrar'
            );
          });
      }
    });
  }

  public handleDelete(element: New): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar la novedad?`,
        actionClose: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.newsService
          .delete(element.id)
          .then((res) => {
            this.openSnackBar('Novedad eliminada correctamente', 'cerrar');
          })
          .catch((err) => {
            this.openSnackBar(
              'Error al eliminar el registro, verifique su conexión é intente de nuevo',
              'cerrar'
            );
          });
      }
    });
  }

  private openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  exportToExcel(): void {
    this.dataForExcel = [];

    const mapperByDate = this.news.map((newData: any) => {
      const dateEnd = moment(newData.dateEnd);
      const dateStart = moment(newData.dateStart);
      const diff = dateEnd.diff(dateStart, 'days');

      let newArrayNews = [];

      for (let index = 0; index < diff + 1; index++) {
        const newObject = {
          ...newData,
          dateIteration: moment(newData.dateStart).add(index, 'days').format('DD/MM/YYYY')
        };
        newArrayNews = [...newArrayNews, newObject];
      }

      return newArrayNews;
    });

    const onlyDateNow = new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate());

    mapperByDate.forEach(mapper => {
      mapper.forEach((row: any) => {
        const newObject = {
          'Encab: Empresa': row.people.company.name,
          'Encab: Tipo Documento': '',
          'Encab: Prefijo': '',
          'Encab: Documento Número': row.identification,
          'Encab: Fecha': moment(onlyDateNow).format('DD/MM/YYYY'),
          'Encab: Tercero Interno': '',
          'Encab: Tercero Externo': '',
          'Encab: Nota': '',
          'Encab: Anulado': '',
          'Detalle: Empleado': row.name,
          'Detalle: Concepto': row.type.name,
          'Detalle: Fecha': row.dateIteration,
          'Detalle: Cantidad': row.type.name === 'Incapacidad' ? '1' : '8',
          'Detalle: Valor': '',
          'Detalle: Unidad Medida': row.type.name === 'Incapacidad' ? 'Dia' : 'Hora',
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
    });

    const reportData = {
      title: `Reporte de Novedades ${moment(this.startDate).format('DD/MM/YYYY')} - ${moment(this.endDate).format('DD/MM/YYYY')}`,
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
