import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { MatTableDataSource } from '@angular/material/table';
import { CoordinatorsWorkCenterService } from './services/coordinators-work-center.service';
import { FormGroup } from '@angular/forms';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-coordinators-work-center',
  templateUrl: './coordinators-work-center.component.html',
  styleUrls: ['./coordinators-work-center.component.scss']
})
export class CoordinatorsWorkCenterComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public coordinatorsWorkCenters: any[];
  public displayedColumns: string[];
  public dataSourceCoordinatorsWorkCenters;
  public isLoading: boolean;

  constructor(
    public dialog: MatDialog,
    private coordinatorsWorkCenterService: CoordinatorsWorkCenterService,
    private snackBar: MatSnackBar
  ) {
    this.titlePage = 'Coordinadores de centros de trabajo';
    this.subTitle = 'Coordinadores de centros de trabajo del sistema';
    this.coordinatorsWorkCenters = [];
    this.displayedColumns = [
      'workCenterCode',
      'workCenterName',
      'identification',
      'name',
      'update',
      'delete'
    ];
    this.subscription = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.coordinatorsWorkCenterService.getCoordinatorsWorkCenters()
      .subscribe(dataCoordinatorsWorkCenters => {
        this.coordinatorsWorkCenters = dataCoordinatorsWorkCenters.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            workCenterCode: catData.payload.doc.data().workCenterCode,
            workCenterName: catData.payload.doc.data().workCenterName,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name,
          };
        });
        this.dataSourceCoordinatorsWorkCenters = new MatTableDataSource(this.coordinatorsWorkCenters);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
  }

  addNewCoordinatorWorkCenter(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Creación de coordinadores de centros de trabajo',
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormWorkCenter: FormGroup) => {
        if (resultDialogFormWorkCenter) {
          this.createCoordinatorWorkCenter(resultDialogFormWorkCenter.value);
        }
      });
  }

  createCoordinatorWorkCenter(data: any): void {
    this.coordinatorsWorkCenterService.postCoordinatorsWorkCenter(data)
      .then(res => {
        this.openSnackBar('Centro de trabajo creado correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al crear centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  editCoordinatorWorkCenter(element: any): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Edición de coordinadores de centros de trabajo',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogCoordinatorFormWorkCenter: FormGroup) => {
        if (resultDialogCoordinatorFormWorkCenter) {
          const newElement = {
            name: element.name,
            identification: element.identification,
            workCenterCode: element.city,
            workCenterCodeName: element.contact
          };
          const isEqual = _.isEqual(newElement, resultDialogCoordinatorFormWorkCenter.value);

          if (!isEqual) {
            this.updateCoordinatorWorkCenter(element.id, resultDialogCoordinatorFormWorkCenter.value);
          }
        }
      });
  }

  updateCoordinatorWorkCenter(id: string, data: any): void {
    this.coordinatorsWorkCenterService.putCoordinatorsWorkCenter(id, data)
      .then(res => {
        this.openSnackBar('Centro de trabajo editado correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al editar centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  deleteCoordinatorWorkCenter(element: any): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar el coordinador del centro de trabajo ${element.name}?`,
        actionClose: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.coordinatorsWorkCenterService.deleteCoordinatorsWorkCenter(element.id)
            .then(res => {
              this.openSnackBar('Coordinador de centro de trabajo eliminado correctamente', 'cerrar');
            })
            .catch(err => {
              this.openSnackBar('Error al eliminar centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCoordinatorsWorkCenters.filter = filterValue.trim().toLowerCase();
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

  ngOnDestroy(): void {
    if (this.subscription.length > 0) {
      this.subscription.forEach(data => data.unsubscribe());
    }
  }

}
