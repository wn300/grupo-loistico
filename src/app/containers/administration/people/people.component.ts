import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';

import { WorkCenter } from '../work-center/entity/work-center';
import { WorkCenterService } from '../work-center/services/work-center.service';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { People } from './entity/people';
import { PeopleService } from './services/people.service';

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
      'city',
      'dayOfRest',
      'update'
    ];
    this.subscription = [];
    this.isLoading = true;
  }


  ngOnInit(): void {
    this.peopleService.getPeople()
      .subscribe(dataPeople => {
        debugger
        this.people = dataPeople.map((catData: any) => {

          return {
            id: catData.payload.doc.id,
            identification: catData.payload.doc.data().identification,
            names: `${catData.payload.doc.data().firstName} ${catData.payload.doc.data().secondName} ${catData.payload.doc.data().firstLastName} ${catData.payload.doc.data().secondLastName}`,
            date: catData.payload.doc.data().dateAdmission.toDate(),
            company: catData.payload.doc.data().company,
            phone: catData.payload.doc.data().phone,
            memberShip: catData.payload.doc.data().memberShip,
            email: catData.payload.doc.data().email,
            position: catData.payload.doc.data().position,
            status: catData.payload.doc.data().status,
            city: catData.payload.doc.data().city,
            dayOfRest: catData.payload.doc.data().dayOfRest
          };
        });
        this.dataSourcePeople = new MatTableDataSource(this.people);
        setTimeout(() => {
          this.isLoading = false;
        }, 100);
      });
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
          this.createClient(resultDialogFormPeople.value);
        }
      });
  }

  createClient(data: any): void {
    const authData = {
      email: data.email,
      password: data.identification
    };
    this.peopleService.postUserAuth(authData)
      .then(res => {
        this.peopleService.postPeople(data)
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

  openSnackBar(message: string, action: string): void {
    this.snackBar.open(message, action, {
      duration: 2000,
    });
  }

}
