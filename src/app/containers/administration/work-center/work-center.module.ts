
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';

import { WorkCenterRoutingModule } from './work-center-routing.module';
import { WorkCenterComponent } from './work-center.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';
import { WorkCenterService } from './services/work-center.service';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [WorkCenterComponent, DialogFormComponent],
  imports: [
    CommonModule,
    WorkCenterRoutingModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSnackBarModule,
    MatProgressBarModule,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
  ],
  providers: [WorkCenterService]
})
export class WorkCenterModule { }
