import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from 'src/app/shared/shared.module';

import { CoordinatorsWorkCenterRoutingModule } from './coordinators-work-center-routing.module';
import { CoordinatorsWorkCenterComponent } from './coordinators-work-center.component';
import { DialogFormComponent } from './components/dialog-form/dialog-form.component';

@NgModule({
  declarations: [CoordinatorsWorkCenterComponent, DialogFormComponent],
  imports: [
    CommonModule,
    CoordinatorsWorkCenterRoutingModule,
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
  ]
})
export class CoordinatorsWorkCenterModule { }
