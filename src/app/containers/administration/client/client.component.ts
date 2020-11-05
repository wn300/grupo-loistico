import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { Client } from './entity/client';
import { ClientService } from './services/client.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public clients: Client[];
  public displayedColumns: string[];
  public dataSourceClients;
  public isLoading: boolean;

  constructor(public dialog: MatDialog, private clientService: ClientService, private snackBar: MatSnackBar) {
    this.titlePage = 'Cliente';
    this.subTitle = 'Clientes del sistema';
    this.clients = [];
    this.displayedColumns = ['identification', 'name', 'city', 'contact', 'phone', 'email', 'update', 'delete'];
    this.subscription = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.clientService.getClients()
      .subscribe(dataClients => {
        this.clients = dataClients.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name,
            city: catData.payload.doc.data().city,
            contact: catData.payload.doc.data().contact,
            phone: catData.payload.doc.data().phone,
            email: catData.payload.doc.data().email
          };
        });
        this.dataSourceClients = new MatTableDataSource(this.clients);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
  }

  addNewClient(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Creación de cliente',
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormClient: FormGroup) => {
        if (resultDialogFormClient) {
          this.createClient(resultDialogFormClient.value);
        }
      });
  }

  createClient(data: any): void {
    this.clientService.postClient(data)
      .then(res => {
        this.openSnackBar('Cliente creado correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al crear cliente, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  editClient(element: any): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Edición de cliente',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormClient: FormGroup) => {
        if (resultDialogFormClient) {
          const newElement = {
            name: element.name,
            identification: element.identification,
            city: element.city,
            contact: element.contact,
            phone: element.phone,
            email: element.email
          };
          const isEqual = _.isEqual(newElement, resultDialogFormClient.value);

          if (!isEqual) {
            this.updateClient(element.id, resultDialogFormClient.value);
          }
        }
      });
  }

  updateClient(id: string, data: any): void {
    this.clientService.putClient(id, data)
      .then(res => {
        this.openSnackBar('Cliente editado correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al editar cliente, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  deleteClient(element: any): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar el cliente ${element.name}?`,
        actionClose: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.clientService.deleteClient(element.id)
            .then(res => {
              this.openSnackBar('Cliente eliminado correctamente', 'cerrar');
            })
            .catch(err => {
              this.openSnackBar('Error al eliminar cliente, verifique la información é intente de nuevo', 'cerrar');
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceClients.filter = filterValue.trim().toLowerCase();
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
