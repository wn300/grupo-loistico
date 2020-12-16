import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';
import * as moment from 'moment';

import { Programming } from './entities/programming.entity';
import { ProgrammingService } from './services/programming.service';
import { AddItemsFormComponent } from './components/add-items-form/add-items-form.component';
import { AddItemFormComponent } from './components/add-item-form/add-item-form.component';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss'],
})
export class ProgrammingComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public titlePage: string;
  public subTitle: string;
  public registries: Programming[] = [];
  public displayedColumns: string[];
  public isLoading: boolean = true;
  public dataSourceRegistries;

  constructor(
    private programmingService: ProgrammingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {
    this.titlePage = 'Programación';
    this.subTitle = 'Registros programados';
    this.displayedColumns = [
      'identification',
      'name',
      'date',
      'workplaceName',
      'operationName',
      'update',
      'delete',
    ];
  }

  ngOnInit(): void {
    this.programmingService.getProgramming().subscribe((data) => {
      this.registries = data.map((item: any) => {
        return {
          ...item.payload.doc.data(),
          id: item.payload.doc.id,
          date: new Date(item.payload.doc.data().date.seconds * 1000),
        };
      });

      this.registries = _.sortBy(this.registries, 'date');

      this.dataSourceRegistries = new MatTableDataSource(this.registries);
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    });
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  public openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceRegistries.filter = filterValue.trim().toLowerCase();
  }

  public addItem(): void {
    this.dialog.open(AddItemFormComponent, {
      width: '80%',
      data: {
        title: 'Agregar programación',
      },
      disableClose: true,
    });
  }

  public addItems(): void {
    this.dialog.open(AddItemsFormComponent, {
      width: '80%',
      data: {
        title: 'Agregar programación',
      },
      disableClose: true,
    });
  }
}
