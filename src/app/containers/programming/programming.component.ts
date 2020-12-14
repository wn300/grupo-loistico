import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { AddItemsFormComponent } from './components/add-items-form/add-items-form.component';

@Component({
  selector: 'app-programming',
  templateUrl: './programming.component.html',
  styleUrls: ['./programming.component.scss'],
})
export class ProgrammingComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public registries: any[];
  public displayedColumns: string[];
  public dataSourceCompanies;
  public isLoading: boolean;

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar) {
    this.titlePage = 'Programación';
    this.subTitle = 'Registros programados';
    this.registries = [];
    this.displayedColumns = [];
    this.subscriptions = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.isLoading = false;
      this.registries = [];
    }, 2000);
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

  public addItems(): void {
    const dialogRef = this.dialog.open(AddItemsFormComponent, {
      width: '80%',
      data: {
        title: 'Agregar programación',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((resultForm: any) => {
      console.log(resultForm);
    });
  }
}
