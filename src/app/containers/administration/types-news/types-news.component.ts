import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { TypesNewsService } from './services/types-news.service';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { FormGroup } from '@angular/forms';
import { TypeNew, TypeNewPayload } from './entity/type-new.entity';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-administration-types-news',
  templateUrl: './types-news.component.html',
  styleUrls: ['./types-news.component.scss'],
})
export class TypesNewsComponent implements OnInit, OnDestroy {
  public subscriptions: Subscription[] = [];
  public titlePage: string;
  public subTitle: string;
  public types: any[] = [];
  public displayedColumns: string[] = [];
  public dataSourceTypes;
  public isLoading: boolean = false;

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private typesNewsService: TypesNewsService
  ) {
    this.titlePage = 'Tipos de Novedad';
    this.subTitle = 'Tipos de novedades registrados en el sistema';
    this.displayedColumns = ['id', 'name', 'update', 'delete'];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      this.typesNewsService.getAll().subscribe((data) => {
        this.types = _.sortBy(data, 'name');

        this.dataSourceTypes = new MatTableDataSource(this.types);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      })
    );
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
  }

  public applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceTypes.filter = filterValue.trim().toLowerCase();
  }

  public handleAdd() {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '400px',
      data: {
        title: 'Creación de tipo de novedad',
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data: TypeNewPayload) => {
      if (data) {
        this.typesNewsService
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

  public handleEdit(type: TypeNew) {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '400px',
      data: {
        title: 'Editar tipo de novedad',
        item: type,
      },
      disableClose: true,
    });

    dialogRef.afterClosed().subscribe((data: TypeNewPayload) => {
      if (data && data.id?.trim() !== '') {
        const { id, ..._data } = data;
        this.typesNewsService
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

  public handleDelete(element: TypeNew): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar la empresa ${element.name}?`,
        actionClose: true,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.typesNewsService
          .delete(element.id)
          .then((res) => {
            this.openSnackBar(
              'Tipo de novedad eliminada correctamente',
              'cerrar'
            );
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
}
