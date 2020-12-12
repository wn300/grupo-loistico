import { Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { authenticationRootRoute } from 'src/app/containers/authentication/authentication-routing.module';
import { AuthenticationService } from 'src/app/containers/authentication/services/authentication.service';
import { containersRootRoute } from 'src/app/containers/containers-routing.module';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';

@Component({
  selector: 'app-options',
  templateUrl: './options.component.html',
  styleUrls: ['./options.component.scss']
})
export class OptionsComponent implements OnInit {
  @Input() isSmallScreen: boolean;

  public sesion: any;

  constructor(public dialog: MatDialog, private authenticationService: AuthenticationService, private router: Router) {
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
      if (result) {
        this.authenticationService.logout();
        this.router.navigate([`${containersRootRoute}/${authenticationRootRoute}`]);
      }
    });
  }

}
