import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormsModule } from '@angular/forms';
import { MatNativeDateModule } from '@angular/material/core';

import { AppUsersRoutingModule } from './app-users-routing.module';
import { AppUsersComponent } from './app-users.component';


@NgModule({
  declarations: [AppUsersComponent],
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatIconModule,
    MatCheckboxModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    SharedModule,
    MatDatepickerModule,
    MatNativeDateModule,
    AppUsersRoutingModule
  ]
})
export class AppUsersModule { }
