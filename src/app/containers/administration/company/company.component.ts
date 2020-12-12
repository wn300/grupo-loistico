import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { Company } from './entity/company';
import { CompanyService } from './services/company.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-company',
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent implements OnInit, OnDestroy {
  public subscription: Subscription[];
  public titlePage: string;
  public subTitle: string;
  public companies: Company[];
  public displayedColumns: string[];
  public dataSourceCompanies;
  public isLoading: boolean;

  constructor(public dialog: MatDialog, private companyService: CompanyService, private snackBar: MatSnackBar) {
    this.titlePage = 'Empresa';
    this.subTitle = 'Empresas del sistema';
    this.companies = [];
    this.displayedColumns = ['code', 'identification', 'name', 'type', 'update', 'delete'];
    this.subscription = [];
    this.isLoading = true;
  }

  ngOnInit(): void {
    this.companyService.getCompanies()
      .subscribe(dataCompany => {
        this.companies = dataCompany.map((catData: any) => {
          return {
            id: catData.payload.doc.id,
            code: catData.payload.doc.data().code,
            identification: catData.payload.doc.data().identification,
            name: catData.payload.doc.data().name,
            type: catData.payload.doc.data().type
          };
        });

        this.companies = _.sortBy(this.companies, 'code');

        this.dataSourceCompanies = new MatTableDataSource(this.companies);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
  }

  addNewCompany(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Creación de empresa',
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormCompany: FormGroup) => {
        if (resultDialogFormCompany) {
          this.createCompany(resultDialogFormCompany.value);
        }
      });
  }

  createCompany(data: any): void {
    this.companyService.postCompany(data)
      .then(res => {
        this.openSnackBar('Empresa creada correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al crear empresa, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  editCompany(element: any): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Edición de empresa',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormCompany: FormGroup) => {
        if (resultDialogFormCompany) {
          const newElement = { name: element.name, identification: element.identification, type: element.type };
          const isEqual = _.isEqual(newElement, resultDialogFormCompany.value);

          if (!isEqual) {
            this.updateCompany(element.id, resultDialogFormCompany.value);
          }
        }
      });
  }

  updateCompany(id: string, data: any): void {
    this.companyService.putCompany(id, data)
      .then(res => {
        this.openSnackBar('Empresa editada correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al editar empresa, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  deleteCompany(element: any): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: `¿Esta seguro qe desea eliminar la empresa ${element.name}?`,
        actionClose: true
      }
    });

    dialogRef.afterClosed()
      .subscribe(result => {
        if (result) {
          this.companyService.deleteCompany(element.id)
            .then(res => {
              this.openSnackBar('Empresa eliminada correctamente', 'cerrar');
            })
            .catch(err => {
              this.openSnackBar('Error al eliminar empresa, verifique la información é intente de nuevo', 'cerrar');
            });
        }
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourceCompanies.filter = filterValue.trim().toLowerCase();
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
