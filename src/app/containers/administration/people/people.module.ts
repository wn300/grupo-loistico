import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { SharedModule } from 'src/app/shared/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { PeopleRoutingModule } from './people-routing.module';
import { PeopleComponent } from './people.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { CompanyService } from '../company/services/company.service';
import { DialogUploadPeopleFileComponent } from './components/dialog-upload-people-file/dialog-upload-people-file.component';

@NgModule({
  declarations: [PeopleComponent, DialogFormComponent, DialogUploadPeopleFileComponent],
  imports: [
    CommonModule,
    PeopleRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [CompanyService]
})
export class PeopleModule { }
