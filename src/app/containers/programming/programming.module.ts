import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatRadioModule } from '@angular/material/radio';

import { ProgrammingRoutingModule } from './programming-routing.module';
import { ProgrammingComponent } from './programming.component';
import { AddItemFormComponent } from './components/add-item-form/add-item-form.component';
import { AddItemsFormComponent } from './components/add-items-form/add-items-form.component';
import { UploadItemsFormComponent } from './components/upload-items-form/upload-items-form.component';
import { ItemsExcelsTableComponent } from './components/items-excels-table/items-excels-table.component';
import { PeopleModule } from '../administration/people/people.module';
import { WorkCenterModule } from '../administration/work-center/work-center.module';
import { ProgrammingService } from './services/programming.service';
import { OperationCenterService } from './services/operation-center.service';
import { NgxMatDatetimePickerModule, NgxMatNativeDateModule, NgxMatTimepickerModule } from '@angular-material-components/datetime-picker';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [
    ProgrammingComponent,
    AddItemFormComponent,
    AddItemsFormComponent,
    UploadItemsFormComponent,
    ItemsExcelsTableComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatAutocompleteModule,
    MatButtonModule,
    MatDatepickerModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSnackBarModule,
    MatInputModule,
    MatCardModule,
    MatIconModule,
    MatProgressBarModule,
    MatRadioModule,
    MatTableModule,
    MatToolbarModule,
    NgxMatNativeDateModule,
    NgxMatDatetimePickerModule,
    NgxMatTimepickerModule,
    ProgrammingRoutingModule,
    PeopleModule,
    WorkCenterModule,
  ],
  providers: [ProgrammingService, OperationCenterService],
})
export class ProgrammingModule {}
