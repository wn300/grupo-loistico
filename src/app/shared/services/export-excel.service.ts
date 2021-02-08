import { Injectable } from '@angular/core';

import { Workbook } from 'exceljs';
import * as fs from 'file-saver';
import * as logo from '../assets/mylogo.js';

@Injectable({
  providedIn: 'root'
})
export class ExportExcelService {

  constructor() { }

  exportExcel(excelData): any {

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

      // const dateInit = row.getCell(3);
      // let colorDateInit = 'FF99FF99';
      // if (dateInit.value === 'No Registra') {
      //   colorDateInit = 'FF9999';
      // }

      // dateInit.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: colorDateInit }
      // };

      // const dateEnd = row.getCell(4);
      // let colorDateEnd = 'FF99FF99';
      // if (dateEnd.value === 'No Registra') {
      //   colorDateEnd = 'FF9999';
      // }

      // dateEnd.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: colorDateEnd }
      // };

      // const hours = row.getCell(5);
      // let colorHours = 'FF99FF99';
      // if (hours.value === 'No Registra') {
      //   colorHours = 'FF9999';
      // }

      // hours.fill = {
      //   type: 'pattern',
      //   pattern: 'solid',
      //   fgColor: { argb: colorHours }
      // };
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
    worksheet.getColumn(19).width = 20;
    worksheet.getColumn(20).width = 30;
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
