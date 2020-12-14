import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

import { ProgrammingTemplate } from '../../entities/programming.entity';

@Component({
  selector: 'app-programming-items-excels-table',
  templateUrl: './items-excels-table.component.html',
  styleUrls: ['./items-excels-table.component.scss'],
})
export class ItemsExcelsTableComponent implements OnInit {
  @Input() data: ProgrammingTemplate[] = [];

  constructor() {}

  ngOnInit(): void {}

  public hasError(item: ProgrammingTemplate, value: number): boolean {
    return item.errorValues.indexOf(value) >= 0;
  }

  public mapDate(item: ProgrammingTemplate, format: 'date' | 'time'): string {
    const date = moment(`${item.date} ${item.time}`, 'DD/MM/YYYY HH:mm');
    return date.isValid()
      ? format === 'date' ? date.format('DD/MM/YYYY') : date.format('HH:mm')
      : 'Formato invalido';
  }
}
