import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { take } from 'rxjs/operators';
import { USER_LOCAL_KEY } from 'src/app/core/constants/user.constants';
import { LocalStorageService } from 'src/app/core/services/local-storage.service';
import { UsersService } from 'src/app/core/services/users.service';
import { DialogConfirmComponent } from 'src/app/shared/components/dialog-confirm/dialog-confirm.component';
import { containersRootRoute } from '../containers-routing.module';
import { homeRootRoute } from '../home/home-routing.module';
import { authenticationRootRoute } from './authentication-routing.module';
import { AuthenticationService } from './services/authentication.service';

@Component({
  selector: 'app-authentication',
  templateUrl: './authentication.component.html',
  styleUrls: ['./authentication.component.scss'],
})
export class AuthenticationComponent implements OnInit {
  public hide: boolean;
  public loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router,
    public dialog: MatDialog
  ) {
    this.hide = true;

    this.authenticationService.currentUser.subscribe((data) => {
      if (data) {
        this.router.navigate([`${containersRootRoute}/${homeRootRoute}`]);
      }
    });
  }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  singIn(loginForm: FormGroup): void {
    if (loginForm.valid) {
      const email = `${loginForm.value.email}`;
      const password = loginForm.value.password;
      this.authenticationService
        .signInWithEmail(email, password)
        .then(
          (data) => {},
          (error) => {
            this.errorMessageUsserAndPassword();
          }
        )
        .catch((error) => {
          this.errorMessageUsserAndPassword();
        });
    } else {
      //alert('no ok');
    }
  }

  resetPassword(): void {
    this.authenticationService
      .resetPasswordInit('wilmer.mancera93@gmail.com')
      .then(
        (data) => {
          console.log(data);
        },
        (error) => {
          console.log('error');
        }
      )
      .catch((error) => {
        console.log('error');
      });
  }

  private errorMessageUsserAndPassword(): void {
    const dialogRef = this.dialog.open(DialogConfirmComponent, {
      width: '500px',
      data: {
        title: '¡¡¡Error!!!',
        question: 'Usuario o contraseña incorrectos, intente nuevamente.',
        actionClose: false,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {});
  }
}
