import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subscription } from 'rxjs';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { PeopleService } from './services/people.service';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public titlePage: string;
  public subTitle: string;
  // public subscribe: Subscription;

  constructor(public dialog: MatDialog, private peopleService: PeopleService, private snackBar: MatSnackBar) {
    this.titlePage = 'Personas';
    this.subTitle = 'Usuarios del sistema';
  }

  ngOnInit(): void {
    // this.subscribe.unsubscribe();
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
