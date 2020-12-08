import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Subscription } from 'rxjs';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';

@Component({
  selector: 'app-people',
  templateUrl: './people.component.html',
  styleUrls: ['./people.component.scss']
})
export class PeopleComponent implements OnInit {
  public titlePage: string;
  public subTitle: string;
  // public subscribe: Subscription;

  constructor(public dialog: MatDialog) {
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
          console.log(resultDialogFormPeople.value);

          // this.createClient(resultDialogFormPeople.value);
        }
      });
  }

}
