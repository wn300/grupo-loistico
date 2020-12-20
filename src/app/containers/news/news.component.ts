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

  constructor(
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private typesNewsService: TypesNewsService,
    private newsService: NewsService
  ) {
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
      'update',
      'delete',
    ];
  }

  ngOnInit(): void {
    this.subscriptions.push(
      combineLatest(
        this.newsService.getAll(),
        this.typesNewsService.getAll(),
        (news, typesNews) => ({ news, typesNews })
      ).subscribe((data) => {
        this.news = _.orderBy(data.news, ['dateStart'], ['desc']);
        this.types = data.typesNews;

        this.news = this.news.map((newItem) => {
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
  }

  ngOnDestroy(): void {
    if (this.subscriptions.length > 0) {
      this.subscriptions.forEach((data) => data.unsubscribe());
    }
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
            this.openSnackBar(
              'Novedad eliminada correctamente',
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
