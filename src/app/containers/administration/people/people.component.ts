import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import * as _ from 'lodash';

import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { People } from './entity/people';
import { PeopleService } from './services/people.service';
import { DialogUploadPeopleFileComponent } from './components/dialog-upload-people-file/dialog-upload-people-file.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public titlePage: string;
  public subTitle: string;
  public subscription: Subscription[];
  public people: People[];
  public displayedColumns: string[];
  public dataSourcePeople;
  public isLoading: boolean;

  constructor(public dialog: MatDialog,
    private peopleService: PeopleService,
    private snackBar: MatSnackBar) {
    this.titlePage = 'Personas';
    this.subTitle = 'Usuarios del sistema';
    this.people = [];
    this.displayedColumns = [
      'names',
      'date',
      'identification',
      'company',
      'phone',
      'memberShip',
      'email',
      'position',
      'status',
      'update'
    ];
    this.subscription = [];
    this.isLoading = true;
  }


  ngOnInit(): void {
    this.peopleService.getCompanies()
      .subscribe((companies) => {
        this.peopleService.getPeople()
          .subscribe(dataPeople => {
            console.log(companies);

            this.people = dataPeople.map((catData: any) => {
              return {
                id: catData.payload.doc.id,
                identification: catData.payload.doc.data().identification,
                names: `${catData.payload.doc.data().firstName} ${catData.payload.doc.data().secondName} ${catData.payload.doc.data().firstLastName} ${catData.payload.doc.data().secondLastName}`,
                date: catData.payload.doc.data().dateAdmission.toDate(),
                company: companies.filter(filt => filt.code === catData.payload.doc.data().company),
                phone: catData.payload.doc.data().phone,
                memberShip: catData.payload.doc.data().memberShip,
                email: catData.payload.doc.data().email,
                position: catData.payload.doc.data().position,
                status: catData.payload.doc.data().status,
                city: catData.payload.doc.data().city,
                dayOfRest: catData.payload.doc.data().dayOfRest,
                address: catData.payload.doc.data().address,
                dateAdmission: catData.payload.doc.data().dateAdmission.toDate(),
                firstName: catData.payload.doc.data().firstName,
                secondName: catData.payload.doc.data().secondName,
                firstLastName: catData.payload.doc.data().firstLastName,
                secondLastName: catData.payload.doc.data().secondLastName,
                manager: catData.payload.doc.data().manager,
                uid: catData.payload.doc.data().uid,
              };
            });
            console.log(this.people);

            this.dataSourcePeople = new MatTableDataSource(this.people);
            setTimeout(() => {
              this.isLoading = false;
            }, 100);
          });
      })

  }

  addNewPeople(): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Creación de persona',
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormPeople: FormGroup) => {
        if (resultDialogFormPeople) {
          this.createPeople(resultDialogFormPeople.value);
        }
      });
  }

  createPeople(data: any): any {
    const authData = {
      email: data.email,
      password: data.identification
    };

    this.peopleService.postUserAuth(authData)
      .then(res => {
        this.peopleService.postPeople(data, res.user.uid)
          .then(res => {
            this.openSnackBar('Usuario creado correctamente', 'cerrar');
          })
          .catch(err => {
            this.openSnackBar('Error al crear usuaro, verifique la información é intente de nuevo', 'cerrar');
          });
      })
      .catch(err => {
        this.openSnackBar('Error al crear usuaro, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  createPeopleMasiv(data: any): any {
    const authData = {
      email: data.email,
      password: data.identification
    };

    this.peopleService.postUserAuth(authData)
      .then(res => {
        this.peopleService.postPeople(data, 'idmasivo')
          .then(res => {
            this.openSnackBar('Usuario creado correctamente', 'cerrar');
          })
          .catch(err => {
            this.openSnackBar('Error al crear usuaro, verifique la información é intente de nuevo', 'cerrar');
          });
      })
      .catch(err => {
        this.openSnackBar('Error al crear usuaro, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSourcePeople.filter = filterValue.trim().toLowerCase();
  }

  editPeople(element: any): void {
    const dialogRef = this.dialog.open(DialogFormComponent, {
      width: '80%',
      data: {
        title: 'Edición de persona',
        data: element
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe((resultDialogFormPeople: FormGroup) => {
        if (resultDialogFormPeople) {
          const newElement = {
            name: element.name,
            identification: element.identification,
            city: element.city,
            contact: element.contact,
            phone: element.phone,
            email: element.email
          };
          const isEqual = _.isEqual(newElement, resultDialogFormPeople.value);

          if (!isEqual) {
            this.updatePeople(element.id, resultDialogFormPeople.value);
          }
        }
      });
  }

  updatePeople(id: string, data: any): void {
    this.peopleService.putPeople(id, data)
      .then(res => {
        this.openSnackBar('Persona editada correctamente', 'cerrar');
      })
      .catch(err => {
        this.openSnackBar('Error al editar persona, verifique la información é intente de nuevo', 'cerrar');
      });
  }

  addFilePeople(): void {
    const dialogRef = this.dialog.open(DialogUploadPeopleFileComponent, {
      width: '80%',
      data: {
        title: 'Creacion desde plantilla',
        data: []
      },
      disableClose: true
    });

    dialogRef.afterClosed()
      .subscribe(dataSendPostAll => {
        dataSendPostAll.forEach(element => {
          this.createPeopleMasiv(element);
        });
      });
  }

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
