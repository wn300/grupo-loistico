import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { WorkCenter } from './entity/work-center';
import { WorkCenterService } from './services/work-center.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-work-center',
  templateUrl: './work-center.component.html',
  styleUrls: ['./work-center.component.scss']
})
export class WorkCenterComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public workCenters: WorkCenter[];
  public displayedColumns: string[];
  public dataSourceWorkCenters;
  public isLoading: boolean;

  constructor(public dialog: MatDialog, private workCentersService: WorkCenterService, private snackBar: MatSnackBar) {
    this.titlePage = 'Centros de trabajo';
    this.subTitle = 'Centros de trabajo del sistema';
    this.workCenters = [];
    this.displayedColumns = [
      'operationCode',
      'operation',
      'identification',
      'name',
      'city',
      'address',
      'client',
      'coordinator',
      'phone',
      'update',
      'delete'
    ];
    this.subscription = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.workCentersService.getWorkCenters()
      .subscribe(dataWorkCenters => {
        this.workCenters = dataWorkCenters.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name,
            city: catData.payload.doc.data().city,
            operation: catData.payload.doc.data().operation,
            operationCode: catData.payload.doc.data().operationCode,
            address: catData.payload.doc.data().address,
            latitude: catData.payload.doc.data().latitude,
            longitude: catData.payload.doc.data().longitude,
            client: catData.payload.doc.data().client,
            coordinator: catData.payload.doc.data().coordinator,
            coordinatorIdentification: catData.payload.doc.data().coordinatorIdentification,
            phone: catData.payload.doc.data().phone
          };
        });
        this.dataSourceWorkCenters = new MatTableDataSource(this.workCenters);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
  }

  addNewWorkCenter(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Creación de centros de trabajo',
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormWorkCenter: FormGroup) => {
        if (resultDialogFormWorkCenter) {
          this.createWorkCenter(resultDialogFormWorkCenter.value);
        }
      });
  }

  createWorkCenter(data: any): void {
    this.workCentersService.postWorkCenter(data)
      .then(res => {
        const opartionCenterObject = {
          code: data.operationCode,
          name: data.operation,
          workCenterCode: data.identification
        };

        this.workCentersService.postOperationCenter(opartionCenterObject)
          .then(resOperation => {
            this.openSnackBar('Centro de trabajo creado correctamente', 'cerrar');
          })
          .catch(err => {
            this.openSnackBar('Error al crear centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
          });
      })
      .catch(err => {
        this.openSnackBar('Error al crear centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  editWorkCenter(element: any): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Edición de centros de trabajo',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormWorkCenter: FormGroup) => {
        if (resultDialogFormWorkCenter) {
          const newElement = {
            name: element.name,
            identification: element.identification,
            city: element.city,
            contact: element.contact,
            phone: element.phone,
            email: element.email
          };
          const isEqual = _.isEqual(newElement, resultDialogFormWorkCenter.value);

          if (!isEqual) {
            this.updateWorkCenter(element.id, resultDialogFormWorkCenter.value);
          }
        }
      });
  }

  updateWorkCenter(id: string, data: any): void {
    this.workCentersService.putWorkCenter(id, data)
      .then(res => {
        const opartionCenterObject = {
          code: data.operationCode,
          name: data.operation,
          workCenterCode: data.identification
        };

        this.workCentersService.getOperacionCenters()
          .subscribe(operationCentersData => {
            const operationCentersMapper = operationCentersData.map((catData: any) => {
              return {
                id: catData.payload.doc.id,
                ...catData.payload.doc.data()
              };
            });

            const idOperationCenter = operationCentersMapper.filter(operationCenter => operationCenter.code === data.operationCode)[0];
            this.workCentersService.putOperationCenter(idOperationCenter.id, opartionCenterObject)
            .then(resOperation => {
              this.openSnackBar('Centro de trabajo editado correctamente', 'cerrar');
            })
            .catch(err => {
              this.openSnackBar('Error al editar centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
            });
          });
      })
      .catch(err => {
        this.openSnackBar('Error al editar centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  deleteWorkCenter(element: any): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar el centro de trabajo ${element.name}?`,
        actionClose: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.workCentersService.deleteWorkCenter(element.id)
            .then(res => {
              this.openSnackBar('Centro de trabajo eliminado correctamente', 'cerrar');
            })
            .catch(err => {
              this.openSnackBar('Error al eliminar centro de trabajo, verifique la información é intente de nuevo', 'cerrar');
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceWorkCenters.filter = filterValue.trim().toLowerCase();
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
