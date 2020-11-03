import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() isSmallScreen: boolean;

  public sesion: any;

  constructor(public dialog: MatDialog) {
    this.sesion = {
      name: 'Wilmer Mancera'
    }
  }

  ngOnInit(): void {
  }

  logOut(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Advertencia!!!',
        question: 'Esta proximo a cerrar sesión ¿Desea continuar?',
        actionClose: true
      }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

}
