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
import {
  FUNCTIONS,
  PermissionsService,
} from 'src/app/core/services/permissions.service';
import { MODULE } from 'src/app/constants/app.constants';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

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

  private readonly _module: MODULE = MODULE.news;

  constructor(
    private programmingService: ProgrammingService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private permissionsService: PermissionsService
  ) {
    this.titlePage = 'Programación';
    this.subTitle = 'Registros programados';
    this.displayedColumns = [
      'identification',
      'name',
      'date',
      'workplaceName',
      'operationName',
      'city',
      'client',
    ];
  }

  ngOnInit(): void {
    this.programmingService.getProgramming().subscribe((data) => {
      this.registries = data.map((item: any) => {
        return {
          ...item,
          id: item.id,
          date: new Date(item.date.seconds * 1000),
        };
      });

      this.registries = _.sortBy(this.registries, 'date');

      this.dataSourceRegistries = new MatTableDataSource(this.registries);
      setTimeout(() => {
        this.isLoading = false;
      }, 100);
    });

    if (
      this.permissionsService.canActiveFunction(this._module, FUNCTIONS.update)
    ) {
      this.displayedColumns.push('update');
    }
    if (
      this.permissionsService.canActiveFunction(this._module, FUNCTIONS.delete)
    ) {
      this.displayedColumns.push('delete');
    }
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  get canAdd(): boolean {
    return this.permissionsService.canActiveFunction(
      this._module,
      FUNCTIONS.add
    );
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

  public updateItem(element: Programming): void {
    this.dialog.open(AddItemFormComponent, {
      width: '80%',
      data: {
        title: 'Agregar programación',
        item: element,
      },
      disableClose: true,
    });
  }

  public deleteItem(element: Programming): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro que desea eliminar la programación de ${element.name}?`,
        actionClose: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.programmingService
          .deleteProgramming(element.id)
          .then((res) => {
            this.openSnackBar('Programación eliminada correctamente', 'cerrar');
          })
          .catch((err) => {
            this.openSnackBar(
              'Error al eliminar la programación, verifique la información é intente de nuevo',
              'cerrar'
            );
          });
      }
    });
  }
}
